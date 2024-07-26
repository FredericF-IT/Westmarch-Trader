import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { getDowntimes } from './itemsList.js';

const BUY_ITEM_COMMAND = {
  name: 'buy',
  description: 'Find out the buy cost of an item',
  options: [
    {
      type: 3,
      name: 'item',
      description: 'Name of the item to buy',
      required: true,
      autocomplete: true,
    },
    {
      type: 3,
      name: 'character',
      description: 'Name of your character',
      required: true,
    },
  ],
  type: 1,
};

const SELL_ITEM_COMMAND = {
  name: 'sell',
  description: 'Find out the sale price of an item',
  options: [
    {
      type: 3,
      name: 'item',
      description: 'Name of the item to sell',
      required: true,
      autocomplete: true,
    },
    {
      type: 3,
      name: 'character',
      description: 'Name of your character',
      required: true,
    },
  ],
  type: 1,
};

// Get the items from itemList.js
function createCommandChoices() {
  const choices = getDowntimes();
  const commandChoices = [];
  for (let i = 0; i < choices.length; i++) {
    //console.debug(choices[i][0]);
    //console.debug(choices[i][1].price);
    commandChoices.push({
      name: capitalize(choices[i][0]),
      value: choices[i][1].id.toString(),
    });
  } 
/*  for (let choice of choices) {
    console.debug(choice);
    commandChoices.push({
      name: capitalize(choice.description),
      value: choice.price,
    });
  }*/

  return commandChoices;
}

function createLevelChoices() {
  const commandChoices = [];
  for (let i = 0; i < 19; i++) {
    const level = (i + 2).toString();
    commandChoices.push({
      name: level,
      value: level,
    });
  } 
  return commandChoices;
}

const DOWNTIME_COMMAND = {
  name: 'downtime',
  description: 'Take a downtime action',
  options: [
    {
      type: 3,
      name: 'activity',
      description: 'What activity do you do?',
      required: true,
      choices: createCommandChoices(),
    },
    {
      type: 3,
      name: 'character',
      description: 'Name of your character',
      required: true,
    },
    {
      type: 3,
      name: 'level',
      description: "Your character's level",
      required: true,
      choices: createLevelChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [BUY_ITEM_COMMAND, SELL_ITEM_COMMAND, DOWNTIME_COMMAND];
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);