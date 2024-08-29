// @ts-check
import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

/**
* @typedef {import("./types.js").item} item
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("./types.js").guildMember} guildMember
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
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
              type: MessageComponentTypes.BUTTON.valueOf(),
              // @ts-ignore
              custom_id: rareSeperator + `_${type}_${characterName}_${data.join("_")}`,
              label: "Register & continue",
              style: ButtonStyleTypes.PRIMARY.valueOf(),
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
/** @type {[string, ...item[]][]} */
const allItems = getSanesItemPrices();

 /**
 * @param {number} lowestPrice 
 * @param {number} highestPrice 
 * @return {[string, ...item][]}
 */
export function filterItems(lowestPrice, highestPrice) {
  return allItems.filter(function(element) {
      return lowestPrice <= element[1].price && element[1].price <= highestPrice;
  });
}

 /**
 * @param {number} priceTier 
 * @return {[string, ...item][]}
 */
 export function filterItemsbyTier(priceTier) {
  return allItems.filter(function(element) {
      return priceTier === element[1].priceTier;
  });
}

/**
 * 
 * @param {guildMember} member 
 */
export function isAdmin(member) {
  return member.permissions.has("Administrator");
}

/**
 * 
 * @param {guildMember} member 
 * @param {string} roleID 
 */
export function hasRole(member, roleID) {
  return member._roles.includes(roleID);
}