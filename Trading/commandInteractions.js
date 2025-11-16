// @ts-check
import { downtimeCraftItem, registration } from "./app.js";
import { commandCreator } from "./commands.js";
import { DBIO } from "./DBIO.js";
import { getDowntimeSQLite3 } from "./downtimes.js";
import { isAdmin } from "./extraUtils.js";
import { doTrade } from "./transaction.js";
import { errorResponse, InstallGlobalCommands, responseMessage } from "./utils.js";

const db = DBIO.getDB();

/**
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").option} option
 * @typedef {import("./types.js").command} command
 * @typedef {import("./types.js").autocompleteObject} autocompleteObject
 * @typedef {import("discord.js").User} User
 */

/**
 * @param {interaction} interaction
 * @return {command} Parsed command
*/
export function parseFullCommand(interaction) {
  /** @type {command} */
  const command = {
    commandName: interaction.commandName,
    options: []
  };
  // @ts-ignore
  if (!Object.hasOwn(interaction, 'options')) return command;

  const group = interaction.options._group;
  const subcommand = interaction.options._subcommand;
  command.commandName += (group == null ? "" : " " + group) +
    (subcommand == null ? "" : " " + subcommand);

  const options = interaction.options._hoistedOptions;

  if (options == null) return command;

  command.options = options;

  return command;
}

/**
 * Send response with matching items
 * @param {interaction} interaction
 * @param {User} user
 * @param {string} prefix 
 */
export async function handleAutocomplete(interaction, user, prefix) {
  const { commandName, options } = parseFullCommand(interaction);

  const [category, ...specifics] = commandName.split(" ");
  const remainingCommand = specifics.join(" ");

  let searchType = "";
  let currentInput = "";
  let i = 0;

  switch (category) {
    case prefix:
      switch (remainingCommand) {
        case `downtimehistory`:
        case `character unregister`:
          currentInput = options[0].value;
          searchType = "character";
          break;
    
        case `downtime`:
          currentInput = options[1].value;
          searchType = "character";
          break;
    
        case `buy`:
        case `sell`:
        case `item-downtime craft`:
          i = 0;
          for (let j = 0; j < 3; j++) {
            if (options[i].focused) break;
            i++;
          }
          currentInput = options[i].value;
    
          searchType = options[i].name; // is either item or character
          break;
      }
      break;

    case `${prefix}_dm`:
      switch(remainingCommand) {
        case `additem`:
          case `edititem`:
            i = 0;
            for (let j = 0; j < 4; j++){
              if (options[i].focused) break;
              i++;
            }
            currentInput = options[i].value;
            searchType = options[i].name;
            break;
          case `removeitem`:
            currentInput = options[0].value;
            searchType = options[0].name;
            break;
          //case "wm item-downtime change":
          //  break; 
      }
      break;
  }

  // at this point, current input are the letters given to find the characters name.
  if (searchType == "item") {
    itemNamesAutoComplete(interaction, currentInput);
  }
  else if (searchType == "character") {
    interaction.respond(await characterNamesAutoComplete(currentInput, user).then());
  }
}

/**
 *
 * @param {interaction} interaction
 * @param {string} componentId
 * @param {User} user
 */
export async function handleComponentPreEvent(interaction, componentId, user) {
  const partsPre = componentId.split("_");
  partsPre.shift();

  await registration(true, partsPre[1], user).then();

  switch (partsPre[0]) {
    case "itemCraft":
      downtimeCraftItem(interaction, partsPre[2], partsPre[1], user.id, partsPre[3]);
      break;
    case "doTrade":
      const itemIndex = partsPre[2];
      const itemCount = parseInt(partsPre[3]);
      const isBuying = partsPre[4] === "true";

      doTrade(interaction, user.id, [{ value: itemIndex }, { value: partsPre[1] }, { value: itemCount }], isBuying);
      break;
    case "doDowntime":
      const downtimeType = partsPre[2];
      const characterLevel = parseInt(partsPre[3]);

      getDowntimeSQLite3(interaction, [{ value: downtimeType }, { value: partsPre[1] }, { value: characterLevel }], user.id);
      break;
    default:
      interaction.reply(errorResponse("Unknown command"));
      break;
  }

  interaction.deleteReply(interaction.message);
}

/**
 * @param {string} currentInput
 * @param {User} user
 * @return {Promise<autocompleteObject[]>} JS autocomplete Object for interaction.respond()
 */
export async function characterNamesAutoComplete(currentInput, user) {
  let userCharacters = await db.getCharacters(user.id).then();

  const matchingOptions = userCharacters.filter((charName) => charName.toLowerCase().startsWith(currentInput.toLowerCase())
  );

  /** @type {autocompleteObject[]} */
  const matchingOptionsIndex = matchingOptions.map((charName) => {
    return {
      name: `${charName}`,
      value: `${charName}`
    };
  });

  return matchingOptionsIndex;
}

/** @type {autocompleteObject[]?} */
let cachedResults = null;

/**
 * @param {interaction} interaction
 * @param {string} currentInput
 */
export async function itemNamesAutoComplete(interaction, currentInput) {
  if (currentInput.length == 0) {
    if (cachedResults !== null) {
      return interaction.respond(cachedResults);
    }
  }
  const rows = await db.get25ItemNamesQuery(currentInput).then();

  const items = rows.map((item) => {
    return {
      name: item.item_name,
      value: item.id.toString()
    };
  });
  interaction.respond(items);
  if (currentInput.length == 0) {
    cachedResults = items;
  }
}

/**
 * @param {interaction} interaction 
 * @returns {Promise<any>}
 */
export async function updateCommands(interaction) {
  if(!interaction.guildId) {
    return interaction.reply(errorResponse('Please only use this in the server you wish to use it in.'));
  }
  if(!isAdmin(interaction.member)) {
    return interaction.reply(errorResponse('You need to be an admin to use this command.'));
  }
  let server_id = parseInt(interaction.guildId);

  InstallGlobalCommands(process.env.APP_ID, await commandCreator.getCommands(db, server_id).then());
  return interaction.reply(responseMessage("The commands are being updated.\nYou may need to completely terminate discord and restart it to see any changes.", true));
}

/**
 * 
 * @param {interaction} interaction 
 * @param {option[]} options
 */
export async function setCommandPrefix(interaction, options) {
  if(!interaction.guildId) {
    return interaction.reply(errorResponse('Please only use this in the server you wish to use it in.'));
  }
  if(!isAdmin(interaction.member)) {
    return interaction.reply(errorResponse('You need to be an admin to use this command.'));
  }
  let server_id = parseInt(interaction.guildId);

  let new_prefix = options[0].value.toLowerCase();
  let is_valid = /^[-_'\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,20}$/u.test(new_prefix);
  if(!is_valid) {
    return interaction.reply(errorResponse('The new prefix does not conform to discord\'s pattern. Please use at most 20 characters.'));
  }
  
  console.log("Actual Prefix: "+ new_prefix);


  let object = interaction.reply(responseMessage("Prefix is getting updated. The commands will be refreshed automatically.\nYou may need to completely terminate discord and restart it to see any changes.", true));
  await db.setWestmarchPrefix(server_id, new_prefix);
  await InstallGlobalCommands(process.env.APP_ID, await commandCreator.getCommands(db, server_id).then());
  //console.log(options);
  
  return object;
}