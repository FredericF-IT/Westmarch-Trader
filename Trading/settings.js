import { DBIO } from './DBIO.js';
import { hasRole, isAdmin } from './extraUtils.js';
import { errorResponse, rarityFromId, responseMessage } from './utils.js';

/**
* @typedef {import("./types.js").interaction} interaction
* @typedef {import("./types.js").option} option
*/

const db = DBIO.getDB();

/**
 * 
 * @param {interaction} interaction 
 * @param {option[]} options 
 * @returns 
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
 * @returns 
 */
export async function removeItem(interaction, options) {
  if(!isAdmin(interaction.member)) {
    return interaction.reply(errorResponse("Only admins may delete items."));
  }

  const itemID = parseInt(options[0].value);
  const item = await db.getItem(itemID).then();
  if(!item) {
    return interaction.reply(errorResponse("Item could not be found."));
  }

  db.deleteItem(item.id);
  return interaction.reply(responseMessage(`Item ${item.item_name} was deleted.`, true));
}