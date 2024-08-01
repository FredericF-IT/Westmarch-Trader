import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest, capitalize, errorResponse, responseMessage, sendToChat } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex, getDowntimeTables, getDowntimeNames, getProficiencies } from './itemsList.js';
import { getDX, filterItems, characterExisits, setValueCharacter, requestCharacterRegistration } from './extraUtils.js';
import { writeDataFile, readDataFile } from './data/dataIO.js';
import { startCharacterDowntimeThread, rollCharacterDowntimeThread, westmarchRewardLogResult, acceptTransaction } from "./componentResponse.js";
import { namesCharactersFile } from "./data/fileNames.js";

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

function getDowntime(options, userID) {
  const downtimeType = options[0].value;
  const characterName = options[1].value;
  const characterLevel = options[2].value;
  
  if(!characterExisits(userID, characterName)){
    return requestCharacterRegistration("doDowntime", characterName, [downtimeType, characterLevel]);
  }

  const roll = getDX(100);

  const rollGroup = Math.floor((roll - 1) / 10);

  const result = "\nEvent: " + downtimeTables[downtimeType][1].table[0][rollGroup] + "\nEffect: " + downtimeTables[downtimeType][1].table[characterLevel - 1][rollGroup];

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Character: "'+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + result,
    },
  };
}

function downtimeCraftItem(item, characterName, userID) {
  const [itemName, {price}] = allItems[parseInt(item)];

  if(!characterExisits(userID, characterName)){
    return requestCharacterRegistration("itemCraft", characterName, [item]);
  }

  return {
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
                custom_id: `characterThread_${userID}_` + item + "_" + characterName,
                label: "Start crafting",
                style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}

function doTrade(userID, options, isBuying) {
  const itemIndex = parseInt(options[0].value);
  const itemCount = options[1].value;
  const characterName = options[2].value;
  
  if(!characterExisits(userID, characterName)){
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
                custom_id: `acceptTransactionButton_${realPrice}_${itemName}_${itemCount}_${typeName}_${characterName}`,
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
  if (userCharacters.length >= 11) 
    return errorResponse("You already have 10 characters.");
  
  if (userCharacters == undefined) 
    userCharacters = [user.username];
  
  const exists = userCharacters.includes(characterName);
  
  if(isRegister) {
    if (exists) 
      return errorResponse("You have a character with that name already.");
    
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
  userCharacters.splice(charIndex, 1);
  
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
  
  if(xpReceived < 0)
    return errorResponse("Please only use positive values.");

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

async function handleAutocomplete(data, res, user) {
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
      await res.send(characterNamesAutoComplete(currentInput, user));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
}

async function handleComponentPreEvent(componentId, res, user, token, messageID) {
  const partsPre = componentId.split("_");
  partsPre.shift();
  
  registration(true, partsPre[1], user);

  const endpoint = `webhooks/${process.env.APP_ID}/${token}/messages/${messageID}`;
  let result = null;

  switch(partsPre[0]) {
    case "itemCraft":
      result = res.send(downtimeCraftItem(partsPre[2], partsPre[1], user.id));
      break;
    case "doTrade":
      const itemIndex = partsPre[2];
      const itemCount = parseInt(partsPre[3]);
      const isBuying = partsPre[4] === "true";

      result = res.send(doTrade(user.id, [{value: itemIndex}, {value: itemCount}, {value: partsPre[1]}], isBuying));
      break;
    case "doDowntime":
      const downtimeType = parseInt(partsPre[2]);
      const characterLevel = parseInt(partsPre[3]);

      result = res.send(getDowntime([{value: downtimeType}, {value: partsPre[1]}, {value: characterLevel}], user.id));
      break;
  }

  setTimeout(() => DiscordRequest(endpoint, { method: 'DELETE' }), 200);
  return result;
}

function displayItemsInRange(parts) {
  const j = parseInt(parts[1]);
  const originalID = parts[2];

  const itemPages = lastItemResult.get(originalID);
  if(itemPages == undefined)
    return errorResponse("Request has expired. Please resend command.");

  if(j + 1 >= itemPages.length)
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: itemPages[j],
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    }

  return {
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
  };
}


const rareSeperator = "$.$=$";

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
    console.log(commandName);
    
    let isTrue = false; 
    switch(commandName) {
        case "explanationtrader": 
          return explainMe(res, channelID);
        
        case "getitemsinrange": 
          return res.send(getItemsInRange(options, id));
        
        case "westmarch downtime": 
          return res.send(getDowntime(options, userID));
        
        case "westmarch item-downtime craft": 
          return res.send(downtimeCraftItem(options[0].value, options[1].value, userID));
        
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
    handleAutocomplete(data, res, req.body.member.user);
  }
  
  else if (type === InteractionType.MESSAGE_COMPONENT) {
    let componentId = data.custom_id;
    const parts = componentId.split("_");

    try {
      if(componentId.startsWith(rareSeperator)) {
        return handleComponentPreEvent(componentId, res, req.body.member.user, req.body.token, req.body.message.id);
      }
      
      const creatorID = parts[1];
      let isTrue = false;
      switch(parts[0]){
        case "itemspage":
          return res.send(displayItemsInRange(parts));
        case "downtimeItemProfSelect":
          isTrue = true;
        case "downtimeItemProfMod":
          if(req.body.member.user.id != creatorID) 
            return;
          const messageID = parts[2];
          const characterName = parts[3];
          let proficiency = data.values[0];
          
          if (isTrue) {
            setValueCharacter(userID, characterName, "crafting", messageID, "proficiency", proficiency)
            return res.send(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
          }
          proficiency = parseInt(proficiency);
          setValueCharacter(userID, characterName, "crafting", messageID, "profMod", proficiency)
          return res.send(responseMessage("Proficiency level is set to " + proficiency, true));
          
        case "characterThread":
          return res.send(startCharacterDowntimeThread(parts, req.body.member.user.id, req.body.message.id, channelID, req.body.token));
        case "characterThreadFinished":
          return res.send(rollCharacterDowntimeThread(parts, req.body.member.user.id, req.body.message.id, req.body.token));
        case "westmarchrewardlog":
          return res.send(westmarchRewardLogResult(parts, req.body.message.timestamp, data, req.body.token, req.body.message.id));
        case "acceptTransactionButton":
          return res.send(acceptTransaction(componentId, userID));
      }
    } 
    catch (err) {
      console.error('Error sending message:', err);
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
