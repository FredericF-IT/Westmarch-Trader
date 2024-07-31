import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest, capitalize } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex, getDowntimeTables, getDowntimeNames, getProficiencies } from './itemsList.js';
import { writeDataFile, readDataFile, mapToString, parseMap } from './data/dataIO.js';
import { createProficiencyChoices } from './commands.js';


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

const allItems = getSanesItemPrices();
const allItemNames = getSanesItemNameIndex();
const allItemNamesLower = allItemNames.map(v => v.toLowerCase());

const downtimeTables = getDowntimeTables();
const downtimeNames = getDowntimeNames();
const proficiencyNames = getProficiencies();

const lastItemResult = new Map();

const namesCharactersFile = "data/PlayerNames.json";
const characterDowntimeProgress = "data/downtimeProgress.json";

function getDX(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function filterItems(gpReceived, gpMinimumCost) {
  return allItems.filter(function(element) {
      return element[1].price <= gpReceived && element[1].price >= gpMinimumCost;
  });
}

function getItemsInRange(options, id) {
  let minPrice = options[0].value;
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
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: result[0],
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  lastItemResult.set(id, result);
  
  const minutesTillDeletion = 5;
  setTimeout(
    () => {
      lastItemResult.delete(id);
    }, 1000 * 60 * minutesTillDeletion);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: result[0],
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        flags: InteractionResponseFlags.EPHEMERAL,
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
    },
  };
}

function getDowntime(options) {
  const roll = getDX(100);
  const downtimeType = options[0].value;
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  const rollGroup = Math.floor((roll - 1) / 10);

  const result = "\nEvent: " + downtimeTables[downtimeType][1].table[0][rollGroup] + "\nEffect: " + downtimeTables[downtimeType][1].table[characterLevel - 1][rollGroup];

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Character: "'+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + result,
    },
  };
}

function getSessionRewards(players, xpAll, dm, date) {
  const playerNumber = players.length;
  const xpReceived = Math.ceil(xpAll / playerNumber);

  const goldFactor = 4;
  const gpReceived = xpReceived * goldFactor;
  
  const itemsUnderPrice = filterItems(xpReceived * (goldFactor - 1), xpReceived);

  let rewards = "Session name here (" + date.reverse().join("/") + ")\n" + xpReceived + "xp each\nGold: " + gpReceived + "gp each (if item sold)\n\n";
  for (let i = 0; i < playerNumber; i++) {
    const item = itemsUnderPrice[Math.floor(Math.random() * itemsUnderPrice.length)];
    rewards += "@" + players[i][1].username + "\n  Item: " + item[0] + " (price: " + item[1].price + ")\n  Gold: " + (gpReceived - item[1].price) + "gp (if item kept)\n\n";
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: rewards,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function responseMessage(message, ephemeral) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
      flags: ephemeral ? InteractionResponseFlags.EPHEMERAL : 0,
    },
  };
}

function errorResponse(errorMessage) {
  return responseMessage("Error:\n" + errorMessage, true);
}

function doTrade(userID, options, isBuying) {
  const itemIndex = parseInt(options[0].value);
  const itemCount = options[1].value;
  const characterName = options[2].value;

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
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: "Character: " + characterName + '\nItem: ' + itemName + " x" + itemCount +'\nPrice: ' + (itemCount * realPrice) + (itemCount > 1 ? "gp (" + realPrice + "gp each)" : "gp"),
        flags: InteractionResponseFlags.EPHEMERAL,
        components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
                type: MessageComponentTypes.BUTTON,
                custom_id: `accept_button_${realPrice+"$.$"+itemName+"$.$"+itemCount+"$.$"+typeName+"$.$"+characterName}`,
                label: typeName,
                style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}

function registration(isRegister, characterName, user) {
  const characters = JSON.parse(readDataFile(namesCharactersFile));
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  const exists = userCharacters.includes(characterName);
  
  if(isRegister) {
    if (exists) return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "You have a character with that name already.",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
    
    userCharacters.push(characterName);
    characters[user.id] = userCharacters;
    const output = JSON.stringify(characters, null, "\t");
    writeDataFile(namesCharactersFile, output);
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Character added.",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }
  
  const charIndex = userCharacters.indexOf(characterName);
  userCharacters.splice(charIndex, charIndex);
  
  characters[user.id] = userCharacters;
  const output = JSON.stringify(characters, null, "\t");
  writeDataFile(namesCharactersFile, output);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Character removed.",
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function showCharacters(user) {
  const characters = JSON.parse(readDataFile(namesCharactersFile));
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  
  userCharacters.shift();
  
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Your characters:\n- " + userCharacters.join("\n- "),
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function characterNamesAutoComplete(currentInput, user) {
  const characters = JSON.parse(readDataFile(namesCharactersFile));
  
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  userCharacters.shift();

  const matchingOptions = userCharacters.filter((charName) =>
    charName.toLowerCase().startsWith(currentInput.toLowerCase())
  );
  const matchingOptionsIndex = matchingOptions.map((charName) => {
    return {
      name: `${charName}`,
      value: `${charName}`}
  });

  const result = matchingOptionsIndex.slice(0, 25);

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
        choices: result
    },
  };
}

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

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
        choices: result
    },
  }
}

function westmarchLog(options, dm) {
  const xpReceived = options[0].value;
  
  if(xpReceived < 0) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Please only use positive values",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `<@${dm.id}>\nSelect participating players`,
      flags: InteractionResponseFlags.EPHEMERAL,
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
    },
  };
} 

async function deleteMessage(channelID, messageID) {
  try {
    return await DiscordRequest(`/channels/${channelID}/messages/${messageID}`, { 
      method: "DELETE",
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

async function sendToChat(channelID, message, components = []) {
  try {
    return await DiscordRequest(`/channels/${channelID}/messages`, { 
      method: "POST",
      body: {
        content: message, 
        components: components,
      },
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

async function createThread(channelID, messageID, name) {
  try {
    return await DiscordRequest(`/channels/${channelID}/messages/${messageID}/threads`, { 
      method: "POST",
      body: {
        type: 11,
        name: name,
      },
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}


function explainMe(res, channelID) {
  const messages = readDataFile("data/explanation.txt").split("\\newLine");
  const messageResolved = []; 
  for(let i = 0; i < messages.length; i++) {
    setTimeout(() => {
        sendToChat(channelID, messages[i]);
    }, 500 * i);
  }
}

function parseFullCommand(data) {
  let commandName = {
    commandName: data.name,
    options: Object.hasOwn(data, "options") ? data.options : [],
  };
  if(!Object.hasOwn(data, 'options')) return commandName;
  
  data = data.options[0];
  if(data.type == 1) { // is command
    commandName.commandName += " " + data.name;
  } 
  else if(data.type == 2) { // Command groups can only have commands as child options. we know options[0] exists and is command
    commandName.commandName += " " + data.name + " " + data.options[0].name;
    data = data.options[0];
  }
  
  if(Object.hasOwn(data, "options")) {
    commandName.options = data.options;
  }
  return commandName;
}

function setValueCharacter(userID, characterName, category, job, name, value) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
  activeItemBuilds[userID][characterName][category][job][name] = value;
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

function getValueCharacter(userID, characterName, category, job, name) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
  return activeItemBuilds[userID][characterName][category][job][name];
}

function finishJob(userID, characterName, category, job) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
  delete activeItemBuilds[userID][characterName][category][job];
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */

app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  let { name } = data;
  const userID = req.body.member.user.id;
  const channelID = req.body.channel.id;
  
  /**
   * Handle verification requests
   */
  
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { commandName, options } = parseFullCommand(data);
    
    let isTrue = false; 
    switch(commandName) {
        case "explanationtrader": 
          return explainMe(res, channelID);
        
        case "getitemsinrange": 
          return res.send(getItemsInRange(options, id));
        
        case "westmarch downtime": 
          return res.send(getDowntime(options));
        
        case "westmarch item-downtime craft": 
          const item = options[0].value;
          const [itemName, {price}] = allItems[parseInt(item)];
          const characterName = options[1].value;
        
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${characterName} (<@${userID}>) wants to craft ${itemName}.\n` +
                `Material cost: ${price}\n` +
                `You will need to succeed on a craft check using a tool proficiency.\n` +
                `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n` +
                "If you have another item in progress, starting a new item will overwrite that one.",
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                components: [
                {
                  type: MessageComponentTypes.ACTION_ROW,
                  components: [
                    {
                        type: MessageComponentTypes.BUTTON,
                        custom_id: `${userID}_characterThread_` + item + "_" + characterName,
                        label: "Start crafting",
                        style: ButtonStyleTypes.PRIMARY,
                    },
                  ],
                },
              ],
            },
          });
        
        case "westmarch item-downtime change": 
          return res.send(showCharacters(req.body.member.user));
        
        case "westmarch reward": 
          return res.send(westmarchLog(options, req.body.member.user));
        
        case "westmarch buy": 
          isTrue = true;
        case "westmarch sell": 
          return res.send(doTrade(userID, options, isTrue));
        
        case "westmarch character register": 
          isTrue = true;
        case "westmarch character unregister": 
          return res.send(registration(isTrue, options[0].value, req.body.member.user));
        
        case "westmarch character show": 
          return res.send(showCharacters(req.body.member.user));
    }
  }
  
  else if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) { // is Autocomplete
    const { commandName, options } = parseFullCommand(data);
    
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
        
        
        break;
      //case "westmarch item-downtime change":
      //  break; 
    }

    // at this point, current input are the letters given to find the characters name.
    if(searchType == "item") {
      try {
        await res.send(itemNamesAutoComplete(currentInput));
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
    else if(searchType == "character") {
      try {
        await res.send(characterNamesAutoComplete(currentInput, req.body.member.user));
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  }
  
  else if (type === InteractionType.MESSAGE_COMPONENT) {
    
    const componentId = data.custom_id;
    const parts = componentId.split("_");

    if(parts[0] == "itemspage") {
      const j = parseInt(parts[1]);
      const originalID = parts[2];
      
      const itemPages = lastItemResult.get(originalID);
      if(itemPages == undefined) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Request has expired. Please resend command.",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      
      if(j + 1 >= itemPages.length) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: itemPages[j],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: itemPages[j],
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            flags: InteractionResponseFlags.EPHEMERAL,
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
        },
      });
    }
    
    else if(parts[1] == "downtimeItemProfSelect") {
      const creatorID = parts[0];
      if(req.body.member.user.id != creatorID) 
        return;
      const messageID = parts[2];
      const characterName = parts[3];
      const proficiency = data.values[0];
      setValueCharacter(userID, characterName, "crafting", messageID, "proficiency", proficiency)
      return res.send(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
    }
    
    else if(parts[1] == "downtimeItemProfMod") {
      const creatorID = parts[0];
      if(req.body.member.user.id != creatorID) 
        return;
      const messageID = parts[2];
      const characterName = parts[3];
      const proficiency = parseInt(data.values[0]);
      setValueCharacter(userID, characterName, "crafting", messageID, "profMod", proficiency)
      return res.send(responseMessage("Proficiency level is set to " + proficiency, true));
    }
    
    else if(parts[1] == "characterThreadFinished") {
      const creatorID = parts[0];
      if(req.body.member.user.id != creatorID) 
        return;
      const messageID = parts[2];
      const characterName = parts[3];
      
      const profMod = getValueCharacter(userID, characterName, "crafting", messageID, "profMod");
      if(profMod < 2 || profMod > 6)
        res.send(errorResponse("Modifier is not correct."));
      
      const profType = getValueCharacter(userID, characterName, "crafting", messageID, "proficiency");
      if(profType == null)
        res.send(errorResponse("Proficiency is not set."));
      
      const itemID = getValueCharacter(userID, characterName, "crafting", messageID, "item");
      
      const DC = 15;
      const roll = getDX(20); 
      const success = roll + profMod >= DC;
      const result = `DC: ${DC}\nResult: ` + (roll + profMod) + " (" + roll + "+" + profMod + ")\n" + (success ? `Successfully crafted ${allItemNames[itemID]} using ${proficiencyNames[profType].toLowerCase()}.\nWait until a dm approves this activity.` : "Try again with your next downtime action!");

      try{
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
        await res.send(responseMessage(result, false));
        if(success) {
          finishJob(userID, characterName, "crafting", messageID);
          await DiscordRequest(endpoint, { method: 'DELETE' });
        }
      } catch (err) {
        console.error('Error sending message:', err);
      }
      return;
    }
    
    else if(parts[1] == "characterThread") {
      const creatorID = parts[0];
      if(req.body.member.user.id != creatorID) 
        return;
      const messageID = req.body.message.id;
      
      try {
        createThread(channelID, messageID, parts[3] + " crafts " + allItemNames[parseInt(parts[2])]).then(channel => {
          const threadChannelID = "/channels" + channel.url.replace("https://discord.com/api/v10/", "").split("messages")[1].replace("threads", "") + "messages";
          //sendToChat(channel.id, "Make choices to complete your request:")
          try {
            DiscordRequest(threadChannelID, { 
              method: "POST",
              body: {
                content: "Make choices:", 
                components: [
                  {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                      {
                        type: MessageComponentTypes.STRING_SELECT,
                        custom_id: `${userID}_downtimeItemProfSelect_` + messageID + "_" + parts[3],
                        placeholder: "Select your tool proficiency",
                        options: createProficiencyChoices(),
                        min_values: 1,
                        max_values: 1,
                      },
                    ],
                  },
                  {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                      {
                        type: MessageComponentTypes.STRING_SELECT,
                        custom_id: `${userID}_downtimeItemProfMod_` + messageID + "_" + parts[3],
                        placeholder: "What is your proficiency bonus?",
                        options: [
                          {
                            label: "2",
                            value: "2"
                          },
                          {
                            label: "3",
                            value: "3"
                          },
                          {
                            label: "4",
                            value: "4"
                          },
                          {
                            label: "5",
                            value: "5"
                          },
                          {
                            label: "6",
                            value: "6"
                          },
                        ],
                        min_values: 1,
                        max_values: 1,
                      },
                    ],
                  },       
                  {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                      {
                        type: MessageComponentTypes.BUTTON,
                        custom_id: `${userID}_characterThreadFinished_` + messageID + "_" + parts[3],
                        label: "Roll tool check",
                        style: ButtonStyleTypes.PRIMARY,
                      },
                    ],
                  },
                ],
              },
            });
          } catch (err) {
            console.error('Error sending message:', err);
          }
        });
      } catch (err) {
        console.error('Error sending message:', err);
        return res.send(errorResponse("Error when creating thread"));
      }
      
      const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
      let userBuilds = activeItemBuilds[userID];
     
      let crafting = {};
      let character = null;
      if (userBuilds != undefined) { // player has done progressable downtime before
        character = userBuilds[parts[3]];
        if(character != undefined) { // character has done progressable downtime before
          crafting = character.crafting; // list of items in progress
          if(crafting == undefined) {// character hasn't done crafting before
            crafting = {};
          }
        } else {
          character = {
            crafting: crafting
          };
        }
      } else {
        userBuilds = {};
        character = {
          crafting: crafting
        };
      }
      
      crafting[messageID] = {
        proficiency: null,
        profMod: 0,
        item: parseInt(parts[2]),
      };
      
      character.crafting = crafting;
      userBuilds[parts[3]] = character; 
      activeItemBuilds[userID] = userBuilds;
      
      const output = JSON.stringify(activeItemBuilds, null, "\t");
      writeDataFile(characterDowntimeProgress, output);

      const result = res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Thread created. Please make selections.",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
      
      setTimeout(() => {
        const [itemName, {price}] = allItems[parseInt(parts[2])];

        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
        DiscordRequest(endpoint, {method: "PATCH", body: {
          content: `${parts[3]} (<@${userID}>) wants to craft ${itemName}.\n` +
                   `Material cost: ${price}\n` +
                   `You will need to succeed on a craft check using a tool proficiency.\n` +
                   `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n`,
          components: [],
      }})}, 300);
      
      return result;
    }
    
    else if (parts[0] == "westmarchrewardlog"){
      const date = req.body.message.timestamp.split("T")[0].split("-");
      const dmID = parts[1];
      const xpReceived = parts[2];
      const players = Object.entries(data.resolved.users);
      
      try {
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
        await res.send(getSessionRewards(players, xpReceived, dmID, date));
        // Delete previous message
        await DiscordRequest(endpoint, { method: 'DELETE' });
      } catch (err) {
        console.error('Error sending message:', err);
      }
      return;
    }
    
    /*else if (componentId.startsWith('delete_messages')) {
      for(let i = 2; i < parts.length; i++) {
        setTimeout(() => {
          deleteMessage(channelID, parts[i]);
        }, 500 * (i - 2));
      }
      return;
    }*/
    
    if (!componentId.startsWith('accept_button_')) return;
    
    const priceAndName = componentId.replace('accept_button_', '').split("$.$");
    const price = parseFloat(priceAndName[0]);
    const itemName = priceAndName[1];
    const itemCount = priceAndName[2];
    const buyOrSell = priceAndName[3];
    const characterName = priceAndName[4];
    
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Approved transaction: ' + characterName + " (<@" + userID + ">) " + buyOrSell.toLowerCase() + 's ' + (itemCount > 1 ? itemCount + 'x "' : '"') + itemName + '" for ' + itemCount * price + "gp",
        },
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
