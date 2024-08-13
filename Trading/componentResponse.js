import { errorResponse, responseMessage, createThread } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex, createProficiencyChoices, getProficiencies } from './itemsList.js';
import { getValueCharacter, finishJob, getDX, filterItems } from './extraUtils.js';
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { writeDataFile, readDataFile } from './data/dataIO.js';
import { characterDowntimeProgress } from "./data/fileNames.js";


/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import('./types.js').responseObject} responseObject
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").user} user
 */

const proficiencyNames = getProficiencies();

const allItemNames = getSanesItemNameIndex();
const allItems = getSanesItemPrices();

/**
 * 
 * @param {Message} message 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {string} messageID 
 * @param {string} token 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function startCharacterDowntimeThread(message, parts, userID, messageID, token) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return errorResponse("Not your character.");;

  const itemIndex = parseInt(parts[2]);
  const characterName = parts[3];

  try {
    createThread(message, characterName + " crafts " + allItemNames[itemIndex]).then(channel => {
      return channel.send({
        content: "Make choices:", 
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: `downtimeItemProfSelect_${userID}_` + messageID + "_" + characterName,
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
                custom_id: `downtimeItemProfMod_${userID}_` + messageID + "_" + characterName,
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
                custom_id: `characterThreadFinished_${userID}_` + messageID + "_" + characterName,
                label: "Roll tool check",
                style: ButtonStyleTypes.PRIMARY,
              },
            ],
          },
        ],
      });
    }).then(() => {
      const [itemName, {price}] = allItems[itemIndex];

      message.edit({
        content: `${characterName} (<@${userID}>) wants to craft ${itemName}.\n` +
                 `Material cost: ${price}\n` +
                 `You will need to succeed on a craft check using a tool proficiency.\n` +
                 `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n`,
        components: [],
      });
    });
  } catch (err) {
    console.error('Error sending message:', err);
    return errorResponse("Error when creating thread");
  }

  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));

  let userBuilds = activeItemBuilds[userID];

  let crafting = {};
  let character = null;
  if (userBuilds != undefined) { // player has done progressable downtime before
    character = userBuilds[characterName];
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
    item: itemIndex,
  };

  character.crafting = crafting;
  userBuilds[characterName] = character; 
  activeItemBuilds[userID] = userBuilds;

  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);

  return responseMessage("Thread created. Please make selections.", true);
}

/**
 * @param {user[]} players 
 * @param {number} xpAll 
 * @param {string} dmID 
 * @param {string} date 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function getSessionRewards(players, xpAll, dmID, date) {
  const playerNumber = players.length;
  const xpReceived = Math.ceil(xpAll / playerNumber);

  const goldFactor = 4;
  const gpReceived = xpReceived * goldFactor;
  
  const itemsUnderPrice = filterItems(xpReceived * (goldFactor - 1), xpReceived);

  let rewards = `Session name here ("${date}")\nDM: <@${dmID}>\n${xpReceived}xp each\nGold: ${gpReceived}gp each (if item sold)\n\n`;
  for (let i = 0; i < playerNumber; i++) {
    const item = itemsUnderPrice[Math.floor(Math.random() * itemsUnderPrice.length)];
    rewards += players[i].username + "\n  Item: " + item[0] + " (price: " + item[1].price + ")\n  Gold: " + (gpReceived - item[1].price) + "gp (if item kept)\n\n";
  }

  return {
      content: rewards, 
      ephemeral: true,
  };
}

/**
 * 
 * @param {string[]} parts 
 * @param {number} timestamp 
 * @param {interaction} interaction 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function westmarchRewardLogResult(parts, timestamp, interaction) {
  const date = new Date(timestamp);
  const dmID = parts[1];
  const xpReceived = parseInt(parts[2]);

  /** @type {user[]} */
  const players = Array.from(interaction.users, ([id, user]) => user);

  interaction.deleteReply(interaction.message);

  return getSessionRewards(players, xpReceived, dmID, date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear());
}

/**
 * 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {interaction} interaction 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function rollCharacterDowntimeThread(parts, userID, interaction) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return errorResponse("Not your character.");

  const originalMessageID = parts[2];
  const characterName = parts[3];

  /** @type {number} */
  const profMod = getValueCharacter(userID, characterName, "crafting", originalMessageID, "profMod");
  if(profMod < 2 || profMod > 6)
    return errorResponse("Modifier is not correct.");

  /** @type {string} */
  const profType = getValueCharacter(userID, characterName, "crafting", originalMessageID, "proficiency");
  if(profType == null)
    return errorResponse("Proficiency is not set.");

  /** @type {number} */
  const itemID = getValueCharacter(userID, characterName, "crafting", originalMessageID, "item");

  const DC = 15;
  const roll = getDX(20); 
  const success = (roll + profMod >= DC);
  const result = `DC: ${DC}\nResult: ` + (roll + profMod) + " (" + roll + "+" + profMod + ")\n" + (success ? `Successfully crafted ${allItemNames[itemID]} using ${proficiencyNames[profType].toLowerCase()}.\nWait until a dm approves this activity.` : "Try again with your next downtime action!");

  if(success) {
    setTimeout(() => {
      finishJob(userID, characterName, "crafting", originalMessageID);
      interaction.deleteReply(interaction.message);
    }, 300);
  }
  return responseMessage(result, false);
}

/**
 * @param {string} componentId 
 * @param {string} userID 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function acceptTransaction(componentId, userID) {
  const parts = componentId.split("_");
  const price = parseFloat(parts[1]);
  const itemName = parts[2];
  const itemCount = parseInt(parts[3]);
  const buyOrSell = parts[4];
  const characterName = parts[5];

  return {
    content: 'Approved transaction: ' + characterName + " (<@" + userID + ">) " + buyOrSell.toLowerCase() + 's ' + (itemCount > 1 ? itemCount + 'x "' : '"') + itemName + '" for ' + itemCount * price + "gp",
  };
}