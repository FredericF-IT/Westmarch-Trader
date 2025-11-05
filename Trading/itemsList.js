// @ts-check
/**
 * @typedef {import("./types.js").item} item
 */

import { DBIO } from "./DBIO.js";
import { writeDataFileRequest } from "./data/dataIO.js";

/**
 * Adds new attributes to each item
 */
export async function updateItems() {
	const db = DBIO.getDB();
  const items = await db.filterItems(0, Number.MAX_SAFE_INTEGER).then();

  /** @type {Object} */
  const newItems = {};

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
		// Change item
  }

  const definitionText = 
		"DROP TABLE item_cost;\n" +
		"-- Create the table;\n" +
		"CREATE TABLE item_cost (" +
			"item_name TEXT, " +
	    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"price INTEGER, " +
			"rarity TEXT, " +
			"consumable INTEGER);\n" +
		"-- Insert the data;\n";

  try {
    writeDataFileRequest("./data/itemsList2.js", "export const updatedItems = " + JSON.stringify(newItems, null, "\t"));
    let outputSQL = definitionText;
    for(let item of items){
      const entryString = 'INSERT INTO item_cost (item_name, price, rarity, consumable) VALUES ("' +
      item.item_name + '", ' +
      item.price + ', "' +
      item.rarity + '", ' +
      item.consumable + ");\n";
      outputSQL += entryString;
    }
    writeDataFileRequest("./data/insertItems2.sql", outputSQL);
    
  } catch (err) {
    console.error(err);
  }
}