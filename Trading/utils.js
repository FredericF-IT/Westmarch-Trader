import "dotenv/config";
import fetch from "node-fetch";
import { resetAllWeeklyAction } from "./data/dataIO.js";

/**
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("discord.js").AnyThreadChannel} AnyThreadChannel
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 */

const sendToTest = false;
// Actual server
const DOWNTIME_LOG_CHANNEL = "1267551725242290196";
const TRANSACTION_LOG_CHANNEL = "1271800109620924436";
const GAME_LOG_CHANNEL = "1267604931465052336";
const CHARACTER_TRACKING_CHANNEL = "1267280479703531531";
// Bot test server
const DOWNTIME_LOG_CHANNEL_TEST = "1275214859717578822";
const TRANSACTION_LOG_CHANNEL_TEST = "1275214894429376522";
const GAME_LOG_CHANNEL_TEST = "1275214859717578822";
const CHARACTER_TRACKING_CHANNEL_TEST = "1275214859717578822";

export { DOWNTIME_LOG_CHANNEL, TRANSACTION_LOG_CHANNEL, GAME_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL };
/*export { 
  DOWNTIME_LOG_CHANNEL_TEST as DOWNTIME_LOG_CHANNEL, 
  TRANSACTION_LOG_CHANNEL_TEST as TRANSACTION_LOG_CHANNEL, 
  GAME_LOG_CHANNEL_TEST as GAME_LOG_CHANNEL, 
  CHARACTER_TRACKING_CHANNEL_TEST as CHARACTER_TRACKING_CHANNEL 
};*/

export const DOWNTIME_RESET_TIME = {
  HOUR: "not loaded",
  RELATIVE: "not loaded",
  DAY: "not loaded"
};

const RESET_DAY = 0; // 0 = Sunday, 1 = Monday, ...
const RESET_HOUR = 10; // 24 hour clock, time at which to reset

export function updateDate(isOnStartup) {
  if(!isOnStartup) {
    resetAllWeeklyAction();
  }

  const now = new Date();
  
  if(now.getDay() == RESET_DAY && now.getHours() >= RESET_HOUR && now.getMinutes() >= 0) { // its reset day, after reset time (timestamp should be next week)
    now.setDate(now.getDate() + 7);
  }

  now.setHours(RESET_HOUR);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setDate(now.getDate() + (((7 + RESET_DAY - (now.getDay())) % 7))); // sets to next sunday, stays same if already sunday

  const timeStamp = Math.floor(now / 1000);

  DOWNTIME_RESET_TIME.HOUR = `<t:${timeStamp}:t>`;
  DOWNTIME_RESET_TIME.RELATIVE = `<t:${timeStamp}:R>`;
  DOWNTIME_RESET_TIME.DAY = now.toLocaleDateString("en-us", {weekday: 'long'});
  
  console.log(`Next Downtime:${now}`);

  setTimeout(() => updateDate(false), now - Date.now());
}

updateDate(true);

/**
 * Turn string message to replyable object
 * @param {string} message 
 * @param {boolean} ephemeral 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function responseMessage(message, ephemeral) {
  return {
    content: message,
    ephemeral: ephemeral,
  };
}

/**
 * Get message object via {@link responseMessage}() that represents a user error
 * 
 * Sets ephemeral = true and prepends "Error:\n"
 * @param {string} errorMessage 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function errorResponse(errorMessage) {
  return responseMessage("Error:\n" + errorMessage, true);
}

/**
 * @param {Client} client 
 * @param {string} channelID 
 * @return {Channel}
 */
export function getChannel(client, channelID){
  return client.channels.cache.get(channelID);
}

/**
 * @param {Message} message 
 * @param {string} name 
 * @return {Promise<AnyThreadChannel>}
 */
export async function createThread(message, name) {
  return await message.startThread({
    type: 11,
    name: name,
  });
}

async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Capitalize a string
 * @param {string} str 
 * @return {string}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}