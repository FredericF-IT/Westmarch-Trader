// @ts-check
import { DBIO } from "./createDB.js";
import { currency } from "./utils.js";
import { MultiMessageSender } from "./MultiMessageSender.js";

/**
 * @typedef {import("./types.js").option} option
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").item} item
 */

/** @type {Map<string, string[]>} */
const lastItemResult = new Map();

const db = DBIO.getDB();

/**
 * @param {interaction} interaction 
 * @param {option[]} options 
 * @param {string} id 
 * @param {boolean} useTier 
 */
export async function getItemsInRange(interaction, options, id, useTier) {
  /** @type {item[]} */
  let items = [];
  if(useTier) {
    items = await db.filterItemsbyTier(options[0].value, true).then();
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
  
    items = await db.filterItems(minPrice, maxPrice).then();
  }
  
  let result = [""];
  let j = 0;
  for (let i = 0; i < items.length; i++) {
    const nextSection = "- " + items[i].item_name + " (" + items[i].price + currency + ", " + items[i].rarity + ")\n";
    if (nextSection.length + result[j].length >= 2000) {
      j++;
      result[j] = ""
    }
    result[j] += nextSection;
  }

  MultiMessageSender.sendLongMessagePartitioned(result, interaction, true);
}