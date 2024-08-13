import "dotenv/config";
import fetch from "node-fetch";

/**
 * @typedef {import("./types.js").responseObject} responseObject
 * @typedef {import("discord.js").AnyThreadChannel} AnyThreadChannel
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 */

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

const installUpdate = false;
export async function InstallGlobalCommands(appId, commands) {
  if(!installUpdate)
    return;
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