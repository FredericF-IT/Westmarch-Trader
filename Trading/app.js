// @ts-check
import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { capitalize, CHARACTER_TRACKING_CHANNEL, DOWNTIME_LOG_CHANNEL, errorResponse, getChannel, InstallGlobalCommands, responseMessage, TRANSACTION_LOG_CHANNEL } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex } from './itemsList.js';
import { getDowntimeNames, getProficiencies, getDowntimes, getDowntimeTables } from "./downtimes.js";
import { getDX, filterItems, requestCharacterRegistration, isAdmin } from './extraUtils.js';
import { characterExists, setValueDowntime, getCharacters, setCharacters } from './data/dataIO.js';
import { startCharacterDowntimeThread, rollCharacterDowntimeThread, westmarchRewardLogResult, acceptTransaction } from "./componentResponse.js";
import sqlite3 from 'sqlite3';
import { Client, IntentsBitField, User } from "discord.js";
import { ALL_COMMANDS } from './commands.js';
import { explanationMessage } from './explanation.js';

/**
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").command} command
 * @typedef {import("./types.js").options} options
 * @typedef {import("./types.js").option} option
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

/** @type {[string, ...item[]][]} */
const allItems = getSanesItemPrices();
const allItemNames = getSanesItemNameIndex();
const allItemNamesLower = allItemNames.map(v => v.toLowerCase());

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

  const itemsInRange = filterItems(minPrice, maxPrice).sort((a, b) => a[1].price - b[1].price);

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
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
              type: MessageComponentTypes.BUTTON.valueOf(),
              // @ts-ignore
              custom_id: `itemspage_1_`+id,
              label: "Load more items",
              style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
        ],
      },
    ],
  };
}

/**
 * 
 * @param {interaction} interaction 
 * @param {*} userID 
 * @param {*} characterName 
 * @param {*} characterLevel 
 * @param {*} downtimeType 
 * @param {*} roll 
 * @param {string} event 
 * @param {string} effect 
 */
async function sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, event, effect) {
  const channel = getChannel(client, DOWNTIME_LOG_CHANNEL);
  // @ts-ignore
  await channel.send({
    content: `<@${userID}>\nCharacter: "`+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + "\nEvent: " + event + "\nEffect: " + effect,
  }).then((/** @type {Message} */ message) => {
    interaction.reply(responseMessage(
      (interaction.channelId != DOWNTIME_LOG_CHANNEL ? `Result was sent to <#${DOWNTIME_LOG_CHANNEL}>\n` : "") +
      `Copy this to your character sheet in <#${CHARACTER_TRACKING_CHANNEL}>:\n` + 
      `\`\`\`**Downtime summary**\nLink: ${message.url}\nEffect: ${effect}\`\`\``,
      true));
  });
}

const downtimeTables = getDowntimeTables();

/**
* @param {interaction} interaction 
* @param {[{value: string},{value: string},{value: number}] | option[]} options 
* @param {string} userID 
 * @return {Promise | void}
*/
function getDowntime(interaction, options, userID) {
  const downtimeType = options[0].value;
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  if(!characterExists(userID, characterName)){
    return interaction.reply(requestCharacterRegistration("doDowntime", characterName, [downtimeType, characterLevel]));
  }

  const roll = getDX(100);

  const rollGroup = Math.floor((roll - 1) / 10);

  const event = downtimeTables[downtimeType][1].table[0][rollGroup];
  const effect = downtimeTables[downtimeType][1].table[characterLevel - 1][rollGroup];

  sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, event, effect);
}

/**
 * 
 * @param {string} query 
 * @param {(err: Error | null, rows: Object[]) => void} callback 
 */
function sqlite3Query(query, callback){
  const sql = query;
  db.all(sql, [], callback);
}

/**
 * @callback queryMethod
 * @param {number} level
 * @param {number} roll
 * @return {string}
 */

/** @type {Map<number, queryMethod>} */
const downtimeQuery = new Map();
downtimeQuery.set(0, (level, roll) => "SELECT outcome FROM job_rewards WHERE (level = " + level +" AND roll_result = "+ roll +");");
downtimeQuery.set(1, (level, roll) => "SELECT outcome FROM crime_downtime WHERE (level = " + level +" AND roll_result = "+ roll +");");
downtimeQuery.set(2, (level, roll) => "SELECT outcome FROM xp_rewards WHERE (level = " + level +" AND roll_result = "+ roll +");");

/**
 * @param {interaction} interaction 
 * @param {[{value: string},{value: string},{value: number}] | option[]} options 
 * @param {string} userID 
 * @return {Promise | void}
 */
function getDowntimeSQLite3(interaction, options, userID) {
  const downtimeType = parseInt(options[0].value);
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  if(!characterExists(userID, characterName)){
    return interaction.reply(requestCharacterRegistration("doDowntime", characterName, [downtimeType, characterLevel]));
  }

  const roll = getDX(100);
  // @ts-ignore
  const query = downtimeQuery.get(downtimeType)(characterLevel, roll);
  
  sqlite3Query(query, async (err, rows) => {
    if (err) {
      console.error(`SQL error:\n  Query: ${query}`, err);
      return err.message;
    }

    sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, "DB Field missing"/*rows[0].event*/, rows[0].outcome);
  })
}

/**
 * @param {interaction} interaction 
 * @param {string} itemID 
 * @param {string} characterName 
 * @param {string} userID 
 * @return {Promise} JS Object for interaction.reply()
 */
function downtimeCraftItem(interaction, itemID, characterName, userID) {
  const [itemName, {price}] = allItems[parseInt(itemID)];

  if(!characterExists(userID, characterName))
    return interaction.reply(requestCharacterRegistration("itemCraft", characterName, [itemID]));
  
  const channel = getChannel(client, DOWNTIME_LOG_CHANNEL);
  // @ts-ignore
  channel.send(
   {
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
  });

  return interaction.reply(responseMessage(`Inital message created in <#${DOWNTIME_LOG_CHANNEL}>`, true));
}

function downtimeChangeItem() {
  return errorResponse("Not implemented");
}

/**
 * 
 * @param {string} userID 
 * @param {[{value: string},{value: string},{value: number}] | option[]} options 
 * @param {boolean} isBuying 
 * @return {responseObject} JS Object for interaction.reply()
 */
function doTrade(userID, options, isBuying) {
  const itemIndex = parseInt(options[0].value);
  const characterName = options[1].value;
  const itemCount = options.length > 2 ? options[2].value : 1;
  
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
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
              type: MessageComponentTypes.BUTTON.valueOf(),
              // @ts-ignore
              custom_id: `acceptTransactionButton_${realPrice}_${itemName}_${itemCount}_${typeName}_${characterName}`,
              label: typeName,
              style: ButtonStyleTypes.PRIMARY.valueOf(),
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
 * @param {User} user 
 * @return {responseObject} JS Object for interaction.reply()
 */
function registration(isRegister, characterName, user) {
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
}

/**
 * @param {User} user 
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
 * @param {User} user 
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

  //Users can only store 10 characters, so this is never needed
  //const result = matchingOptionsIndex.slice(0, 25);

  return matchingOptionsIndex;
}

/** @type {Map<string, autocompleteObject[]>} */
const cachedResults = new Map();

/**
 * @param {string} currentInput 
 * @return {autocompleteObject[]} JS autocomplete Object for interaction.respond()
 */
function itemNamesAutoComplete(currentInput) {
  currentInput = currentInput.toLowerCase();

  const cached = cachedResults.get(currentInput);
  if(cached !== undefined) return cached;
  
  const matchingOptions = [];
  for (var index = 0; index < allItemNames.length; index++){
    if(allItemNamesLower[index].startsWith(currentInput)) {
      if(25 <= matchingOptions.push({
        name: allItemNames[index],
        value: index.toString()
      })) {
        break;
      }
    }
  }
  
  if(currentInput.length < 2){
    cachedResults.set(currentInput, matchingOptions);
  }

  return matchingOptions;
}

/**
 * @param {option[]} options 
 * @param {User} dm 
 * @return {responseObject} JS Object for interaction.reply()
 */
function westmarchLog(options, dm) {
  const tier = options[0].value;
  const xpReceived = options[1].value;
  let rewardType = 0;
  if(options.length > 2) {
    rewardType = options[2].value;
  }
  
  if(xpReceived < 0)
    return errorResponse("Please only use positive values.");

  return {
      content: `<@${dm.id}>\nSelect participating players`,
      ephemeral: true,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW.valueOf(),
          components: [
            {
              type: MessageComponentTypes.USER_SELECT.valueOf(),
              // @ts-ignore
              custom_id: `westmarchrewardlog_` + dm.id + "_" + xpReceived + "_" + tier + "_" + rewardType,
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
 * @param {User?} user 
 */
function explainMe(client, channelID, user) {
  const messages = explanationMessage;

  const channel = user == null ? getChannel(client, channelID) : user;

  for(let i = 0; i < messages.length; i++) {
    setTimeout(() => {
      // @ts-ignore
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
    options: []
  }
  // @ts-ignore
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
 * @param {User} user 
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
    interaction.respond(itemNamesAutoComplete(currentInput));
  }
  else if(searchType == "character") {
    interaction.respond(characterNamesAutoComplete(currentInput, user));
  }
}

/**
 * 
 * @param {interaction} interaction 
 * @param {string} componentId 
 * @param {User} user 
 * @return {responseObject | null} JS Object for interaction.reply()
 */
function handleComponentPreEvent(interaction, componentId, user) {
  const partsPre = componentId.split("_");
  partsPre.shift();
  
  registration(true, partsPre[1], user);

  let result = null;

  switch(partsPre[0]) {
    case "itemCraft":
      downtimeCraftItem(interaction, partsPre[2], partsPre[1], user.id);
      break;
    case "doTrade":
      const itemIndex = partsPre[2];
      const itemCount = parseInt(partsPre[3]);
      const isBuying = partsPre[4] === "true";

      result = doTrade(user.id, [{value: itemIndex}, {value: partsPre[1]}, {value: itemCount}], isBuying);
      break;
    case "doDowntime":
      const downtimeType = partsPre[2];
      const characterLevel = parseInt(partsPre[3]);

      getDowntime(interaction, [{value: downtimeType}, {value: partsPre[1]}, {value: characterLevel}], user.id);
      //getDowntimeSQLite3(interaction, [{value: downtimeType}, {value: partsPre[1]}, {value: characterLevel}], user.id);
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
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            // @ts-ignore
            custom_id: `itemspage_` + (j + 1) + "_" + originalID,
            label: "Load more items",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
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

// @ts-ignore
client.on('interactionCreate', 
  /** @param {interaction} interaction */
  (interaction) => {
  try{
    const { type, id } = interaction;
    const user = interaction.user == null ? interaction.member.user : interaction.user;
    const userID = user.id;
    const channelID = interaction.channelId;
    const isDirectMessage = interaction.guildId == null;

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { commandName, options } = parseFullCommand(interaction);
      
      let isTrue = false; 
      switch(commandName) {
        case "explanationtrader": 
          // if user
          if(isDirectMessage) {
            return interaction.reply(explainMe(client, "", user));
          } 
          if(!isAdmin(interaction.member)) {
            const response = errorResponse("You do not have permission to post this on a server.\nI can send it to you as a dm.");
            response.components = [
              {
                type: MessageComponentTypes.ACTION_ROW.valueOf(),
                components: [
                  {
                    type: MessageComponentTypes.BUTTON.valueOf(),
                    // @ts-ignore
                    custom_id: `dmExplanation`,
                    label: "Send in DM",
                    style: ButtonStyleTypes.PRIMARY.valueOf(),
                  },
                ],
              },
            ];
            return interaction.reply(response);
          }
          return interaction.reply(explainMe(client, channelID, null));
        case "getitemsinrange": 
          return interaction.reply(getItemsInRange(options, id));
        case "westmarch item-downtime craft": 
          // command is now sent to specific channel
          //if(interaction.channel instanceof ThreadChannel) 
          //  return interaction.reply(errorResponse("Needed thread can't be created in thread or forum"));
          return downtimeCraftItem(interaction, options[0].value, options[1].value, userID);
        case "westmarch item-downtime change": 
          return interaction.reply(downtimeChangeItem());
        
        case "westmarch reward": 
          if(isDirectMessage) return interaction.reply(errorResponse("Please use this only in the server.\nYou will need to select your players."));
          return interaction.reply(westmarchLog(options, user));
        
        case "westmarch buy": 
          isTrue = true;
        case "westmarch sell": 
          return interaction.reply(doTrade(userID, options, isTrue));
        
        case "westmarch character register": 
          isTrue = true;
        case "westmarch character unregister": 
          return interaction.reply(registration(isTrue, options[0].value, user));
        case "westmarch character show": 
          return interaction.reply(showCharacters(user));
        case "westmarch downtime":
          //getDowntimeSQLite3(interaction, options, userID); 
          getDowntime(interaction, options, userID);
      }
    }

    else if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) { // is Autocomplete
      return handleAutocomplete(interaction, user);
    }

    else if (type === InteractionType.MESSAGE_COMPONENT) {
      let componentId = interaction.customId;
      const parts = componentId.split("_");

      const message = interaction.message;

      if(componentId.startsWith(rareSeperator)) {
        const response = handleComponentPreEvent(interaction, componentId, user);
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
          if(userID != creatorID) 
            return;
          const messageID = parts[2];
          const characterName = parts[3];
          // @ts-ignore
          let proficiency = interaction.values[0];
          
          if (isTrue) { 
            setValueDowntime(userID, characterName, "crafting", messageID, "proficiency", proficiency)
            return interaction.reply(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
          }
          proficiency = parseInt(proficiency);
          setValueDowntime(userID, characterName, "crafting", messageID, "profMod", proficiency)
          return interaction.reply(responseMessage("Proficiency level is set to " + proficiency, true));
          
        case "characterThread":
          return interaction.reply(startCharacterDowntimeThread(message, parts, userID, interaction.message.id));
        case "characterThreadFinished":
          return interaction.reply(rollCharacterDowntimeThread(parts, userID, interaction));
        case "westmarchrewardlog":
          return interaction.reply(westmarchRewardLogResult(parts, interaction.message.createdTimestamp, interaction));
        case "acceptTransactionButton":
          const channel = getChannel(client, TRANSACTION_LOG_CHANNEL);
          // @ts-ignore
          channel.send(acceptTransaction(componentId, userID));
          return interaction.reply(responseMessage(`Transaction approved!\nMessage can be found in <#${TRANSACTION_LOG_CHANNEL}>`, true));

        case "dmExplanation":
          explainMe(client, "", user);
          return interaction.reply(responseMessage("Message was sent (if dms from server members are enabled)", true));
      }
    }
  } catch (err) {
    console.error('\n\nError sending message:', err);
    if(interaction.type != InteractionType.MESSAGE_COMPONENT) {
      const { commandName, options } = parseFullCommand(interaction);
      console.error(`Error command:\n${commandName}\n${JSON.stringify(options)}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

const shouldUpdate = false;
if(shouldUpdate) {
  InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
}