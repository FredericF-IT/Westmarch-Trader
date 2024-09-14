// @ts-check
import { ButtonStyleTypes, MessageComponentTypes } from 'discord-interactions';
import { DBIO } from './createDB.js';
import { requestCharacterRegistration } from './extraUtils.js';
import { errorResponse, responseMessage, TRANSACTION_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL, currency, getChannel } from './utils.js';
import { TextChannel } from 'discord.js';

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("./types.js").option} option
 */

const db = DBIO.getDB();

/**
 * @param {string} componentId 
 * @param {string} userID 
 * @param {Client} client 
 * @param {interaction} interaction 
 */
export async function acceptTransaction(componentId, userID, client, interaction) {
  const channel = await getChannel(TRANSACTION_LOG_CHANNEL).then();
  if(!channel) {
    interaction.reply(errorResponse(`Channel <#${TRANSACTION_LOG_CHANNEL}> (Transaction log: ${TRANSACTION_LOG_CHANNEL}) not found.`));
    return;
  }
  if(!(channel instanceof TextChannel)) {
    console.error(`This channel is not a text channel.`);
    return;
  }

  const parts = componentId.split("_");
  const price = parseFloat(parts[1]);
  const itemName = parts[2];
  const itemCount = parseInt(parts[3]);
  const buyOrSell = parts[4];
  const characterName = parts[5];

  channel.send({
    content: `Approved transaction: ${characterName} (<@${userID}>) ${buyOrSell.toLowerCase()}s ${(itemCount > 1 ? `${itemCount}x ` : '')}"${itemName}" for ${itemCount * price}${currency}`,
  }).then((/** @type {Message} */ message) => {
    interaction.reply(responseMessage(
      `Transaction approved!\n${interaction.channelId != TRANSACTION_LOG_CHANNEL ? `Log was sent to <#${TRANSACTION_LOG_CHANNEL}>\n` : ""}`+
      `Copy this to your character sheet in <#${CHARACTER_TRACKING_CHANNEL}>:\n` +
      `\`\`\`**Transaction summary**\n- ${buyOrSell}: ${(itemCount > 1 ? `${itemCount}x ` : '')}"${itemName}" ${buyOrSell === "Sell" ? "+" : "-"}${itemCount * price}${currency} (${message.url})\`\`\``,
      true));
  });
}

/**
 * @param {interaction} interaction 
 * @param {string} userID 
 * @param {[{value: string},{value: string},{value: number}] | option[]} options 
 * @param {boolean} isBuying
 */
export async function doTrade(interaction, userID, options, isBuying) {
  const itemID = parseInt(options[0].value);
  const characterName = options[1].value;
  const itemCount = options.length > 2 ? options[2].value : 1;
  
  if(!await db.characterExists(userID, characterName).then()){
    return interaction.reply(requestCharacterRegistration("doTrade", characterName, [itemID, itemCount, isBuying]));
  }

  const item = await db.getItem(itemID).then();
  if(!item) {
    return interaction.reply(errorResponse('Item can not be found.\nIt may be misspelled.'));
  }
  if(itemCount < 1) {
    return interaction.reply(errorResponse("Can not trade less items than 1"));
  }

  const realPrice = item.price / (isBuying ? 1 : 2);
  
  const itemName = item.item_name;

  const typeName = isBuying ? 'Buy' : "Sell";
  interaction.reply({
    content: "Character: " + characterName + '\nItem: ' + itemName + " x" + itemCount +'\nPrice: ' + (itemCount * realPrice) + (itemCount > 1 ? currency + " (" + realPrice + currency + " each)" : currency),
    ephemeral: true,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
              type: MessageComponentTypes.BUTTON.valueOf(),
              // @ts-ignore
              custom_id: `acceptTransactionButton_${realPrice}_${itemName}_${itemCount}_${typeName}_${characterName}`,
              label: typeName,
              style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
        ],
      },
    ],
  });
}