import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest, capitalize } from './utils.js';
import { getSanesItemPrices, getSanesItemNameIndex, getDowntimeTables, getDowntimeNames } from './itemsList.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


const allItems = getSanesItemPrices();
const allItemNames = getSanesItemNameIndex();
const allItemNamesLower = allItemNames.map(v => v.toLowerCase());

const downtimeTables = getDowntimeTables();
const downtimeNames = getDowntimeNames();

function getD100() {
  const max = 100;
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    
    if (name === 'downtime' && id) {
      for(let i = 0; i < 20; i++) {
        const roll = getD100();
        const downtimeType = req.body.data.options[0].value;
        const characterName = req.body.data.options[1].value;
        const characterLevel = req.body.data.options[2].value;
        
        const rollGroup = Math.floor((roll - 1) / 10);
        
        const result = "\nEvent: " + downtimeTables[downtimeType][1].table[0][rollGroup] + "\nEffect: " + downtimeTables[downtimeType][1].table[characterLevel - 1][rollGroup];
        //console.debug("e")
        //console.log(downtimeTables[0][1][0])
        
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Character: "'+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + result,
            //flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
    }
    
    else if ((name === 'buy' || name === 'sell') && id) {
      const userId = req.body.member.user.id;

      const itemIndex = parseInt(req.body.data.options[0].value);
      const characterName = req.body.data.options[1].value;

      console.debug(itemIndex);
      console.debug(allItems[itemIndex]);

      if(itemIndex == -1){
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Item "' + allItemNames[itemIndex][0] +'" can not be found.\nIt may be misspelled.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }

      const halvedPrice = (allItems[itemIndex][1].price / 2).toString() + "gp";
      const fullPrice = allItems[itemIndex][1].price.toString() + "gp";
      const realPrice = (name === 'sell' ? halvedPrice : fullPrice);

      const itemName = capitalize(allItems[itemIndex][0]);

      const typeName = (name === 'buy' ? 'Buy' : "Sell");
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Item: '+ itemName +'\nPrice: ' + realPrice,
            components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `accept_button_${realPrice+"$.$"+itemName+"$.$"+name+"$.$"+characterName}`, //req.body.id}`,
                    label: typeName,
                    style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
  }
  
  else if (type === 4) { // is Autocomplete
    const { name } = data;
    if (!(name === 'buy' || name === 'sell')) return;
    const currentInput = data.options[0].value;
    const matchingOptions = allItemNames.filter((itemName) =>
      itemName.toLowerCase().startsWith(currentInput.toLowerCase())
    );
    const matchingOptionsIndex = matchingOptions.map((itemName) => {
      return {
        name: `${itemName}`,
        value: `${allItemNames.indexOf(itemName)}`}
    });
    //console.debug(matchingOptionsIndex);
    const result = matchingOptionsIndex.slice(0, 25)
    console.debug(result);
    try {
      await res.send({
        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: {
            choices: result
        },
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
  
  else if (type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = data.custom_id;
    
    const priceAndName = componentId.replace('accept_button_', '').split("$.$");
    const price = priceAndName[0];
    const itemName = priceAndName[1];
    const buyOrSell = priceAndName[2];
    const characterName = priceAndName[3];

    if (!componentId.startsWith('accept_button_')) return;
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'Approved transaction: ' + characterName + " (@" +req.body.member.user.username + ") " + buyOrSell + 's "' + itemName + '" for ' + price,
        },
      });
      // Delete previous message
      await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err);
    }

  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
