import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { capitalize, errorResponse, getChannel, responseMessage } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex, getDowntimeNames, getProficiencies } from './itemsList.js';
import { getDX, filterItems, requestCharacterRegistration } from './extraUtils.js';
import { readDataFile, characterExists, setValueDowntime, getCharacters, setCharacters } from './data/dataIO.js';
import { startCharacterDowntimeThread, rollCharacterDowntimeThread, westmarchRewardLogResult, acceptTransaction } from "./componentResponse.js";
import sqlite3 from 'sqlite3';
import { Client, IntentsBitField, ThreadChannel } from "discord.js";

/**
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").command} command
 * @typedef {import("./types.js").options} options
 * @typedef {import("./types.js").option} option
 * @typedef {import("./types.js").user} user
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("./types.js").autocompleteObject} autocompleteObject
 * @typedef {import("./types.js").item} item
 * @typedef {import("discord.js").Message} Message
 */

/** @type {Client} */
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
  ],
});

client.on('ready', (c) => {
  console.log("Bot is running");
});

/** @type {sqlite3.Database} */
const db = new sqlite3.Database('./trader.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the trader.db SQLite database.');
  }
});

/** @type {[string, item][]} */
const allItems = getSanesItemPrices();
const allItemNames = getSanesItemNameIndex();

const downtimeNames = getDowntimeNames();
const proficiencyNames = getProficiencies();

/** @type {Map<string, string[]>} */
const lastItemResult = new Map();

/**
 * @param {option[]} options 
 * @param {string} id 
 * @return {responseObject} JS Object for interaction.reply()
 */
function getItemsInRange(options, id) {
  /** @type {number} */
  let minPrice = options[0].value;
  /** @type {number} */
  let maxPrice = options[1].value;

  // swap the min and max if they're the wrong way around
  if(minPrice > maxPrice) {
    minPrice = minPrice ^ maxPrice;
    maxPrice = minPrice ^ maxPrice;
    minPrice = minPrice ^ maxPrice;
  }

  const itemsInRange = filterItems(maxPrice, minPrice).sort((a, b) => a[1].price - b[1].price);

  let result = [""];
  let j = 0;
  for (let i = 0; i < itemsInRange.length; i++) {
    const nextSection = "- " + itemsInRange[i][0] + " " + itemsInRange[i][1].price + "gp\n";
    if (nextSection.length + result[j].length > 2000) {
      j++;
      result[j] = ""
    }
    result[j] += nextSection;
  }

  if(j == 0){
    return {
        content: result[0],
        ephemeral: true,
    };
  }

  lastItemResult.set(id, result);
  
  const minutesTillDeletion = 5;
  setTimeout(
    () => {
      lastItemResult.delete(id);
    }, 1000 * 60 * minutesTillDeletion);

  return {
    content: result[0],
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
              type: MessageComponentTypes.BUTTON,
              custom_id: `itemspage_1_`+id,
              label: "Load more items",
              style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

/**
 * @callback queryMethod
 * @param {number} level
 * @param {number} roll
 * @return {string}
 */

/** @type {Map<number, queryMethod} */
const downtimeQuery = new Map();
downtimeQuery.set(0, (level, roll) => "SELECT outcome FROM job_rewards WHERE (level = " + level +" AND roll_result = "+ roll +");");
downtimeQuery.set(1, (level, roll) => "SELECT outcome FROM crime_downtime WHERE (level = " + level +" AND roll_result = "+ roll +");");
downtimeQuery.set(2, (level, roll) => "SELECT outcome FROM xp_rewards WHERE (level = " + level +" AND roll_result = "+ roll +");");

/**
 * @param {number} downtimeType 
 * @param {number} level 
 * @param {number} roll 
 * @return {string}
 */
function getDowntimeQuery(downtimeType, level, roll){
  const queryMethod = downtimeQuery.get(downtimeType);
  return queryMethod(level, roll);
}

function sqlite3Query(query, callback){
  const sql = query;
  db.all(sql, [], callback);
}

/**
 * @param {interaction} interaction 
 * @param {[{value: string},{value: number},{value: number}]} options 
 * @param {string} userID 
 * @return {responseObject | void}
 */
function getDowntimeSQLite3(interaction, options, userID) {
  const downtimeType = parseInt(options[0].value);
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  if(!characterExists(userID, characterName)){
    return interaction.reply(requestCharacterRegistration("doDowntime", characterName, [downtimeType, characterLevel]));
  }

  const roll = getDX(100);
  const query = getDowntimeQuery(downtimeType, characterLevel, roll);
  
  sqlite3Query(query, (err, rows) => {
    if (err) {
      console.log(err);
      return err.message;
    }
    interaction.reply({
      content: `<@${userID}>\nCharacter: "`+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + "\nEvent: \nEffect: " + rows[0].outcome,
    });
  })
}

/**
 * @param {string} itemID 
 * @param {string} characterName 
 * @param {string} userID 
 * @return {responseObject} JS Object for interaction.reply()
 */
function downtimeCraftItem(itemID, characterName, userID) {
  const [itemName, {price}] = allItems[parseInt(itemID)];

  if(!characterExists(userID, characterName)){
    return requestCharacterRegistration("itemCraft", characterName, [itemID]);
  }

  return {
    content: `${characterName} (<@${userID}>) wants to craft ${itemName}.\n` +
      `Material cost: ${price}\n` +
      `You will need to succeed on a craft check using a tool proficiency.\n` +
      `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n` +
      "If you have another item in progress, starting a new item will overwrite that one.",
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
              type: MessageComponentTypes.BUTTON,
              custom_id: `characterThread_${userID}_` + itemID + "_" + characterName,
              label: "Start crafting",
              style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

function downtimeChangeItem() {
  return errorResponse("Not implemented", true);
}

/**
 * 
 * @param {string} userID 
 * @param {[{value: string},{value: number},{value: string}]} options 
 * @param {bool} isBuying 
 * @return {responseObject} JS Object for interaction.reply()
 */
function doTrade(userID, options, isBuying) {
  const itemIndex = parseInt(options[0].value);
  const itemCount = options[1].value;
  const characterName = options[2].value;
  
  if(!characterExists(userID, characterName)){
    return requestCharacterRegistration("doTrade", characterName, [itemIndex, itemCount, isBuying]);
  }

  if(itemIndex == -1) {
    return errorResponse('Item "' + allItemNames[itemIndex][0] + '" can not be found.\nIt may be misspelled.');
  }
  if(itemCount < 1) {
    return errorResponse("Can not trade less items than 1");
  }

  const realPrice = allItems[itemIndex][1].price / (isBuying ? 1 : 2);
  
  const itemName = capitalize(allItems[itemIndex][0]);

  const typeName = isBuying ? 'Buy' : "Sell";
  return {
    content: "Character: " + characterName + '\nItem: ' + itemName + " x" + itemCount +'\nPrice: ' + (itemCount * realPrice) + (itemCount > 1 ? "gp (" + realPrice + "gp each)" : "gp"),
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
              type: MessageComponentTypes.BUTTON,
              custom_id: `acceptTransactionButton_${realPrice}_${itemName}_${itemCount}_${typeName}_${characterName}`,
              label: typeName,
              style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

/**
 * 
 * @param {boolean} isRegister 
 * @param {string} characterName
 * @param {user} user 
 * @return {responseObject} JS Object for interaction.reply()
 */
function registration(isRegister, characterName, user) {
  try{
    let userCharacters = getCharacters(user);

    if (userCharacters.length >= 11) 
      return errorResponse("You already have 10 characters.");
    
    const exists = userCharacters.includes(characterName);
    
    if(isRegister) {
      if (exists) 
        return errorResponse("You have a character with that name already.");
      
      userCharacters.push(characterName);
      setCharacters(user.id, userCharacters);

      return {
        content: "Character added.",
        ephemeral: true,
      };
    }

    if (!exists) 
      return errorResponse("Please input a valid name.");
    
    const charIndex = userCharacters.indexOf(characterName);

    userCharacters.splice(charIndex, 1);
    
    setCharacters(user.id, userCharacters);
    return {
      content: "Character removed.",
      ephemeral: true,
    };
  } catch(err) {
    console.error('Error sending message:', err);
  }
}

/**
 * @param {user} user 
 * @return {responseObject} JS Object for interaction.reply()
 */
function showCharacters(user) {
  let userCharacters = getCharacters(user);
  
  //remove username from list
  userCharacters.shift();
  
  return {
    content: "Your characters:\n- " + userCharacters.join("\n- "),
    ephemeral: true,
  };
}

/**
 * @param {string} currentInput 
 * @param {user} user 
 * @return {autocompleteObject[]} JS autocomplete Object for interaction.respond()
 */
function characterNamesAutoComplete(currentInput, user) {
  let userCharacters = getCharacters(user);

  //remove username from list
  userCharacters.shift();

  const matchingOptions = userCharacters.filter((charName) =>
    charName.toLowerCase().startsWith(currentInput.toLowerCase())
  );

  /** @type {autocompleteObject[]} */
  const matchingOptionsIndex = matchingOptions.map((charName) => {
    return {
      name: `${charName}`,
      value: `${charName}`}
  });

  const result = matchingOptionsIndex.slice(0, 25);

  return result;
}

/**
 * @param {string} currentInput 
 * @return {autocompleteObject[]} JS autocomplete Object for interaction.respond()
 */
function itemNamesAutoComplete(currentInput) {
  const matchingOptions = allItemNames.filter((itemName) =>
    itemName.toLowerCase().startsWith(currentInput.toLowerCase())
  );
  
  const matchingOptionsIndex = matchingOptions.map((itemName) => {
    return {
      name: `${itemName}`,
      value: `${allItemNames.indexOf(itemName)}`}
  });

  const result = matchingOptionsIndex.slice(0, 25);

  return result;
}

/**
 * @param {option[]} options 
 * @param {user} dm 
 * @return {responseObject} JS Object for interaction.reply()
 */
function westmarchLog(options, dm) {
  const xpReceived = options[0].value;
  
  if(xpReceived < 0)
    return errorResponse("Please only use positive values.");

  return {
      content: `<@${dm.id}>\nSelect participating players`,
      ephemeral: true,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.USER_SELECT,
              custom_id: `westmarchrewardlog_` + dm.id + "_" + xpReceived,
              min_values: 1,
              max_values: 20,
            },
          ],
        },
      ],
  };
} 

/**
 * Sends the command explanation as mutliple messages.
 * 
 * Messages are read from ./data/explanation.txt
 * 
 * Start of next message is marked by \newline (use it to stay below discord max message length)
 * @param {Client} client 
 * @param {string} channelID 
 */
function explainMe(client, channelID) {
  const messages = readDataFile("data/explanation.txt").split("\\newLine");
  const channel = getChannel(client, channelID);

  for(let i = 0; i < messages.length; i++) {
    setTimeout(() => {
      channel.send({ content: messages[i] })
    }, 500 * i);
  }

  return responseMessage("Explanation sent", true);
}

/** 
 * @param {interaction} interaction 
 * @return {command} Parsed command
*/
function parseFullCommand(interaction) {
  /** @type {command} */
  const command = {
    commandName: interaction.commandName,
    options: null
  }
  if(!Object.hasOwn(interaction, 'options')) return command;
  
  const group = interaction.options._group;
  const subcommand = interaction.options._subcommand;
  command.commandName +=  (group == null ? "" : " " + group) +
                              (subcommand == null ? "" : " " + subcommand)
  
  const options = interaction.options._hoistedOptions;
  if(options == null) return command;
  
  command.options = options;

  return command;
} 

/**
 * Send response with matching items
 * @param {interaction} interaction 
 * @param {user} user 
 * @return {void}
 */
function handleAutocomplete(interaction, user) {
  const { commandName, options } = parseFullCommand(interaction);
    
  let searchType = "";
  let currentInput = "";
  switch(commandName) {
    case "westmarch character unregister":
      currentInput = options[0].value;
      searchType = "character";
      break;

    case "westmarch downtime":
      currentInput = options[1].value;
      searchType = "character";
      break;

    case "westmarch buy":
    case "westmarch sell":
    case "westmarch item-downtime craft": 
      let i = 0
      for(let j = 0; j < 3; j++){
        if(options[i].focused) break;
        i++; 
      }
      currentInput = options[i].value;

      searchType = options[i].name; // is either item or character
      break;

    //case "westmarch item-downtime change":
    //  break; 
  }
  // at this point, current input are the letters given to find the characters name.
  if(searchType == "item") {
    try {
      interaction.respond(itemNamesAutoComplete(currentInput));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
  else if(searchType == "character") {
    try {
      interaction.respond(characterNamesAutoComplete(currentInput, user));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
}

/**
 * 
 * @param {interaction} interaction 
 * @param {string} componentId 
 * @param {user} user 
 * @return {responseObject | null} JS Object for interaction.reply()
 */
function handleComponentPreEvent(interaction, componentId, user) {
  const partsPre = componentId.split("_");
  partsPre.shift();
  
  registration(true, partsPre[1], user);

  let result = null;

  switch(partsPre[0]) {
    case "itemCraft":
      result = downtimeCraftItem(partsPre[2], partsPre[1], user.id);
      break;
    case "doTrade":
      const itemIndex = partsPre[2];
      const itemCount = parseInt(partsPre[3]);
      const isBuying = partsPre[4] === "true";

      result = doTrade(user.id, [{value: itemIndex}, {value: itemCount}, {value: partsPre[1]}], isBuying);
      break;
    case "doDowntime":
      const downtimeType = partsPre[2];
      const characterLevel = parseInt(partsPre[3]);

      getDowntimeSQLite3(interaction, [{value: downtimeType}, {value: partsPre[1]}, {value: characterLevel}], user.id);
      break;
    default:
      result = errorResponse("Unknown command");
      break;
  }

  interaction.deleteReply(interaction.message);
  return result;
}

/**
 * @param {string[]} parts 
 * @return {responseObject} JS Object for interaction.reply()
 */
function displayItemsInRange(parts) {
  const j = parseInt(parts[1]);
  const originalID = parts[2];

  const itemPages = lastItemResult.get(originalID);
  if(itemPages == undefined)
    return errorResponse("Request has expired. Please resend command.");

  if(j + 1 >= itemPages.length)
    return {
      content: itemPages[j],
      ephemeral: true,
    }

  return {
    content: itemPages[j],
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: `itemspage_` + (j + 1) + "_" + originalID,
            label: "Load more items",
            style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

const rareSeperator = "$.$=$";

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});

client.on('interactionCreate', 
  /** @param {interaction} interaction */
  (interaction) => {
  try{
    const { type, id } = interaction;
    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return interaction.respond({ type: InteractionResponseType.PONG });
    }

    const userID = interaction.member.user.id;
    const channelID = interaction.channelId;

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { commandName, options } = parseFullCommand(interaction);
      
      let isTrue = false; 
      switch(commandName) {
        case "explanationtrader": 
          return interaction.reply(explainMe(client, channelID));
        case "getitemsinrange": 
          return interaction.reply(getItemsInRange(options, id));
        case "westmarch item-downtime craft": 
          if(interaction.channel instanceof ThreadChannel) 
            return interaction.reply(errorResponse("Needed thread can't be created in thread or forum"));
          return interaction.reply(downtimeCraftItem(options[0].value, options[1].value, userID));
        
        case "westmarch item-downtime change": 
          return interaction.reply(downtimeChangeItem());
        
        case "westmarch reward": 
          return interaction.reply(westmarchLog(options, interaction.member.user));
        
        case "westmarch buy": 
          isTrue = true;
        case "westmarch sell": 
          return interaction.reply(doTrade(userID, options, isTrue));
        
        case "westmarch character register": 
          isTrue = true;
        case "westmarch character unregister": 
          return interaction.reply(registration(isTrue, options[0].value, interaction.member.user));
        case "westmarch character show": 
          return interaction.reply(showCharacters(interaction.member.user));
        case "westmarch downtime":
          getDowntimeSQLite3(interaction, options, userID); 
      }
    }

    else if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) { // is Autocomplete
      return handleAutocomplete(interaction, interaction.member.user);
    }

    else if (type === InteractionType.MESSAGE_COMPONENT) {
      let componentId = interaction.customId;
      const parts = componentId.split("_");

      /** @type {Message} */
      const message = interaction.message;

      try {
        if(componentId.startsWith(rareSeperator)) {
          const response = handleComponentPreEvent(interaction, componentId, interaction.member.user);
          return response !== null ? interaction.reply(response) : null;
        }
        
        const creatorID = parts[1];
        let isTrue = false;
        switch(parts[0]){
          case "itemspage":
            return interaction.reply(displayItemsInRange(parts));
          case "downtimeItemProfSelect":
            isTrue = true;
          case "downtimeItemProfMod":
            if(interaction.member.user.id != creatorID) 
              return;
            const messageID = parts[2];
            const characterName = parts[3];
            let proficiency = interaction.values[0];
            
            if (isTrue) { 
              setValueDowntime(userID, characterName, "crafting", messageID, "proficiency", proficiency)
              return interaction.reply(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
            }
            proficiency = parseInt(proficiency);
            setValueDowntime(userID, characterName, "crafting", messageID, "profMod", proficiency)
            return interaction.reply(responseMessage("Proficiency level is set to " + proficiency, true));
            
          case "characterThread":
            return interaction.reply(startCharacterDowntimeThread(message, parts, interaction.member.user.id, interaction.message.id, interaction.token));
          case "characterThreadFinished":
            return interaction.reply(rollCharacterDowntimeThread(parts, interaction.member.user.id, interaction));
          case "westmarchrewardlog":
            return interaction.reply(westmarchRewardLogResult(parts, interaction.message.createdTimestamp, interaction));
          case "acceptTransactionButton":
            return interaction.reply(acceptTransaction(componentId, userID));
        }
      } 
      catch (err) {
        console.error('Error sending message:', err);
      }
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);