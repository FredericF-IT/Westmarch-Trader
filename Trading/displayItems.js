// @ts-check
import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";
import { DBIO } from "./createDB.js";
import { currency, errorResponse } from "./utils.js";

/**
 * @typedef {import("./types.js").option} option
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").item} item
 * @typedef {import("./types.js").responseObject} responseObject
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
    if (nextSection.length + result[j].length > 2000) {
      j++;
      result[j] = ""
    }
    result[j] += nextSection;
  }

  if(j == 0){
    return interaction.reply({
        content: result[0],
        ephemeral: true,
    });
  }

  lastItemResult.set(id, result);
  
  const minutesTillDeletion = 5;
  setTimeout(
    () => {
      lastItemResult.delete(id);
    }, 1000 * 60 * minutesTillDeletion);

  interaction.reply({
    content: result[0],
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
              type: MessageComponentTypes.BUTTON.valueOf(),
              // @ts-ignore
              custom_id: `itemspage_1_`+id,
              label: "Load more items",
              style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
        ],
      },
    ],
  });
}

/**
 * @param {string[]} parts 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function displayItemsInRange(parts) {
  const j = parseInt(parts[1]);
  const originalID = parts[2];

  const itemPages = lastItemResult.get(originalID);
  if(itemPages == undefined)
    return errorResponse("Request has expired. Please resend command.");

  if(j + 1 >= itemPages.length)
    return {
      content: itemPages[j],
      ephemeral: true,
    }
  
  return {
    content: itemPages[j],
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            // @ts-ignore
            custom_id: `itemspage_` + (j + 1) + "_" + originalID,
            label: "Load more items",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
        ],
      },
    ],
  };
}