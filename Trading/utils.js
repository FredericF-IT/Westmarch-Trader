// @ts-check
import "dotenv/config";
import fetch from "node-fetch";
import { EventEmitter, EventListener } from "./Events.js";
import { DBIO, DBLoadedListener } from "./DBIO.js";

/**
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("discord.js").AnyThreadChannel} AnyThreadChannel
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 */

// Actual server
const DOWNTIME_LOG_CHANNEL = process.env.DOWNTIME_LOG_CHANNEL || "Not found";
const TRANSACTION_LOG_CHANNEL = process.env.TRANSACTION_LOG_CHANNEL || "Not found";
const GAME_LOG_CHANNEL = process.env.GAME_LOG_CHANNEL || "Not found";
const CHARACTER_TRACKING_CHANNEL = process.env.CHARACTER_TRACKING_CHANNEL || "Not found";

const RESET_DAY = 0; // 0 = Sunday, 1 = Monday, ...
const RESET_HOUR = 10; // 24 hour clock, time at which to reset

/** @type {(null | Client)[]} */
const client = [null];

/**
 * @param {Client} discordClient 
 */
export function setClient(discordClient){
  client[0] = discordClient;
}

export const currency = "gp";

export { DOWNTIME_LOG_CHANNEL, TRANSACTION_LOG_CHANNEL, GAME_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL };

export const DOWNTIME_RESET_TIME = {
  HOUR: "not loaded",
  RELATIVE: "not loaded",
  DAY: "not loaded"
};

const db = DBIO.getDB();

class DateEmitter extends EventEmitter{
  /** @param {Date} date */
  notify(date){super.notify(date);}
}

export class DateListener extends EventListener{
  /** @param {(args: Date) => void} func */
  constructor(func) { super(func); }
}

const dateEmitter = new DateEmitter;

/** @param {DateListener} listener */
export function registerDateListener(listener){
  dateEmitter.registerListener(listener);
}

/**
 * @param {boolean} isOnStartup 
 */
export async function updateDate(isOnStartup) {
  try{

    const now = new Date();
    const OldTime = now.getTime();
    
    if(now.getDay() == RESET_DAY && now.getHours() >= RESET_HOUR && now.getMinutes() >= 0) { // its reset day, after reset time (timestamp should be next week)
      now.setDate(now.getDate() + 7);
    }
    
    now.setHours(RESET_HOUR);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setDate(now.getDate() + (((7 + RESET_DAY - (now.getDay())) % 7))); // sets to next sunday, stays same if already sunday

    const timeStamp = Math.floor(now.getTime() / 1000);

    DOWNTIME_RESET_TIME.HOUR = `<t:${timeStamp}:t>`;
    DOWNTIME_RESET_TIME.RELATIVE = `<t:${timeStamp}:R>`;
    DOWNTIME_RESET_TIME.DAY = now.toLocaleDateString("en-us", {weekday: 'long'});

    if(!isOnStartup) {
      await db.setAllCharactersDowntimeActionUsed(false, null).then();
      await db.setAllItemPricesUnknown().then();
      dateEmitter.notify(now);
    }
    console.log(`Next Downtime:${now}`);

    const remainingTime = now.getTime() - OldTime;
    setTimeout(() => updateDate(false), remainingTime);
  }
  catch(err) {
    console.error("Resetting downtime failed\n", err.message);
  }
}

db.registerDBLoadedListener(new DBLoadedListener(async () => {
  updateDate(true);
}));

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
 * @param {string} channelID 
 * @return {Promise<Channel | null>}
 */
export function getChannel(channelID){
  if(client[0] == null){
    throw new Error("Client was not set with setClient()");
  }
  return client[0].channels.fetch(channelID);
}

/**
 * @param {Message} message 
 * @param {string} name 
 * @return {Promise<AnyThreadChannel>}
 */
export async function createThread(message, name) {
  return await message.startThread({
    // @ts-ignore
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

/** @type {{min: number, max: number}[]} */
export const tierToCostLimits = [
  { min: 0, max: 0 }, // tiers begin at 1 in this case
  { min: 500, max: 1000 },
  { min: 1000, max: 3000 },
  { min: 3000, max: 5000 },
  { min: 5000, max: 10000 },
];

export const rarity = {
  common : "common",
  uncommon : "uncommon",
  rare : "rare",
  very_rare : "very rare",
  legendary : "legendary"
}

/**
 * Get rarity by its id (natural ordering)
 * @param {number} id 
 * @returns {string}
 */
export function rarityFromId(id) {
  switch(id) {
    case 0:
      return rarity.common;
    case 1:
      return rarity.uncommon;
    case 2:
      return rarity.rare;
    case 3:
      return rarity.very_rare;
    case 4:
      return rarity.legendary;
  }
  return "";
}

/** @type {string[][]} */
export const tierToRarity = [
  [rarity.common, rarity.uncommon],
  [rarity.common, rarity.uncommon, rarity.rare],
  [rarity.common, rarity.uncommon, rarity.rare, rarity.very_rare],
  [rarity.common, rarity.uncommon, rarity.rare, rarity.very_rare],
];