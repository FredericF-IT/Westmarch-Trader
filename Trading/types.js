/** @typedef {import("discord.js").MessageActionRowComponent} MessageActionRowComponent*/
/** @typedef {import("discord.js").ActionRow<MessageActionRowComponent>} ActionRow*/

/**
 * @typedef {Object} choice
 * @property {string} name
 * @property {string | number} value
 */

/**
 * Object type sent in interaction.reply()
 * @typedef {Object} responseObject
 * @property {string=} content
 * @property {ActionRow[]=} components
 * @property {choice[]=} choices
 * @property {*=} attachments
 * @property {*=} poll
 * @property {*=} embeds
 * @property {bool=} ephemeral
 * @property {bool=} tts
 */

/**
 * @typedef {Object} autocompleteObject
 * @property {string} name
 * @property {string} value
 */


/**
 * Options as the field in {@link interaction}
 * @typedef {Object} options
 * @property {string | null} _group
 * @property {string | null} _subcommand
 * @property {option[] | null} _hoistedOptions
 */

/**
 * @typedef {Object} user
 * @property {string} id
 * @property {boolean} bot
 * @property {string} username
 */

/** 
 * @typedef {Object} member
 * @property {user} user
*/

/** 
 * @typedef {Object} interaction
 * @property {string} id 
 * @property {string} channelId
 * @property {string} commandName
 * @property {number} type
 * @property {options} options
 * @property {member} member
*/

/**
 * Singular option selected by user
 * @typedef {Object} option
 * @property {string} name
 * @property {number} type
 * @property {Object} value
 */

/**
 * @typedef {Object} command
 * @property {string} commandName
 * @property {option[] | null} options
 */

/**
 * @typedef {Object} item
 * @property {number} price
 * @property {string} rarity
 */

export {};