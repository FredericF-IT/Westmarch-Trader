import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

/**
* @typedef {import("./types.js").item} item
 * @typedef {import("./types.js").responseObject} responseObject
*/

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