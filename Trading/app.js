// @ts-check
import 'dotenv/config';
import {
  InteractionType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DateListener, DOWNTIME_LOG_CHANNEL, errorResponse, getChannel, InstallGlobalCommands, registerDateListener, responseMessage, setClient } from './utils.js';
import './itemsList.js';
import { requestCharacterRegistration } from './extraUtils.js';
import { startCharacterDowntimeThread, rollCharacterDowntimeThread, selectCraftingOption } from "./downtimeCraft.js";
import { Client, Events, IntentsBitField, Partials, TextChannel, User } from "discord.js";
import { commandCreator } from './commands.js';
import { explainMe } from './explanation.js';
import { DBIO, DBLoadedListener } from './createDB.js';
import { parseFullCommand, handleAutocomplete, handleComponentPreEvent } from './commandInteractions.js';
import { emojiReactionLogbook, requestLogBookNotes, logLoadPlayerPage, logPrintMessage, logSelectCharacter, receiveLogBookNotes, westmarchRewardLogResult, westmarchLog } from './logbook.js';
import { acceptTransaction, doTrade } from './transaction.js';
import { /*displayItemsInRange,*/ getItemsInRange } from './displayItems.js';
import { getDowntimeSQLite3, sendDowntimeCopyableAll } from './downtimes.js';
import { MultiMessageSender } from './MultiMessageSender.js';

/**
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").responseObject} responseObject
 */

/** @type {Client} */
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction
  ],
});
process.on('SIGINT', () => {
  db.close();
});

const db = DBIO.getDB();

client.on('ready', (c) => {
  console.log("Bot is running");
  setClient(client);

  db.init('./data/trader_v2.db');

  registerDateListener(new DateListener((date) => {
    getChannel(DOWNTIME_LOG_CHANNEL).then((channel) => {
      if(!(channel instanceof TextChannel)) {
        console.error(`This channel is not a text channel.`);
        return;
      }
      const timeStamp = Math.floor(date.getTime() / 1000);
      channel.send(responseMessage(`Downtime was reset!\nNext Downtime reset: <t:${timeStamp}:R>`, false));
    });
  }));
});

/**
 * @param {interaction} interaction 
 * @param {string} itemID 
 * @param {string} characterName 
 * @param {string} userID 
 * @param {string} level 
 * @return {Promise<Promise>} JS Object for interaction.reply()
 */
export async function downtimeCraftItem(interaction, itemID, characterName, userID, level) {
  if(!await db.characterExists(userID, characterName).then())
    return interaction.reply(requestCharacterRegistration("itemCraft", characterName, [itemID, level]));
  
  const item = await db.getItem(itemID).then();
  
  getChannel(DOWNTIME_LOG_CHANNEL).then((channel) => {
    if(!(channel instanceof TextChannel)) {
      interaction.reply(errorResponse(`Channel <#${DOWNTIME_LOG_CHANNEL}> (Downtime log: ${DOWNTIME_LOG_CHANNEL}) not found.`));
      return;
    }
    channel.send({
      content: `${characterName} (<@${userID}>) wants to craft ${item.item_name}.\n` +
        `Material cost: ${item.price}\n` +
        `You will need to succeed on a craft check using a tool proficiency.\n` +
        `You may justify how your tool can be useful in crafting with rp / exposition if it is not obvious.\n` +
        "If you have another item in progress, starting a new item will overwrite that one.",
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW.valueOf(),
          components: [
            {
                type: MessageComponentTypes.BUTTON.valueOf(),
                custom_id: `characterThread_${userID}_` + itemID + "_" + characterName + "_" + level,
                label: "Start crafting",
                style: ButtonStyleTypes.PRIMARY.valueOf(),
            },
          ],
        },
      ],
    });
  });

  return interaction.reply(responseMessage(`Inital message created in <#${DOWNTIME_LOG_CHANNEL}>`, true));
}

function downtimeChangeItem() {
  return errorResponse("Not implemented");
}

/**
 * 
 * @param {boolean} isRegister 
 * @param {string} characterName
 * @param {User} user 
 * @return {Promise<responseObject>} JS Object for interaction.reply()
 */
export async function registration(isRegister, characterName, user) {
  let userCharacters = await db.getCharacters(user.id).then();

  if (userCharacters.length >= 11) 
    return errorResponse("You already have 10 characters.");
  
  const exists = userCharacters.includes(characterName);
  
  if(isRegister) {
    if (exists) 
      return errorResponse("You have a character with that name already.");
    
    db.insertCharacter(user.id, characterName, false);

    return {
      content: "Character added.",
      ephemeral: true,
    };
  }

  if (!exists) 
    return errorResponse("Please input a valid name.");
  
  
  db.deleteCharacter(user.id, characterName)
  return {
    content: "Character removed.",
    ephemeral: true,
  };
}

/**
 * @param {User} user 
 * @return {Promise<responseObject>} JS Object for interaction.reply()
 */
async function showCharacters(user) {
  let userCharacters = await db.getCharacters(user.id).then();
  
  return {
    content: "Your characters:\n- " + userCharacters.join("\n- "),
    ephemeral: true,
  };
}

const rareSeperator = "$.$=$";

client.on(Events.MessageReactionAdd, (reaction_orig, user) => {
  emojiReactionLogbook(reaction_orig, user);
});

// @ts-ignore
client.on(Events.InteractionCreate, 
  /** @param {interaction} interaction */
  async (interaction) => {
  try{
    const { type, id } = interaction;
    const user = interaction.user == null ? interaction.member.user : interaction.user;
    const userID = user.id;
    const channelID = interaction.channelId;
    const isDirectMessage = interaction.guildId == null;

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { commandName, options } = parseFullCommand(interaction);
      
      let isTrue = false; 
      switch(commandName) {
        case "explanationtrader": 
          return explainMe(interaction, client, channelID, user, isDirectMessage);

        case "getitemsbytier": 
          isTrue = true;
        case "getitemsinrange": 
          return getItemsInRange(interaction, options, id, isTrue);

        case "westmarch downtime":
          return getDowntimeSQLite3(interaction, options, userID);
          case "westmarch downtimehistory":
            return sendDowntimeCopyableAll(interaction, userID, options[0].value);
        case "westmarch item-downtime craft": 
          return downtimeCraftItem(interaction, options[0].value, options[1].value, userID, options[2].value);
        case "westmarch item-downtime change": 
          return interaction.reply(downtimeChangeItem());
        
        case "westmarch logbook": 
          if(isDirectMessage) return interaction.reply(errorResponse("Please use this only in the server.\nYou will need to select your players."));
          return interaction.reply(westmarchLog(options, user));
        
        case "westmarch buy": 
          isTrue = true;
        case "westmarch sell": 
          return doTrade(interaction, userID, options, isTrue);
        
        case "westmarch character register": 
          isTrue = true;
        case "westmarch character unregister": 
          return interaction.reply(await registration(isTrue, options[0].value, user).then());
        case "westmarch character show": 
          return interaction.reply(await showCharacters(user).then());
      }
    }

    else if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) { // is Autocomplete
      return handleAutocomplete(interaction, user);
    }

    else if (type === InteractionType.MESSAGE_COMPONENT) {
      let componentId = interaction.customId;
      const parts = componentId.split("_");

      const message = interaction.message;

      if(componentId.startsWith(rareSeperator)) {
        return handleComponentPreEvent(interaction, componentId, user);
      }
      
      const creatorID = parts[1];
      switch(parts[0]){
        case MultiMessageSender.getID():
          return MultiMessageSender.nextPage(interaction);

        //case "itemspage":
        //  return interaction.reply(displayItemsInRange(parts));

        case "wmRewardPrint":
          return logPrintMessage(interaction, client, userID, parts);
        case "wmRewardNotes":
          return requestLogBookNotes(interaction)
        case "wmRewardEditLast":
        case "wmRewardEditNext":
        case "wmRewardEditSame":
          return logLoadPlayerPage(interaction, parts, userID, isDirectMessage);
        case "wmRewardSelectChar":
          return logSelectCharacter(interaction, isDirectMessage, userID, parts[1]);
        case "westmarchrewardlog":
          return westmarchRewardLogResult(parts, interaction.message.createdTimestamp, interaction);

        case "downtimeItemProfSelect":
          return selectCraftingOption(interaction, userID, creatorID, parts);
        case "characterThread":
          return interaction.reply(await startCharacterDowntimeThread(message, parts, userID, interaction.message.id).then());
        case "characterThreadFinished":
          return rollCharacterDowntimeThread(parts, userID, interaction);

        case "acceptTransactionButton":
          return acceptTransaction(componentId, userID, client, interaction);

        case "dmExplanation":
          return explainMe(interaction, client, "", user, isDirectMessage);
      }
    }
    else if (type === InteractionType.MODAL_SUBMIT) {
      let componentId = interaction.customId;
      const parts = componentId.split("_");
      
      if(parts[0] === "wmRewardNotes") {
        receiveLogBookNotes(interaction, userID, isDirectMessage, parts);
      }
    }
  } catch (err) {
    console.error('\n\nError sending message:', err);
    if(interaction.type != InteractionType.MESSAGE_COMPONENT) {
      const { commandName, options } = parseFullCommand(interaction);
      console.error(`Error command:\n${commandName}\n${JSON.stringify(options)}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

db.registerDBLoadedListener(new DBLoadedListener(async () => {
  const shouldUpdate = false;
  if(shouldUpdate) {
    InstallGlobalCommands(process.env.APP_ID, await commandCreator.getCommands(db).then());
  }


  const shouldCreateDB = false;
  if(shouldCreateDB) {
    db.createDB();
  }
}))