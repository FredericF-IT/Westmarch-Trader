// @ts-check
import { ButtonStyleTypes, MessageComponentTypes } from 'discord-interactions';
import { DBIO } from './DBIO.js';
import { requestCharacterRegistration } from './extraUtils.js';
import { errorResponse, responseMessage, TRANSACTION_LOG_CHANNEL, CHARACTER_TRACKING_CHANNEL, ITEM_ADDITION_CHANNEL, currency, getChannel, rarity, rarityFromId, tierSellPrice } from './utils.js';
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
  if(isBuying && item.price < 0){
    return interaction.reply(responseMessage("Item " + item.item_name + " not for sale",true));
  }

  let realPrice = item.price;
  if(!isBuying){
      if(item.rarity == rarity.common){
        realPrice = item.price / 2;
      }else{
        realPrice = tierSellPrice[item.rarity];
        if(item.consumable) realPrice = realPrice / 2;
      }
  }
  
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

function isStringIntegerRegex(str) {
  return /^-?\d+$/.test(str);
}

/**
 * @param {string} componentId 
 * @param {string} userID 
 * @param {Client} client 
 * @param {interaction} interaction 
 */
export async function acceptItemEdits(componentId, userID, client, interaction) {
  const channel = await getChannel(ITEM_ADDITION_CHANNEL).then();
  if(!channel) {
    interaction.reply(errorResponse(`Channel <#${ITEM_ADDITION_CHANNEL}> (Transaction log: ${ITEM_ADDITION_CHANNEL}) not found.`));
    return;
  }
  if(!(channel instanceof TextChannel)) {
    console.error(`This channel is not a text channel.`);
    return;
  }

  //custom_id: `acceptItemEditsButton_${typeName}_${item}_${itemId}_${rarity}_${price}_${consumable}`,
  const parts = componentId.split("_");
  const tType = parts[1];
  const item = parts[2];
  const itemId = parseInt(parts[3]);

  //only used for add/edit
  const itemRarity = parseInt(parts[4]);
  const price = parseFloat(parts[5]);
  const consumable = parseInt(parts[6]);

  const rarityName = rarityFromId(itemRarity);
  
  //need to add item to database or edit item in database
  let data;
  let contentMsg =  `<@${userID}>\n**${tType} item:**  ${item}\n**rarity:**  ${rarityName}   **price:**  ${price}${currency}\n**consumable:**  ${consumable ? "true" : "false"}   **roll:**  ${price == 0 ? "true" : "false"}   **Not for sale:**  ${price < 0 ? "true" : "false"}`;
  switch(tType){
      case "Add":
          data = await db.dbAddItem(item, itemRarity, price, consumable);
          break;
      case "Edit":
          data = await db.dbEditItem(itemId, itemRarity, price, consumable);
          break;
      case "Remove":
          data = await db.dbRemoveItem(itemId);
          contentMsg =  `<@${userID}> ${tType}: *item:* ${item}`;
          break;
      default:
          console.log('Unknown Transaction Type: ' + tType);
          return;
  }

  channel.send({
      content: `${contentMsg}`, 
  }).then((/** @type {Message} */ message) => {
    interaction.reply(responseMessage(
      `Item ${tType} ${item}\n${interaction.channelId != ITEM_ADDITION_CHANNEL ? `Log was sent to <#${ITEM_ADDITION_CHANNEL}>\n` : ""}`,
      true));
  });
}

export async function addEditItem(interaction, userID, options){
    let item = options[0].value;
    let itemId = -1;
    const itemRarity = parseInt(options[1].value);

    //check if we have and id or item text
    let isID = false;
    if(isStringIntegerRegex(options[0].value)){
        isID = true;
    }

    let price = 0;
    let consumable = 0;

    //get rest of our options
    for(let i = 2; i < options.length; i++){
        switch (options[i].name) {
            case "price":
                price = options[i].value;
                break;
            case "consumable":
                consumable = options[i].value;
                break;
            default:
                console.log('Unhandled option: ' + options[i].name);
                break;
        }
    }

    //lookup to see if item exists
    if(isID){
        itemId = parseInt(item);
        const lookupItem = await db.getItem(itemId).then()    
        if(!lookupItem){
            return interaction.reply(errorResponse('Item(' + item + ') can not be found.'));
        }else{
            item = lookupItem.item_name;
        }
    }

    if(rarityFromId(itemRarity) === rarity.common && price === 0){
        return interaction.reply(errorResponse('Item(' + item + ') of rarity(' + rarityFromId(itemRarity) + ') must have set price.'));
    }

    const typeName = isID ? 'Edit' : "Add";

    interaction.reply({
        content: "Action: " + typeName + "\nItem: " + item + "\nrarity: " + itemRarity + "\nprice: " + price + "\nconsumable: " + consumable + "\n",
      ephemeral: true,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW.valueOf(),
          components: [
            {
                type: MessageComponentTypes.BUTTON.valueOf(),
                // @ts-ignore
                custom_id: `acceptItemEditsButton_${typeName}_${item}_${itemId}_${itemRarity}_${price}_${consumable}`,
                label: typeName,
                style: ButtonStyleTypes.PRIMARY.valueOf(),
            },
          ],
        },
      ],
    });
}

export async function removeItem(interaction, userID, options){
    let item = options[0].value;
    let itemId = -1;

    //check if we have and id or item text
    let isID = false;
    if(isStringIntegerRegex(options[0].value)){
        isID = true;
    }else{
        return interaction.reply(errorResponse('Item(' + item + ') can not be found.'));
    }

    let itemRarity = 0;
    let price = 0;
    let consumable = 0;

    itemId = parseInt(item);
    const lookupItem = await db.getItem(itemId).then()    
    if(!lookupItem){
        return interaction.reply(errorResponse('Item(' + item + ') can not be found.'));
    }else{
        item = lookupItem.item_name;
    }

    const typeName = "Remove";

    interaction.reply({
        content: "Action: " + typeName + "\nItem: " + item + "\n",
      ephemeral: true,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW.valueOf(),
          components: [
            {
                type: MessageComponentTypes.BUTTON.valueOf(),
                // @ts-ignore
                custom_id: `acceptItemEditsButton_${typeName}_${item}_${itemId}_${itemRarity}_${price}_${consumable}`,
                label: typeName,
                style: ButtonStyleTypes.PRIMARY.valueOf(),
            },
          ],
        },
      ],
    });
}
