// @ts-check
import { TextChannel } from "discord.js";
import { CHARACTER_TRACKING_CHANNEL, DOWNTIME_LOG_CHANNEL, DOWNTIME_RESET_TIME, errorResponse, getChannel, responseMessage } from "./utils.js";
import { CharacterNotFoundError, DBIO, DBLoadedListener } from "./createDB.js";
import { getDX, requestCharacterRegistration } from "./extraUtils.js";

/**
 * @typedef {import("./types.js").option} option
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./types.js").interaction} interaction
 */

const profs = {
  alchemist: "Alchemist’s supplies",
  brewer: "Brewer’s supplies",
  calligrapher: "Calligrapher's supplies",
  carpenter: "Carpenter’s tools",
  cartographer: "Cartographer’s tools",
  cobbler: "Cobbler’s tools",
  cook: "Cook’s utensils",
  glassblower: "Glassblower’s tools",
  jeweler: "Jeweler’s tools",
  leatherworker: "Leatherworker’s tools",
  mason: "Mason’s tools",
  painter: "Painter’s supplies",
  potter: "Potter’s tools",
  smith: "Smith’s tools",
  tinker: "Tinker’s tools",
  weaver: "Weaver’s tools",
  woodcarver: "Woodcarver’s tools",
  herbalist: "Herbalism Kit",
  forger: "Forgery Kit",
  poisoner: "Poisoner’s Kit",
};

export function getProficiencies() {
  return profs;
}

export function createProficiencyChoices() {
  const proficiencies = Object.entries(getProficiencies());
  const commandChoices = [];
  for (let i = 0; i < proficiencies.length; i++) {
          commandChoices.push({
                  value: proficiencies[i][0],
                  label: proficiencies[i][1],
          });
  }
  return commandChoices;
}

const db = DBIO.getDB();
let downtimeNames = null;
db.registerDBLoadedListener(new DBLoadedListener(async () => {
  downtimeNames = await db.getDowntimeNames().then();
}));

/**
 * 
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {string} characterName 
 * @param {number} characterLevel 
 * @param {number} downtimeType
 * @param {number} roll 
 * @param {string} event
 * @param {string} effect 
 */
async function sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, event, effect) {
  getChannel(DOWNTIME_LOG_CHANNEL).then(async (channel) => {
    if(!(channel instanceof TextChannel)) {
      interaction.reply(errorResponse(`This channel is not a text channel.`));
      return;
    }
    await channel.send({
      content: `<@${userID}>\nCharacter: "`+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + "\nEvent: " + event + "\nEffect: " + effect,
    }).then((/** @type {Message} */ message) => {
      interaction.reply(responseMessage(
        (interaction.channelId != DOWNTIME_LOG_CHANNEL ? `Result was sent to <#${DOWNTIME_LOG_CHANNEL}>\n` : "") +
        `Copy this to your character sheet in <#${CHARACTER_TRACKING_CHANNEL}>:\n` + 
        `\`\`\`**Downtime summary**\nLink: ${message.url}\nEffect: ${effect}\`\`\``,
        true));
      db.setCharacterDowntimeActionUsed(userID, characterName, true);
    });
  });
}

/**
 * @param {interaction} interaction 
 * @param {[{value: string},{value: string},{value: number}] | option[]} options 
 * @param {string} userID 
 * @return {Promise<void>}
 */
export async function getDowntimeSQLite3(interaction, options, userID) {
  const downtimeType = parseInt(options[0].value);
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  if(!await db.characterExists(userID, characterName).then()){
    return interaction.reply(requestCharacterRegistration("doDowntime", characterName, [downtimeType, characterLevel]));
  }
  try{
    if(await db.getCharacterDowntimeActionUsed(userID, characterName).then()){
      return interaction.reply(errorResponse("You have already used your downtime this week.\nNew downtimes are available "+DOWNTIME_RESET_TIME.DAY+" at "+DOWNTIME_RESET_TIME.HOUR+" ("+DOWNTIME_RESET_TIME.RELATIVE+")"));
    }
  } catch(err) {
    if(err instanceof CharacterNotFoundError){
      console.error(err.message);
      return interaction.reply(err.getErrorResponse());
    }
    return;
  }

  const roll = getDX(100);
  const tableName = (await db.getDowntimeNameToTableName().then())[downtimeType];

  const rollGroup = Math.floor((roll - 1) / 10);
  
  const result = await db.getDowntimeResult(tableName == undefined ? "" : tableName, characterLevel, rollGroup).then(); 
  
  //if (!rows) {
  //  console.error(`SQL error:\n  Query: ${query}`, err);
  //  return err.message;
  //}
  return sendDowntimeCopyable(interaction, userID, characterName, characterLevel, downtimeType, roll, result.description, result.outcome);
}
