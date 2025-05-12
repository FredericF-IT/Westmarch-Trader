// @ts-check
import { errorResponse, responseMessage, createThread, DOWNTIME_RESET_TIME } from './utils.js';
import { createProficiencyChoices, getProficiencies } from "./downtimes.js";
import { roll1DX, RollType } from './extraUtils.js';
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { CharacterNotFoundError, DBIO } from './DBIO.js';


/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").TextChannel} TextChannel
 * @typedef {import('./types.js').responseObject} responseObject
 * @typedef {import("./types.js").interaction} interaction
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
  const level = parseInt(parts[4]);
  const proficiency = 1 + Math.ceil(level/4);

  const itemData = await db.getItem(itemID).then();
  const channel = await createThread(message, `${characterName} crafts ${itemData.item_name}`).then();

  channel.send({
    content: "Make choices:\nYour proficiency bonus: +"+proficiency, 
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
      /*{
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
      },*/
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
  const craftingData = {profType: null, profMod: proficiency, itemID: itemID};
  db.createCharacterJob(userID, characterName, messageID, craftingData);

  return responseMessage("Thread created. Please make selections.", true);
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

  try{
    if(await db.getCharacterDowntimeActionUsed(userID, characterName).then()){
      return interaction.reply(errorResponse("You have already used your downtime this week.\nNew downtimes are available "+DOWNTIME_RESET_TIME.DAY+" at "+DOWNTIME_RESET_TIME.HOUR+" ("+DOWNTIME_RESET_TIME.RELATIVE+")"));
    }
  } catch(err) {
    if(err instanceof CharacterNotFoundError){
      console.error(err.message);
      return interaction.reply(err.getErrorResponse());
    }
    return;
  }

  /** @type {craftingDTData} */
  const data = await db.getCharacterJob(userID, characterName, originalMessageID).then();

  if(!data.profMod || data.profMod < 2 || data.profMod > 6)
    return interaction.reply(errorResponse("Modifier is not correct."));

  if(!data.profType)
    return interaction.reply(errorResponse("Proficiency is not set."));

  const item = await db.getItem(data.itemID).then();
  const DC = 15;
  const roll = roll1DX(20, RollType.neutral); 
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
 * 
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {string} creatorID 
 * @param {string[]} parts 
 * @returns 
 */
export async function selectCraftingOption(interaction, userID, creatorID, parts){

        /*  isTrue = true;
        case "downtimeItemProfMod":*/
        if(userID != creatorID) 
          return;
        const messageID = parts[2];
        const characterName = parts[3];
        // @ts-ignore
        let proficiency = interaction.values[0];
        
        //if (isTrue) { 
        /** @type {craftingDTData} */
        const currentData = await db.getCharacterJob(userID, characterName, messageID).then();
        currentData.profType = proficiency;
        db.updateCharacterJob(userID, characterName, messageID, currentData);
        return interaction.reply(responseMessage("Proficiency is set to " + proficiencyNames[proficiency].toLowerCase(), true));
        //}

        /*proficiency = parseInt(proficiency);
        /** @type {craftingDTData} * /
        const currentData = await db.getCharacterJob(userID, characterName, messageID).then();
        currentData.profMod = proficiency;
        db.updateCharacterJob(userID, characterName, messageID, currentData);
        return interaction.reply(responseMessage("Proficiency level is set to " + proficiency, true));
        */
}