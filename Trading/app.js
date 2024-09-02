// @ts-check
import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { BOT_INFO_CHANNEL, CHARACTER_TRACKING_CHANNEL, currency, DOWNTIME_LOG_CHANNEL, DOWNTIME_RESET_TIME, errorResponse, GAME_LOG_CHANNEL, getChannel, InstallGlobalCommands, responseMessage, TRANSACTION_LOG_CHANNEL } from './utils.js';
import './itemsList.js';
import { getDowntimeNames, getProficiencies, getDowntimeTables, jsNameToTableName } from "./downtimes.js";
import { getDX, requestCharacterRegistration, isAdmin } from './extraUtils.js';
import { characterExists, setValueDowntime, getCharacters, setCharacters, CRAFTING_CATEGORY, hasUsedWeeklyDowntime, useWeeklyAction, getCharactersNameless } from './data/dataIO.js';
import { startCharacterDowntimeThread, rollCharacterDowntimeThread, westmarchRewardLogResult, acceptTransaction, rewardCharacters as rewardPlayers, makeCharacterSessionSelection } from "./componentResponse.js";
import sqlite3 from 'sqlite3';
import { channelLink, Client, ComponentType, Events, IntentsBitField, Partials, TextChannel, User } from "discord.js";
import { ALL_COMMANDS } from './commands.js';
import { explanationMessage } from './explanation.js';
import { createDB, filterItems, filterItemsbyTier, get25ItemNamesQuery, getDowntimeQuery, getItem, sqlite3Query } from './data/createDB.js';

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
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction
  ],
});

client.on('ready', (c) => {
  console.log("Bot is running");
});

/** @type {sqlite3.Database} */
export const db2 = new sqlite3.Database('./data/trader_v2.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the trader.db SQLite database.');
  }
});

const downtimeNames = getDowntimeNames();
const proficiencyNames = getProficiencies();

/** @type {Map<string, string[]>} */
const lastItemResult = new Map();

/**
 * @param {interaction} interaction 
 * @param {option[]} options 
 * @param {string} id 
 * @param {boolean} useTier 
 */
function getItemsInRange(interaction, options, id, useTier) {
  let itemsQuery = "";

  if(useTier) {
    itemsQuery = filterItemsbyTier(options[0].value, true);
  } else {
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
  
    itemsQuery = filterItems(minPrice, maxPrice);
  }

  sqlite3Query(itemsQuery, (err, rows) => {
    let result = [""];
    let j = 0;
    for (let i = 0; i < rows.length; i++) {
      const nextSection = "- " + rows[i].item_name + " " + rows[i].price + currency + " (" + rows[i].rarity + ")\n";
      if (nextSection.length + result[j].length > 2000) {
        j++;
        result[j] = ""
      }
      result[j] += nextSection;
    }

    if(j == 0){
      return interaction.reply({
          content: result[0],
          ephemeral: true,
      });
    }

    lastItemResult.set(id, result);
    
    const minutesTillDeletion = 5;
    setTimeout(
      () => {
        lastItemResult.delete(id);
      }, 1000 * 60 * minutesTillDeletion);

    interaction.reply({
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
    });
  });
}

/**
 * 
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {string} characterName 
 * @param {number} characterLevel 
 * @param {number} downtimeType
 * @param {number} roll 
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
    useWeeklyAction(userID, characterName);
  });
}

const downtimeTables = getDowntimeTables();

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

  if(hasUsedWeeklyDowntime(userID, characterName)){
    return interaction.reply(errorResponse("You have already used your downtime this week.\nNew downtimes are available "+DOWNTIME_RESET_TIME.DAY+" at "+DOWNTIME_RESET_TIME.HOUR+" ("+DOWNTIME_RESET_TIME.RELATIVE+")"));
  }

  const roll = getDX(100);
  // @ts-ignore
  const tableName = jsNameToTableName.get(downtimeNames[downtimeType]);

  const rollGroup = Math.floor((roll - 1) / 10);
  
  const query = getDowntimeQuery(tableName == undefined ? "" : tableName, characterLevel, rollGroup); 

  sqlite3Query(query, async (err, rows) => {
    if (err) {
      console.error(`SQL error:\n  Query: ${query}`, err);
      return err.message;
    }
    sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, rows[0].description, rows[0].outcome);
  });
}

/**
 * @param {interaction} interaction 
 * @param {string} itemID 
 * @param {string} characterName 
 * @param {string} userID 
 * @return {Promise} JS Object for interaction.reply()
 */
function downtimeCraftItem(interaction, itemID, characterName, userID) {
  if(!characterExists(userID, characterName))
    return interaction.reply(requestCharacterRegistration("itemCraft", characterName, [itemID]));
  
  //const [itemName, {price}] = allItems[parseInt(itemID)];
  const itemQuery = getItem(itemID);
  sqlite3Query(itemQuery, (err, rows) => {
    const item = rows[0];
    
    const channel = getChannel(client, DOWNTIME_LOG_CHANNEL);
    // @ts-ignore
    channel.send(
    {
      content: `${characterName} (<@${userID}>) wants to craft ${item.item_name}.\n` +
        `Material cost: ${item.price}\n` +
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
  });

  return interaction.reply(responseMessage(`Inital message created in <#${DOWNTIME_LOG_CHANNEL}>`, true));
}

function downtimeChangeItem() {
  return errorResponse("Not implemented");
}

/**
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {[{value: string},{value: string},{value: number}] | option[]} options 
 * @param {boolean} isBuying
 */
function doTrade(interaction, userID, options, isBuying) {
  const itemID = parseInt(options[0].value);
  const characterName = options[1].value;
  const itemCount = options.length > 2 ? options[2].value : 1;
  
  if(!characterExists(userID, characterName)){
    return interaction.reply(requestCharacterRegistration("doTrade", characterName, [itemID, itemCount, isBuying]));
  }

  const itemQuery = getItem(itemID);
  sqlite3Query(itemQuery, (err, rows) => {
    const item = rows[0];
    if(item == undefined) {
      return interaction.reply(errorResponse('Item can not be found.\nIt may be misspelled.'));
    }
    if(itemCount < 1) {
      return interaction.reply(errorResponse("Can not trade less items than 1"));
    }
  
    const realPrice = item.price / (isBuying ? 1 : 2);
    
    const itemName = item.item_name;
  
    const typeName = isBuying ? 'Buy' : "Sell";
    interaction.reply({
      content: "Character: " + characterName + '\nItem: ' + itemName + " x" + itemCount +'\nPrice: ' + (itemCount * realPrice) + (itemCount > 1 ? currency + " (" + realPrice + currency + " each)" : currency),
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
    });
  })
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

/** @type {autocompleteObject[]?} */
let cachedResults = null;

/**
 * @param {interaction} interaction 
 * @param {string} currentInput
 */
function itemNamesAutoComplete(interaction, currentInput) {
  if(currentInput.length == 0){
    if(cachedResults !== null){
      return interaction.respond(cachedResults);
    }
  }
  const limitedItemQuery = get25ItemNamesQuery(currentInput);
  sqlite3Query(limitedItemQuery, async (err, rows) => {
    if (err) {
      console.error(`SQL error:\n  Query: ${limitedItemQuery}`, err);
      return err.message;
    }
    const items = rows.map((item) => {
      return {
        name: item.item_name,
        value: item.id.toString()
      };
    });
    interaction.respond(items);
    if(currentInput.length == 0){
      cachedResults = items;
    }
  });
}

/**
 * @param {option[]} options 
 * @param {User} dm 
 * @return {responseObject} JS Object for interaction.reply()
 */
function westmarchLog(options, dm) {
  const sessionName = options[0].value;
  const tier = options[1].value;
  const xpReceived = options[2].value;
  const doItems = options[3].value;
  let gpReceived = 0;
  if(options.length > 4) {
    gpReceived = options[4].value;
  }
  
  if(xpReceived < 0)
    return errorResponse("Please only use positive xp values.");

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
              custom_id: `westmarchrewardlog_` + dm.id + "_" + xpReceived + "_" + tier + "_" + gpReceived + "_" + doItems + "_" + sessionName,
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
 * @param {Client} client 
 * @param {string} channelID 
 * @param {User?} user 
 * @return {responseObject}
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
 * Updates bots messages to the current command explanation.
 * @param {Client} client 
 * @param {string} channelID 
 * @return {responseObject}
 */
function updateExplainMe(client, channelID) {

  /** @type {TextChannel} */ 
  // @ts-ignore  
  const channel = getChannel(client, channelID);
  // @ts-ignore
  const e = channel.messages.fetch({limit: 100}).then(
    (/**  @type {Map<string, Message>}*/ messages) => {
      const neededMessages = explanationMessage.length;
      let j = 0;
      for(let message of messages.entries()){
        if(message[1].author.id !== process.env.APP_ID) {
          messages.delete(message[0]);
        } else if(j >= neededMessages){
          messages.delete(message[0]);
          message[1].delete();
        } else {
          j++;
        }
      }

      const existingMessages = messages.size;
      
      // sends as many new messages as needed
      // j is the first index of text that doesnt have a message
      for(let j = existingMessages; j < neededMessages; j++) {
        setTimeout(() => {
          channel.send({ content: explanationMessage[j] })
        }, 500 * j);
      }
      
      // discord returns messages in reversed order.
      // we start at the last message that was already sent and 
      // update it with the corresponding text section
      let i = existingMessages - 1;
      messages.forEach(message => {
        if(i < 0) return;
        setTimeout((number) => {
          if(message.content !== explanationMessage[number]) {
            message.edit(explanationMessage[number]);
            console.log("Updated an explanation message.");
          }
        }, 500 * i, i);
        i--;
      });
    }
  );

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
    itemNamesAutoComplete(interaction, currentInput);
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

      doTrade(interaction, user.id, [{value: itemIndex}, {value: partsPre[1]}, {value: itemCount}], isBuying);
      break;
    case "doDowntime":
      const downtimeType = partsPre[2];
      const characterLevel = parseInt(partsPre[3]);

      //getDowntime(interaction, [{value: downtimeType}, {value: partsPre[1]}, {value: characterLevel}], user.id);
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
  db2.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});

client.on(Events.MessageReactionAdd, (reaction_orig, user) => {
  try{
    if(reaction_orig.message.channelId !== GAME_LOG_CHANNEL)
      return;
    
    reaction_orig.fetch().then((messageReaction) => {
      // @ts-ignore
      if (messageReaction.message.author.id !== process.env.APP_ID)
        return;
      const content = messageReaction.message.content || "";
      // @ts-ignore
      if(!content.split("\n")[1].includes(user.id))
        return;
      const players = messageReaction.message.mentions.users.map((player) => player).filter((player) => {
        return player.id !== user.id;
      });

      rewardPlayers.set(user.id, players);
      user.send(makeCharacterSessionSelection(content, 0, players, messageReaction.message.id));
    })
  } catch(err) {
    console.error(err.message);
  }
});

// @ts-ignore
client.on(Events.InteractionCreate, 
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
          if(options[0].value === "update") {
            return interaction.reply(updateExplainMe(client, BOT_INFO_CHANNEL));
          }
          return interaction.reply(explainMe(client, channelID, null));
        case "getitemsinrange": 
          return getItemsInRange(interaction, options, id, false);
        case "getitemsbytier": 
          return getItemsInRange(interaction, options, id, true);
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
          return doTrade(interaction, userID, options, isTrue);
        
        case "westmarch character register": 
          isTrue = true;
        case "westmarch character unregister": 
          return interaction.reply(registration(isTrue, options[0].value, user));
        case "westmarch character show": 
          return interaction.reply(showCharacters(user));
        case "westmarch downtime":
          getDowntimeSQLite3(interaction, options, userID); 
          //getDowntime(interaction, options, userID);
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

        case "wmRewardPrint":
          const isEdit = parts.length > 1;

          /** @type {TextChannel} */ 
          // @ts-ignore  
          const channel2 = getChannel(client, GAME_LOG_CHANNEL);
          rewardPlayers.delete(userID);
     //     interaction.deleteReply(interaction.message);
          
          if(isEdit) {
            channel2.messages.fetch(parts[1]).then((message => {
              message.edit(interaction.message.content);
            }));
          } else {
            channel2.send({content: interaction.message.content}); 
          }
          return interaction.reply(responseMessage("Log sent.", true));
        case "wmRewardEditLast":
        case "wmRewardEditNext":
        case "wmRewardEditSame":
          let editMessage = null;
          if(parts.length > 2) {
            editMessage = parts[2];
          }
          let pageNumber = parseInt(parts[1]);
          const players = rewardPlayers.get(userID);
          if(players == undefined) 
            return interaction.reply(errorResponse("Please re-do the command."));
          interaction.update(makeCharacterSessionSelection(interaction.message.content, pageNumber, players, editMessage)); //.edit(interaction.message.content, );
          return;
        case "wmRewardSelectChar":
          const players2 = rewardPlayers.get(userID);
          if(players2 == undefined) 
            return interaction.reply(errorResponse("Please re-do the command.\nPlayer selection empty."));
          const content = interaction.message.content.split("\`");
          const player = players2.find((user) => {return user.id == parts[1];});
          if(player == undefined) 
            return interaction.reply(errorResponse("Please re-do the command.\nPlayer not found."));
          const where = content.findIndex(value => value.endsWith(player.username+") as "));
          // @ts-ignore
          const updatedChar = interaction.values[0];
          
          content[where+1] = updatedChar;
          interaction.update({content: content.join("\`")});
          return;

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
            setValueDowntime(userID, characterName, CRAFTING_CATEGORY, messageID, "proficiency", proficiency)
            return interaction.reply(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
          }
          proficiency = parseInt(proficiency);
          setValueDowntime(userID, characterName, CRAFTING_CATEGORY, messageID, "profMod", proficiency)
          return interaction.reply(responseMessage("Proficiency level is set to " + proficiency, true));
          
        case "characterThread":
          return interaction.reply(startCharacterDowntimeThread(message, parts, userID, interaction.message.id));
        case "characterThreadFinished":
          return rollCharacterDowntimeThread(parts, userID, interaction);
        case "westmarchrewardlog":
          return westmarchRewardLogResult(parts, interaction.message.createdTimestamp, interaction);
        case "acceptTransactionButton":
          const channel = getChannel(client, TRANSACTION_LOG_CHANNEL);
          
          return acceptTransaction(componentId, userID, channel, interaction);
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

const shouldCreateDB = false;
if(shouldCreateDB) {
  createDB(db2);
}