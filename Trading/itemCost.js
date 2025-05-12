import { rollNDX, RollType } from "./extraUtils.js";
import { rarity } from "./utils.js";

/**
 * @typedef {import("./types.js").item} item
*/

// common     (1d6 + 1) * 10
// uncommon   (2d6) * 50
// rare       (2d10) * 1000
// very rare  (2d16 + 18) * 1,000
// legendary  (2d6) * 25,000

/** @type {Object<string, number>} */
const rarityDiceNumber = {};
rarityDiceNumber[rarity.common] = 1;
rarityDiceNumber[rarity.uncommon] = 2;
rarityDiceNumber[rarity.rare] = 2;
rarityDiceNumber[rarity.very_rare] = 2;
rarityDiceNumber[rarity.legendary] = 2;

/** @type {Object<string, number>} */
const rarityDiceFace = {};
rarityDiceFace[rarity.common] = 6;
rarityDiceFace[rarity.uncommon] = 6;
rarityDiceFace[rarity.rare] = 10;
rarityDiceFace[rarity.very_rare] = 16;
rarityDiceFace[rarity.legendary] = 6;

/** @type {Object<string, number>} */
const rarityDiceBonus = {};
rarityDiceBonus[rarity.common] = 1;
rarityDiceBonus[rarity.uncommon] = 0;
rarityDiceBonus[rarity.rare] = 0;
rarityDiceBonus[rarity.very_rare] = 18;
rarityDiceBonus[rarity.legendary] = 0;

/** @type {Object<string, number>} */
const rarityGold = {};
rarityGold[rarity.common] = 10;
rarityGold[rarity.uncommon] = 50;
rarityGold[rarity.rare] = 1000;
rarityGold[rarity.very_rare] = 1000;
rarityGold[rarity.legendary] = 25000;

/**
 * Roll price for a given item
 * @param {item} item 
 */
export function rollItemPrice(item) {
    const dice = rarityDiceNumber[item.rarity];
    const sides = rarityDiceFace[item.rarity];
    const bonus = rarityDiceBonus[item.rarity];
    let gold = rarityGold[item.rarity];
    const simpleName = item.item_name.toLowerCase();
    if(simpleName.includes("potion") || simpleName.includes("scroll")) {
        // Cut gold in half
        gold /= 2;
    }
    return rollPrice(dice, sides, bonus, gold);
}

/**
 * Rolls n dice with s faces at advantage, adds the bonus to the result, then multiplies that result with the given gold price.
 * @param {number} diceN Number of dice
 * @param {number} diceS Face count of one die (d4, d6, d8, ...)
 * @param {number} bonus Number added to the rolled total
 * @param {number} basePrice Gold price to use
 * @returns 
 */
function rollPrice(diceN, diceS, bonus, basePrice) {
    return (bonus + rollNDX(diceN, diceS, RollType.adv)) * basePrice;
}