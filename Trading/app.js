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
import { writeDataFile, readDataFile, mapToString, parseMap } from './data/dataIO.js';

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

const lastItemResult = new Map();

const namesCharactersFile = "data/PlayerNames.json";

function getD100() {
  const max = 100;
  return Math.floor(Math.random() * max) + 1;
}

function filterItems(gpReceived, gpMinimumCost) {
  return allItems.filter(function(element) {
      return element[1].price <= gpReceived && element[1].price >= gpMinimumCost;
  });
}

function getItemsInRange(options, id) {
  let minPrice = options[0].value;
  let maxPrice = options[1].value;

  // swap the min and max if they're the wrong way around
  if(minPrice > maxPrice) {
    minPrice = minPrice ^ maxPrice;
    maxPrice = minPrice ^ maxPrice;
    minPrice = minPrice ^ maxPrice;
  }

  const itemsInRange = filterItems(maxPrice, minPrice).sort((a, b) => a[1].price - b[1].price);

  let result = [""];
  let j = 0;
  for (let i = 0; i < itemsInRange.length; i++) {
    const nextSection = "- " + itemsInRange[i][0] + " " + itemsInRange[i][1].price + "gp\n";
    if (nextSection.length + result[j].length > 2000) {
      j++;
      result[j] = ""
    }
    result[j] += nextSection;
  }

  if(j == 0){
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: result[0],
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  lastItemResult.set(id, result);
  
  const minutesTillDeletion = 5;
  setTimeout(
    () => {
      lastItemResult.delete(id);
    }, 1000 * 60 * minutesTillDeletion);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: result[0],
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        flags: InteractionResponseFlags.EPHEMERAL,
        components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
                type: MessageComponentTypes.BUTTON,
                custom_id: `itemspage_1_`+id,
                label: "Load more items",
                style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}

function getDowntime(options) {
  const roll = getD100();
  const downtimeType = options[0].value;
  const characterName = options[1].value;
  const characterLevel = options[2].value;

  const rollGroup = Math.floor((roll - 1) / 10);

  const result = "\nEvent: " + downtimeTables[downtimeType][1].table[0][rollGroup] + "\nEffect: " + downtimeTables[downtimeType][1].table[characterLevel - 1][rollGroup];

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Character: "'+ characterName + '" (Level ' + characterLevel + ')'+'\nActivity: ' + downtimeNames[downtimeType] + '\nRoll: ' + roll.toString() + result,
    },
  };
}

function getSessionRewards(options) {
  const playerNumber = options[1].value;
  const xpReceived = Math.ceil(options[0].value / playerNumber);
  if(playerNumber < 1 || xpReceived < 0) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Please only use positive values",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  const goldFactor = 4;
  const gpReceived = xpReceived * goldFactor;

  const itemsUnderPrice = filterItems(xpReceived * (goldFactor - 1), xpReceived);

  let rewards = xpReceived + "xp each\nGold without item: " + gpReceived + "gp each\n";
  for (let i = 0; i < playerNumber; i++) {
    const item = itemsUnderPrice[Math.floor(Math.random() * itemsUnderPrice.length)];
    rewards += "Player " + (i + 1) + "\n  Item: " + item[0] + " (price: " + item[1].price + ")\n  Gold: " + (gpReceived - item[1].price) + "gp\n";
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: rewards,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function doTrade(userID, options, name) {
  const itemIndex = parseInt(options[0].value);
  const characterName = options[1].value;

  if(itemIndex == -1) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Item "' + allItemNames[itemIndex][0] +'" can not be found.\nIt may be misspelled.',
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  const halvedPrice = (allItems[itemIndex][1].price / 2).toString() + "gp";
  const fullPrice = allItems[itemIndex][1].price.toString() + "gp";
  const realPrice = (name === 'sell' ? halvedPrice : fullPrice);

  const itemName = capitalize(allItems[itemIndex][0]);

  const typeName = (name === 'buy' ? 'Buy' : "Sell");
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: "Character: " + characterName + '\nItem: '+ itemName +'\nPrice: ' + realPrice,
        flags: InteractionResponseFlags.EPHEMERAL,
        components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
                type: MessageComponentTypes.BUTTON,
                custom_id: `accept_button_${realPrice+"$.$"+itemName+"$.$"+name+"$.$"+characterName}`,
                label: typeName,
                style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}

function registration(name, options, user, characters) {
  const isRegister = name === 'register';
  const characterName = options[0].value;
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  const exists = userCharacters.includes(characterName);
  
  if(isRegister) {
    if (exists) return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "You have a character with that name already.",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
    
    userCharacters.push(characterName);
    characters[user.id] = userCharacters;
    const output = JSON.stringify(characters);
    writeDataFile(namesCharactersFile, output);
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Character added.",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }
  
  const charIndex = userCharacters.indexOf(characterName);
  userCharacters.splice(charIndex, charIndex);
  
  characters[user.id] = userCharacters;
  const output = JSON.stringify(characters);
  writeDataFile(namesCharactersFile, output);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Character removed.",
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function showCharacters(user, characters) {
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  
  userCharacters.shift();
  
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Your characters:\n- " + userCharacters.join("\n- "),
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

function characterNamesAutoComplete(currentInput, user, res) {
  const characters = JSON.parse(readDataFile(namesCharactersFile));
  
  let userCharacters = characters[user.id];
  if (userCharacters == undefined) {
    userCharacters = [user.username];
  }
  userCharacters.shift();

  const matchingOptions = userCharacters.filter((charName) =>
    charName.toLowerCase().startsWith(currentInput.toLowerCase())
  );
  const matchingOptionsIndex = matchingOptions.map((charName) => {
    return {
      name: `${charName}`,
      value: `${charName}`}
  });

  const result = matchingOptionsIndex.slice(0, 25);

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
        choices: result
    },
  };
}

function explainMe(ethereal, res, page) {
  const messages = readDataFile("data/explanation.txt").split("\\newLine");
  if(ethereal) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: messages[page],
          flags: InteractionResponseFlags.EPHEMERAL,
      },
    });
  }
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: messages[page],
    },
  });
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  let options = req.body.data.options;
  const userID = req.body.member.user.id;
  
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
    
    let { name } = data;
    
    // slash commands
    
    if (name == 'getitemsinrange' && id) {
      return res.send(getItemsInRange(options, id));
    }
    
    else if (name == 'explanationtrader' && id) {
      return explainMe(options[0].value, res, options[1].value - 1);
    }
    
    
    else if (name != "westmarch") return;
    
    // sub commands

    name = options[0].name;
    options = options[0].options
    
    if (name === 'downtime' && id) {
      return res.send(getDowntime(options));
    }
    
    else if (name == 'reward' && id) {
      return res.send(getSessionRewards(options));
    }
    
    else if ((name === 'buy' || name === 'sell') && id) {
      return res.send(doTrade(userID, options, name));
    }
    
    // sub sub commands    
    const oldname = name;
    name = options[0].name;
    options = options[0].options
  
    if(oldname === 'character') {
      const characters = JSON.parse(readDataFile(namesCharactersFile));
      if ((name === 'register' || name === 'unregister') && id) {
        return res.send(registration(name, options, req.body.member.user, characters));
      }
      
      else if (name === 'show' && id) {
        return res.send(showCharacters(req.body.member.user, characters));
      }
    }
  }
  
  else if (type === 4) { // is Autocomplete
    let { name } = data;
    
    if (name != "westmarch") return;
    
    name = options[0].name;
    const isTrading = name == "buy" || name == "sell";
    
    const firstOption = options[0].options;
    
    if (firstOption.length == 1 && isTrading) {
      
      const currentInput = firstOption[0].value;

      const matchingOptions = allItemNames.filter((itemName) =>
        itemName.toLowerCase().startsWith(currentInput.toLowerCase())
      );
      const matchingOptionsIndex = matchingOptions.map((itemName) => {
        return {
          name: `${itemName}`,
          value: `${allItemNames.indexOf(itemName)}`}
      });

      const result = matchingOptionsIndex.slice(0, 25);

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
    
    else if(isTrading || name == "character" || name == "downtime") {
      //console.debug(options);
      name = options[0].name;
      options = options[0].options;
      //console.debug(options);

      let currentInput = "";
      
      if (options[0].name == "unregister") {
        currentInput = options[0].options[0].value;
      }
      else if (options[1].name == "character") {
        currentInput = options[1].value;
      }
      
      try {
        await res.send(characterNamesAutoComplete(currentInput, req.body.member.user, res));
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  }
  
  else if (type === InteractionType.MESSAGE_COMPONENT) {
    
    const componentId = data.custom_id;
    const parts = componentId.split("_");
    if(parts[0] == "itemspage") {
      const j = parseInt(parts[1]);
      const originalID = parts[2];
      
      const itemPages = lastItemResult.get(originalID);
      if(itemPages == undefined) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Request has expired. Please resend command.",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      
      if(j + 1 >= itemPages.length) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: itemPages[j],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: itemPages[j],
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `itemspage_` + (j + 1) + "_" + originalID,
                    label: "Load more items",
                    style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
    
    const priceAndName = componentId.replace('accept_button_', '').split("$.$");
    const price = priceAndName[0];
    const itemName = priceAndName[1];
    const buyOrSell = priceAndName[2];
    const characterName = priceAndName[3];

    if (!componentId.startsWith('accept_button_')) return;
    // Delete message with token in request body
    //const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Approved transaction: ' + characterName + " (<@" + userID + ">) " + buyOrSell + 's "' + itemName + '" for ' + price,
        },
      });
      // Delete previous message
      //await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err);
    }

  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
