// @ts-check
import { errorResponse, responseMessage, createThread, GAME_LOG_CHANNEL, DOWNTIME_RESET_TIME, TRANSACTION_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL, tierToCostLimits, currency } from './utils.js';
import { createProficiencyChoices, getProficiencies } from "./downtimes.js";
import { getDX } from './extraUtils.js';
import { getValueDowntime, finishDowntimeActivity, getUserDowntimes, setUserDowntimes, CRAFTING_CATEGORY, hasUsedWeeklyDowntime, useWeeklyAction } from './data/dataIO.js';
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { filterItemsbyTier, getItem, sqlite3Query } from './data/createDB.js';

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").User} User
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import('./types.js').responseObject} responseObject
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").guildMember} guildMember
 */

const proficiencyNames = getProficiencies();

/**
 * 
 * @param {Message} message 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {string} messageID 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function startCharacterDowntimeThread(message, parts, userID, messageID) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return errorResponse("Not your character.");;

  const itemID = parseInt(parts[2]);
  const characterName = parts[3];

  sqlite3Query(getItem(itemID), (err, rows) => {
    createThread(message, `${characterName} crafts ${rows[0].item_name}`).then(channel => {
      return channel.send({
        content: "Make choices:", 
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW.valueOf(),
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT.valueOf(),
                custom_id: `downtimeItemProfSelect_${userID}_${messageID}_${characterName}`,
                placeholder: "Select your tool proficiency",
                options: createProficiencyChoices(),
                min_values: 1,
                max_values: 1,
              },
            ],
          },
          {
            type: MessageComponentTypes.ACTION_ROW.valueOf(),
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT.valueOf(),
                custom_id: `downtimeItemProfMod_${userID}_${messageID}_${characterName}`,
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
            type: MessageComponentTypes.ACTION_ROW.valueOf(),
            components: [
              {
                type: MessageComponentTypes.BUTTON.valueOf(),
                custom_id: `characterThreadFinished_${userID}_${messageID}_${characterName}`,
                label: "Roll tool check",
                style: ButtonStyleTypes.PRIMARY.valueOf(),
              },
            ],
          },
        ],
      });
    }).then(() => {
      message.edit({
        content: `${characterName} (<@${userID}>) wants to craft ${rows[0].item_name}.\n` +
                  `Material cost: ${rows[0].price}\n` +
                  `You will need to succeed on a craft check using a tool proficiency.\n` +
                  `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n`,
        components: [],
      });
    });
  })

  let userBuilds = getUserDowntimes(userID);

  let crafting = {};
  let character = userBuilds[characterName];
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
  crafting[messageID] = {
    proficiency: null,
    profMod: 0,
    item: itemID,
  };

  character.crafting = crafting;
  userBuilds[characterName] = character; 
  setUserDowntimes(userID, userBuilds);

  return responseMessage("Thread created. Please make selections.", true);
}

/**
 * @param {interaction} interaction 
 * @param {guildMember[]} players 
 * @param {number} xpAll 
 * @param {string} dmID 
 * @param {string} date 
 * @param {number} tier 
 * @param {number} rewardType
 */
export function getSessionRewards(interaction, players, xpAll, dmID, date, tier, rewardType) {
  const priceRange = tierToCostLimits.get(tier);

  const playerNumber = players.length;
  const xpReceived = Math.ceil(xpAll / playerNumber);

  // @ts-ignore we know that tier can only be one from the list of options
  const currencyReceived = ((priceRange.max - priceRange.min) / 2) + priceRange.min;
  
  sqlite3Query(filterItemsbyTier(tier), (err, rows) => {
    let rewards = `\`Session name\` (${date})\nDM: <@${dmID}>\nTier: ${tier}\n`;

    if(rewardType == 1){
      rewards += `Gold: ${currencyReceived}${currency} each\nExperience: ${xpReceived}xp each\n\nPlayers:\n`
      
      for (let i = 0; i < playerNumber; i++) {
        rewards += `<@${players[i].user.id}> (${players[i].user.username}) as \`character name\`\n`;
      }
    } else {
      rewards += `${xpAll}xp earned by party\n\n`;
      for (let i = 0; i < playerNumber; i++) {
        const item = rows[Math.floor(Math.random() * rows.length)];
        rewards += `<@${players[i].user.id}> (${players[i].user.username}) as \`character name\`\n  Item: ${item.item_name} (price: ${item.price})\n  ${xpReceived}xp\n\n`;
      }
      rewards = rewards.trim();
    }
  
    interaction.reply({
        content: "```"+rewards+`\`\`\`\nCopy this to <#${GAME_LOG_CHANNEL}> with any needed changes.`, 
        ephemeral: true,
    });
  });
}

/**
 * 
 * @param {string[]} parts 
 * @param {number} timestamp 
 * @param {interaction} interaction 
 */
export function westmarchRewardLogResult(parts, timestamp, interaction) {
  const date = new Date(timestamp);
  const dmID = parts[1];
  const xpReceived = parseInt(parts[2]);
  const tier = parseInt(parts[3]);
  const rewardType = parseInt(parts[4]); // 0: item  1: Gold 

  const players = Array.from(interaction.members, ([id, user]) => user);

  interaction.deleteReply(interaction.message);

  return getSessionRewards(interaction, players, xpReceived, dmID, `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`, tier, rewardType);
}

/**
 * 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {interaction} interaction 
 */
export function rollCharacterDowntimeThread(parts, userID, interaction) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return interaction.reply(errorResponse("Not your character."));

  const originalMessageID = parts[2];
  const characterName = parts[3];

  /** @type {number} */
  const profMod = getValueDowntime(userID, characterName, CRAFTING_CATEGORY, originalMessageID, "profMod");
  if(profMod < 2 || profMod > 6)
    return interaction.reply(errorResponse("Modifier is not correct."));

  /** @type {string} */
  const profType = getValueDowntime(userID, characterName, CRAFTING_CATEGORY, originalMessageID, "proficiency");
  if(profType == null)
    return interaction.reply(errorResponse("Proficiency is not set."));

  if(hasUsedWeeklyDowntime(userID, characterName)){
    return interaction.reply(errorResponse("You have already used your downtime this week.\nNew downtimes are available "+DOWNTIME_RESET_TIME.DAY+" at "+DOWNTIME_RESET_TIME.HOUR+" ("+DOWNTIME_RESET_TIME.RELATIVE+")"));
  }

  /** @type {number} */
  const itemID = getValueDowntime(userID, characterName, CRAFTING_CATEGORY, originalMessageID, "item");
  sqlite3Query(getItem(itemID), (err, rows) => {
    const DC = 15;
    const roll = getDX(20); 
    const success = (roll + profMod >= DC);
    const result = `DC: ${DC}\nResult: ${(roll + profMod)} (${roll}+${profMod}) using ${proficiencyNames[profType].toLowerCase()}.\n${(success ? `Successfully crafted ${rows[0].item_name}.\nWait until a dm approves this activity.` : `Try again with your next downtime action!`)}`;

    useWeeklyAction(userID, characterName);

    if(success) {
      setTimeout(() => {
        finishDowntimeActivity(userID, characterName, CRAFTING_CATEGORY, originalMessageID);
        interaction.deleteReply(interaction.message);
      }, 300);
    }
    interaction.reply(responseMessage(result, false));
  });
}

/**
 * @param {string} componentId 
 * @param {string} userID 
 * @param {Channel} channel 
 * @param {interaction} interaction 
 */
export function acceptTransaction(componentId, userID, channel, interaction) {
  const parts = componentId.split("_");
  const price = parseFloat(parts[1]);
  const itemName = parts[2];
  const itemCount = parseInt(parts[3]);
  const buyOrSell = parts[4];
  const characterName = parts[5];

  // @ts-ignore
  channel.send({
    content: `Approved transaction: ${characterName} (<@${userID}>) ${buyOrSell.toLowerCase()}s ${(itemCount > 1 ? `${itemCount}x ` : '')}"${itemName}" for ${itemCount * price}${currency}`,
  }).then((/** @type {Message} */ message) => {
    interaction.reply(responseMessage(
      `Transaction approved!\n${interaction.channelId != TRANSACTION_LOG_CHANNEL ? `Log was sent to <#${TRANSACTION_LOG_CHANNEL}>\n` : ""}`+
      `Copy this to your character sheet in <#${CHARACTER_TRACKING_CHANNEL}>:\n` +
      `\`\`\`**Transaction summary**\n- ${buyOrSell}: ${(itemCount > 1 ? `${itemCount}x ` : '')}"${itemName}" ${buyOrSell === "Sell" ? "+" : "-"}${itemCount * price}${currency} (${message.url})\`\`\``,
      true));
  });
}