// @ts-check
import { errorResponse, responseMessage, createThread, DOWNTIME_RESET_TIME, TRANSACTION_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL, currency } from './utils.js';
import { createProficiencyChoices, getProficiencies } from "./downtimes.js";
import { getDX } from './extraUtils.js';
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DBIO } from './data/createDB.js';


/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").User} User
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").TextChannel} TextChannel
 * @typedef {import('./types.js').responseObject} responseObject
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").guildMember} guildMember
 * @typedef {import("./types.js").craftingDTData} craftingDTData
 */

const proficiencyNames = getProficiencies();

const db = DBIO.getDB();

/**
 * 
 * @param {Message} message 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {string} messageID 
 * @return {Promise<responseObject>} JS Object for interaction.reply()
 */
export async function startCharacterDowntimeThread(message, parts, userID, messageID) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return errorResponse("Not your character.");;

  const itemID = parseInt(parts[2]);
  const characterName = parts[3];

  const itemData = await db.getItem(itemID).then();
  const channel = await createThread(message, `${characterName} crafts ${itemData.item_name}`).then();

  channel.send({
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
  }).then(() => {
    message.edit({
      content: `${characterName} (<@${userID}>) wants to craft ${itemData.item_name}.\n` +
                `Material cost: ${itemData.price}\n` +
                `You will need to succeed on a craft check using a tool proficiency.\n` +
                `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n`,
      components: [],
    });
  });

  /** @type {craftingDTData} */
  const craftingData = {profType: null, profMod: null, itemID: itemID};
  db.createCharacterJob(userID, characterName, messageID, craftingData);

  return responseMessage("Thread created. Please make selections.", true);
}

/** @type {Map<string, User[]>} */
export const rewardCharacters = new Map();

const playersPerPage = 4;

/**
 * @param {User[]} players 
 * @param {number} currentPage 
 * @param {string?} editMessage
 * @return {Promise<Object[]>}
 */
export async function getPlayerOptions(players, currentPage, editMessage) {
  const startIndex = currentPage * playersPerPage;
  const playerSelect = [];
  for (let index = startIndex; index < startIndex + Math.min(players.length - startIndex, playersPerPage); index++) {
    const playerID = players[index].id;
    const characters = await db.getCharacters(playerID).then();
    if(characters.length == 0) {
      characters[0] = "No registered character";
    }
    playerSelect[index - startIndex] = {
      type: MessageComponentTypes.ACTION_ROW.valueOf(),
      components: [{
        type: MessageComponentTypes.STRING_SELECT.valueOf(),
        custom_id: `wmRewardSelectChar_` + playerID + (editMessage !== null ? "_" + editMessage : ""),
        placeholder: `What character for ${players[index].displayName}?`,
        options: characters.map((character) => {return {label: character, value: character};}),
        min_values: 1,
        max_values: 1,
      }]
    };
  }
  return playerSelect;
}

/**
   * @param {string} content 
   * @param {number} currentPage 
   * @param {User[]} players 
   * @param {string?} editMessage
   * @return {Promise<responseObject>}
   */
export async function makeCharacterSessionSelection(content, currentPage, players, editMessage) {
  const playerSelect = await getPlayerOptions(players, currentPage, editMessage).then();
  const maxPage = Math.ceil(players.length / playersPerPage);

  /** @type {responseObject} */
  const result = {
    content: content, 
    ephemeral: true,
    components: playerSelect.concat([
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [{
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditLast_` + ((currentPage - 1 + maxPage) % maxPage) + (editMessage !== null ? "_" + editMessage : ""),
            label: "Last Page",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditSame_` + currentPage + (editMessage !== null ? "_" + editMessage : ""),
            label: "Reload characters",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditNext_` + ((currentPage + 1) % maxPage) + (editMessage !== null ? "_" + editMessage : ""),
            label: "Next Page",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardNotes_${currentPage}${editMessage !== null ? "_" + editMessage : ""}`,
            label: "Add notes",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardPrint` + (editMessage !== null ? "_" + editMessage : ""),
            label: editMessage == null ? "Publish" : "Send edit",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          }
        ],
      },
    ]),
  };

  
  return result;
}

/**
 * @param {interaction} interaction 
 * @param {User[]} players 
 * @param {number} xpAll 
 * @param {string} dmID 
 * @param {string} date 
 * @param {number} tier 
 * @param {string} gpReceived
 * @param {boolean} doItems 
 * @param {string} sessionName 
 */
async function getSessionRewards(interaction, players, xpAll, dmID, date, tier, gpReceived, doItems, sessionName) {
  //const priceRange = tierToCostLimits.get(tier);

  const playerNumber = players.length;
  const xpReceived = Math.ceil(xpAll / playerNumber);

  let rewards = `${sessionName} (${date})\nDM: <@${dmID}>\nTier: ${tier}` +
    (gpReceived !==  "0" ? `\n${gpReceived}${currency} each` : "") + 
    (doItems ? `\n${xpAll}xp earned by party` : `\n${xpReceived}xp each`) +
    "\n\n";

  rewardCharacters.set(dmID, players);

  if(!doItems) {
    for (let i = 0; i < playerNumber; i++) {
      const characters = await db.getCharacters(players[i].id).then();
      rewards += `<@${players[i].id}> (${players[i].username}) as \`${characters.length > 0 ? characters[0] : "character name"}\`\n`;
    }
    return interaction.reply(await makeCharacterSessionSelection(rewards, 0, players, null).then());
  }


  const rows = await db.filterItemsbyTier(tier, true).then();
  for (let i = 0; i < playerNumber; i++) {
    const item = rows[Math.floor(Math.random() * rows.length)];
    const characters = await db.getCharacters(players[i].id).then();
    rewards += `<@${players[i].id}> (${players[i].username}) as \`${characters.length > 0 ? characters[0] : "character name"}\`\n  Item: ${item.item_name} (price: ${item.price}, ${item.rarity})\n  ${xpReceived}xp\n\n`;
  }
  rewards = rewards.trim();

  return interaction.reply(await makeCharacterSessionSelection(rewards, 0, players, null).then());
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
  const gpReceived = parts[4]; // 0: item  1: Gold 
  const doItems = parts[5] === "true";
  const sessionName = parts[6];
  const players = Array.from(interaction.members, ([id, user]) => user.user);

  interaction.deleteReply(interaction.message);

  return getSessionRewards(interaction, players, xpReceived, dmID, `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`, tier, gpReceived, doItems, sessionName);
}

/**
 * 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {interaction} interaction 
 */
export async function rollCharacterDowntimeThread(parts, userID, interaction) {
  const creatorID = parts[1];
  if(userID != creatorID) 
    return interaction.reply(errorResponse("Not your character."));

  const originalMessageID = parts[2];
  const characterName = parts[3];

  if(await db.getCharacterDowntimeActionUsed(userID, characterName).then()){
    return interaction.reply(errorResponse("You have already used your downtime this week.\nNew downtimes are available "+DOWNTIME_RESET_TIME.DAY+" at "+DOWNTIME_RESET_TIME.HOUR+" ("+DOWNTIME_RESET_TIME.RELATIVE+")"));
  }

  /** @type {craftingDTData} */
  const data = await db.getCharacterJob(userID, characterName, originalMessageID).then();

  if(!data.profMod || data.profMod < 2 || data.profMod > 6)
    return interaction.reply(errorResponse("Modifier is not correct."));

  if(!data.profType)
    return interaction.reply(errorResponse("Proficiency is not set."));

  const item = await db.getItem(data.itemID).then();
  const DC = 15;
  const roll = getDX(20); 
  const success = (roll + data.profMod >= DC);
  const result = `DC: ${DC}\nResult: ${(roll + data.profMod)} (${roll}+${data.profMod}) using ${proficiencyNames[data.profType].toLowerCase()}.\n${(success ? `Successfully crafted ${item.item_name}.\nWait until a dm approves this activity.` : `Try again with your next downtime action!`)}`;

  db.setCharacterDowntimeActionUsed(userID, characterName, true);

  if(success) {
    setTimeout(() => {
      db.deleteCharacterJob(userID, characterName, originalMessageID);
      interaction.deleteReply(interaction.message);
    }, 300);
  }

  interaction.reply(responseMessage(result, false));
}

/**
 * @param {string} componentId 
 * @param {string} userID 
 * @param {TextChannel} channel 
 * @param {interaction} interaction 
 */
export function acceptTransaction(componentId, userID, channel, interaction) {
  const parts = componentId.split("_");
  const price = parseFloat(parts[1]);
  const itemName = parts[2];
  const itemCount = parseInt(parts[3]);
  const buyOrSell = parts[4];
  const characterName = parts[5];

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