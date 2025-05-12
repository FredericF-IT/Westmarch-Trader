import { DBIO } from './DBIO.js';
import { hasRole, isAdmin } from './extraUtils.js';
import { errorResponse, rarityFromId, responseMessage } from './utils.js';

/**
* @typedef {import("./types.js").interaction} interaction
* @typedef {import("./types.js").option} option
* @typedef {import("./types.js").responseObject} responseObject
*/

const db = DBIO.getDB();

/**
 * 
 * @param {interaction} interaction 
 * @param {option[]} options 
 * @returns {Promise<responseObject>}
 */
export async function addItem(interaction, options) {
  if(!hasRole(interaction.member, "1264672445844164669")) {
    return errorResponse("You do not have the necessary role to add items.");
  }

  const name = options[0].value;
  if(await db.existsItem(name).then()) {
    return errorResponse("Item already exists.");
  }

  const rarity = rarityFromId(parseInt(options[1].value));
  await db.addItem(name, rarity).then();

  return responseMessage(`Item ${name} of rarity ${rarity} was added.`, true);
}

/**
 * 
 * @param {interaction} interaction 
 * @param {option[]} options 
 * @returns {Promise<responseObject>}
 */
export async function removeItem(interaction, options) {
  if(!isAdmin(interaction.member)) {
    return errorResponse("Only admins may delete items.");
  }

  const itemID = parseInt(options[0].value);
  const item = await db.getItem(itemID).then();
  if(!item) {
    return errorResponse("Item could not be found.");
  }

  db.deleteItem(item.id);
  return responseMessage(`Item ${item.item_name} was deleted.`, true);
}