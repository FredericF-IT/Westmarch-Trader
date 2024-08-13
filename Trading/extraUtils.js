import { writeDataFile, readDataFile } from './data/dataIO.js';
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { namesCharactersFile, characterDowntimeProgress } from "./data/fileNames.js";


/**
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("./types.js").item} item
 */

/**
 * @param {string} userID 
 * @param {string} characterName 
 * @param {string} category 
 * @param {string} job 
 * @param {string} name 
 * @param {Object} value 
 * @return {void}
 */
export function setValueCharacter(userID, characterName, category, job, name, value) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
      
  activeItemBuilds[userID][characterName][category][job][name] = value;
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

/**
 * @param {string} userID 
 * @param {string} characterName 
 * @param {string} category 
 * @param {string} job 
 * @param {string} name 
 * @return {Object}
 */
export function getValueCharacter(userID, characterName, category, job, name) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
  return activeItemBuilds[userID][characterName][category][job][name];
}

/**
 * Deletes the entry of the specific downtime thread
 * @param {string} userID 
 * @param {string} characterName 
 * @param {string} category 
 * @param {string} job 
 * @return {void}
 */
export function finishJob(userID, characterName, category, job) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
  delete activeItemBuilds[userID][characterName][category][job];
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

/**
 * Is the character saved in the users entry?
 * @param {string} userID 
 * @param {string} characterName 
 * @returns {bool}
 */
export function characterExisits(userID, characterName) {
  const userCharacters = JSON.parse(readDataFile(namesCharactersFile))[userID];
  
  return userCharacters != undefined && userCharacters.includes(characterName);
}

const rareSeperator = "$.$=$";

/**
 * Lets user register unknown character and later resume the original command
 * @param {string} type 
 * @param {string} characterName 
 * @param {Object[]} data 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function requestCharacterRegistration(type, characterName, data) {
  return {
    ephemeral: true,
    content: `${characterName} has not been registered.\n` +
      "Would you like to do so and continue with the command?",
    //type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
              type: MessageComponentTypes.BUTTON,
              custom_id: rareSeperator + `_${type}_${characterName}_${data.join("_")}`,
              label: "Register & continue",
              style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

/**
 * Get result of dice roll 1dx
 * @param {number} x 
 * @return {number}
 */
export function getDX(x) {
  return Math.floor(Math.random() * x) + 1;
}

import { getSanesItemPrices } from './itemsList.js';
const allItems = getSanesItemPrices();

 /**
 * Returns 
 * @param {number} gpReceived 
 * @param {number} gpMinimumCost 
 * @return {[string, item][]}
 */
export function filterItems(gpReceived, gpMinimumCost) {
  return allItems.filter(function(element) {
      return element[1].price <= gpReceived && element[1].price >= gpMinimumCost;
  });
}