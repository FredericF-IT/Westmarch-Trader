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

export const RollType = {
  adv : 0,
  neutral: 1,
  dis : 2
};

/**
 * Get result of dice roll 1dx, optionally with adv/dis
 * @param {number} f Face of the dice
 * @param {number} rollType 
 * @return {number}
 */
export function roll1DX(f, rollType) {
  const a =  Math.floor(Math.random() * f) + 1;
  const b =  Math.floor(Math.random() * f) + 1;

  switch(rollType) {
    case RollType.adv:
      return Math.max(a, b);
    case RollType.dis:
      return Math.min(a, b);
    case RollType.neutral:
      return a;
  }

  return 0;
}

/**
 * Get result of dice roll ndx
 * @param {number} n Number of dice 
 * @param {number} f Face of the dice
 * @param {number} rollType Adv / Neutrall / Dis
 * @return {number}
 */
export function rollNDX(n, f, rollType) {
  let out = 0;
  for(let i = 0; i < n; i++) {
    out += roll1DX(f, rollType);
  }
  return out;
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