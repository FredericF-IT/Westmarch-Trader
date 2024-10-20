// @ts-check

import { ActionRowBuilder, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { currency, errorResponse, GAME_LOG_CHANNEL, getChannel, responseMessage } from "./utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DBIO } from "./DBIO.js";

/**
* @typedef {import("./types.js").interaction} interaction
* @typedef {import("./types.js").responseObject} responseObject
* @typedef {import("./types.js").option} option
* @typedef {import("discord.js").User} User
* @typedef {import("discord.js").PartialUser} PartialUser
* @typedef {import("discord.js").Client} Client
* @typedef {import("discord.js").MessageReaction} MessageReaction
* @typedef {import("discord.js").PartialMessageReaction} PartialMessageReaction
*/

const db = DBIO.getDB();

/** @type {Map<string, User[]>} */
export const rewardPlayers = new Map();

const playersPerPage = 4;

/**
 * @param {string} dmID 
 * @param {boolean} isDirectMessage 
 * @param {interaction} interaction 
 * @return {User[] | null}
 */
export function fetchPlayers(dmID, isDirectMessage, interaction) {
  return rewardPlayers.get(dmID) || (isDirectMessage ? null : interaction.message.mentions.users.map(user => user).filter((player) => player.id != dmID));
}

/**
 * @param {option[]} options 
 * @param {User} dm 
 * @return {responseObject} JS Object for interaction.reply()
 */
export function westmarchLog(options, dm) {
  const sessionName = options[0].value;
  const tier = options[1].value;
  const xpReceived = options[2].value;
  const doItems = options[3].value;
  let gpReceived = 0;
  if(options.length > 4) {
    gpReceived = options[4].value;
  }
  
  if(xpReceived < 0)
    return errorResponse("Please only use positive xp values.");

  return {
      content: `<@${dm.id}>\nSelect participating players`,
      ephemeral: true,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW.valueOf(),
          components: [
            {
              type: MessageComponentTypes.USER_SELECT.valueOf(),
              // @ts-ignore
              custom_id: `westmarchrewardlog_` + dm.id + "_" + xpReceived + "_" + tier + "_" + gpReceived + "_" + doItems + "_" + sessionName,
              min_values: 1,
              max_values: 20,
            },
          ],
        },
      ],
  };
} 

/**
 * 
 * @param {interaction} interaction 
 * @param {Client} client 
 * @param {string} userID 
 * @param {string[]} parts 
 * @returns 
 */
export function logPrintMessage(interaction, client, userID, parts) {
  const isEdit = parts.length > 1;
  getChannel(GAME_LOG_CHANNEL).then((channel) => {
    if(!(channel instanceof TextChannel)){
      return interaction.reply(errorResponse("This channel is not a text channel."));
    }
    rewardPlayers.delete(userID);
    interaction.deleteReply(interaction.message);
    
    if(isEdit) {
      channel.messages.fetch(parts[1]).then((message => {
        message.edit(interaction.message.content);
      }));
    } else {
      channel.send({content: interaction.message.content}); 
    }
    return interaction.reply(responseMessage("Log sent.", true));
  });
}

/**
 * 
 * @param {interaction} interaction 
 * @param {string[]} parts 
 * @param {string} userID 
 * @param {boolean} isDirectMessage 
 */
export async function logLoadPlayerPage(interaction, parts, userID, isDirectMessage){
  let editMessage = null;
  if(parts.length > 2) {
    editMessage = parts[2];
  }
  let pageNumber = parseInt(parts[1]);

  const players = fetchPlayers(userID, isDirectMessage, interaction);
  if(players == null)
    return interaction.reply(errorResponse("Please re-do the command."));
  return interaction.update(await makeCharacterSessionSelection(interaction.message.content, pageNumber, players, editMessage).then()); //.edit(interaction.message.content, );
}

/**
 * 
 * @param {interaction} interaction 
 * @param {boolean} isDirectMessage 
 * @param {string} userID 
 * @param {string} dmID 
 * @returns {Promise}
 */
export function logSelectCharacter(interaction, isDirectMessage, userID, dmID) {
  const players = fetchPlayers(userID, isDirectMessage, interaction);
  if(players == null) 
    return interaction.reply(errorResponse("Please re-do the command.\nPlayer selection empty."));
  const content = interaction.message.content.split("\`");
  const player = players.find((user) => {return user.id == dmID;});
  if(player == undefined) 
    return interaction.reply(errorResponse("Please re-do the command.\nPlayer not found."));
  const where = content.findIndex(value => value.endsWith(player.username+") as "));
  // @ts-ignore
  const updatedChar = interaction.values[0];
  
  content[where+1] = updatedChar;
  return interaction.update({content: content.join("\`")});
}

/**
 * @param {interaction} interaction 
 * @return {Promise}
 */
export function requestLogBookNotes(interaction){
  const modal = new ModalBuilder()
    .setCustomId(interaction.customId)
    .setTitle("Notes, further info");

  const data = interaction.message.content.split("\n\n**Notes**:\`\`\`\n");
  let existingNotes = "";
  if(data.length > 1) {
    existingNotes = data[1].replace("\`\`\`", "");
  }

  modal.addComponents(
    // @ts-ignore
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(interaction.customId)
        .setLabel("Your notes")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setValue(existingNotes)
    )
  ); 
  // @ts-ignore
  return interaction.showModal(modal);
  /*
  let content = interaction.message.content;
  const pageNumber = parseInt(parts[1]);
  const players = fetchPlayers(userID, isDirectMessage, interaction);
  if(players == null)
    return interaction.reply(errorResponse("Please re-do the command."));
  return interaction.update(makeCharacterSessionSelection(content, pageNumber, players, null));*/
}

/**
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {boolean} isDirectMessage 
 * @param {string[]} parts 
 * @returns 
 */
export async function receiveLogBookNotes(interaction, userID, isDirectMessage, parts){
  let editMessage = null;
  if(parts.length > 2) {
    editMessage = parts[2];
  }

  const answers = interaction.fields.fields.values();
  let content = interaction.message.content;
  const pageNumber = parseInt(parts[1]);
  const players = fetchPlayers(userID, isDirectMessage, interaction);
  if(players == null)
    return interaction.reply(errorResponse("Please re-do the command."));
  
  for(let answer of answers) {
    const sections = content.split("\n\n**Notes**:\`\`\`\n");
    const newNotes = answer.value.trim();
    sections[1] = newNotes === "" ? "" : "\n\n**Notes**:\`\`\`\n" + newNotes + "\`\`\`";
    const newContent = sections[0] + sections[1];
    return interaction.update(await makeCharacterSessionSelection(newContent, pageNumber, players, editMessage).then());
  }
}

/**
 * 
 * @param {MessageReaction | PartialMessageReaction} reaction_orig 
 * @param {User | PartialUser} user 
 * @returns 
 */
export function emojiReactionLogbook(reaction_orig, user){
  try{
    if(reaction_orig.message.channelId !== GAME_LOG_CHANNEL)
      return;
    
    reaction_orig.fetch().then(async (messageReaction) => {
      // @ts-ignore
      if (messageReaction.message.author.id !== process.env.APP_ID)
        return;
      const content = messageReaction.message.content || "";
      
      if(!content.split("\n")[1].includes(user.id))
        return;
      const players = messageReaction.message.mentions.users.map((player) => player).filter((player) => {
        return player.id !== user.id;
      });

      rewardPlayers.set(user.id, players);
      user.send(await makeCharacterSessionSelection(content, 0, players, messageReaction.message.id).then());
    })
  } catch(err) {
    console.error(err.message);
  }
}

/**
 * @param {User[]} players 
 * @param {number} currentPage 
 * @param {string?} editMessage
 * @return {Promise<Object[]>}
 */
export async function getPlayerOptions(players, currentPage, editMessage) {
  const startIndex = currentPage * playersPerPage;
  const playerSelect = [];
  for (let index = startIndex; index < startIndex + Math.min(players.length - startIndex, playersPerPage); index++) {
    const playerID = players[index].id;
    const characters = await db.getCharacters(playerID).then();
    if(characters.length == 0) {
      characters[0] = "No registered character";
    }
    playerSelect[index - startIndex] = {
      type: MessageComponentTypes.ACTION_ROW.valueOf(),
      components: [{
        type: MessageComponentTypes.STRING_SELECT.valueOf(),
        custom_id: `wmRewardSelectChar_` + playerID + (editMessage !== null ? "_" + editMessage : ""),
        placeholder: `What character for ${players[index].displayName}?`,
        options: characters.map((character) => {return {label: character, value: character};}),
        min_values: 1,
        max_values: 1,
      }]
    };
  }
  return playerSelect;
}

/**
   * @param {string} content 
   * @param {number} currentPage 
   * @param {User[]} players 
   * @param {string?} editMessage
   * @return {Promise<responseObject>}
   */
export async function makeCharacterSessionSelection(content, currentPage, players, editMessage) {
  const playerSelect = await getPlayerOptions(players, currentPage, editMessage).then();
  const maxPage = Math.ceil(players.length / playersPerPage);

  /** @type {responseObject} */
  const result = {
    content: content, 
    ephemeral: true,
    components: playerSelect.concat([
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [{
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditLast_` + ((currentPage - 1 + maxPage) % maxPage) + (editMessage !== null ? "_" + editMessage : ""),
            label: "Last Page",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditSame_` + currentPage + (editMessage !== null ? "_" + editMessage : ""),
            label: "Reload characters",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardEditNext_` + ((currentPage + 1) % maxPage) + (editMessage !== null ? "_" + editMessage : ""),
            label: "Next Page",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardNotes_${currentPage}${editMessage !== null ? "_" + editMessage : ""}`,
            label: "Add notes",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `wmRewardPrint` + (editMessage !== null ? "_" + editMessage : ""),
            label: editMessage == null ? "Publish" : "Send edit",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          }
        ],
      },
    ]),
  };

  
  return result;
}

/**
 * @param {interaction} interaction 
 * @param {User[]} players 
 * @param {number} xpAll 
 * @param {string} dmID 
 * @param {string} date 
 * @param {number} tier 
 * @param {string} gpReceived
 * @param {boolean} doItems 
 * @param {string} sessionName 
 */
async function getSessionRewards(interaction, players, xpAll, dmID, date, tier, gpReceived, doItems, sessionName) {
  //const priceRange = tierToCostLimits.get(tier);

  const playerNumber = players.length;
  const xpReceived = Math.ceil(xpAll / playerNumber);

  let rewards = `${sessionName} (${date})\nDM: <@${dmID}>\nTier: ${tier}` +
    (gpReceived !==  "0" ? `\n${gpReceived}${currency} each` : "") + 
    (doItems ? `\n${xpAll}xp earned by party` : `\n${xpReceived}xp each`) +
    "\n\n";

  rewardPlayers.set(dmID, players);

  if(!doItems) {
    for (let i = 0; i < playerNumber; i++) {
      const characters = await db.getCharacters(players[i].id).then();
      rewards += `<@${players[i].id}> (${players[i].username}) as \`${characters.length > 0 ? characters[0] : "character name"}\`\n`;
    }
    return interaction.reply(await makeCharacterSessionSelection(rewards, 0, players, null).then());
  }


  const rows = await db.filterItemsbyTier(tier, true).then();
  for (let i = 0; i < playerNumber; i++) {
    const item = rows[Math.floor(Math.random() * rows.length)];
    const characters = await db.getCharacters(players[i].id).then();
    rewards += `<@${players[i].id}> (${players[i].username}) as \`${characters.length > 0 ? characters[0] : "character name"}\`\n  Item: ${item.item_name} (price: ${item.price}, ${item.rarity})\n  ${xpReceived}xp\n\n`;
  }
  rewards = rewards.trim();

  return interaction.reply(await makeCharacterSessionSelection(rewards, 0, players, null).then());
}

/**
 * 
 * @param {string[]} parts 
 * @param {number} timestamp 
 * @param {interaction} interaction 
 */
export function westmarchRewardLogResult(parts, timestamp, interaction) {
  const date = new Date(timestamp);
  const dmID = parts[1];
  const xpReceived = parseInt(parts[2]);
  const tier = parseInt(parts[3]);
  const gpReceived = parts[4]; // 0: item  1: Gold 
  const doItems = parts[5] === "true";
  const sessionName = parts[6];
  const players = Array.from(interaction.members, ([id, user]) => user.user);

  interaction.deleteReply(interaction.message);

  return getSessionRewards(interaction, players, xpReceived, dmID, `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`, tier, gpReceived, doItems, sessionName);
}