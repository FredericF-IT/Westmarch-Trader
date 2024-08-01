import "dotenv/config";
import fetch from "node-fetch";
import { verifyKey } from "discord-interactions";
import {
  InteractionResponseType,
  InteractionResponseFlags
} from 'discord-interactions';

export function responseMessage(message, ephemeral) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
      flags: ephemeral ? InteractionResponseFlags.EPHEMERAL : 0,
    },
  };
}

export function errorResponse(errorMessage) {
  return responseMessage("Error:\n" + errorMessage, true);
}

export async function sendToChat(channelID, message, components = []) {
  try {
    return await DiscordRequest(`/channels/${channelID}/messages`, { 
      method: "POST",
      body: {
        content: message, 
        components: components,
      },
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

export async function createThread(channelID, messageID, name) {
  try {
    return await DiscordRequest(`/channels/${channelID}/messages/${messageID}/threads`, { 
      method: "POST",
      body: {
        type: 11,
        name: name,
      },
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}


export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function DiscordRequest(endpoint, options) {
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
  console.log("Trying");
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

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
