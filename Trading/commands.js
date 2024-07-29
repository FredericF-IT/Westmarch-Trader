import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { getDowntimes } from './itemsList.js';

/*const BUY_ITEM_COMMAND = {
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
*/
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

/*
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
      type: 10,
      name: 'level',
      description: "Your character's level",
      required: true,
      choices: createLevelChoices(),
    },
  ],
  type: 1,
};


const REWARD_COMMAND = {
  name: 'westmarchreward',
  description: 'Calculate what gp and items players get after session',
  options: [
    {
      type: 10,
      name: 'xp',
      description: 'How much xp does the party receive?',
      required: true,
    },
    {
      type: 10,
      name: 'players',
      description: 'Number of players to recieve items',
      required: true,
    },
  ],
  type: 1,
};*/

const ITEM_RANGE_COMMAND = {
  name: 'getitemsinrange',
  description: "Print a list of items within two gp values, according to sane's.",
  options: [
    {
      type: 10,
      name: 'minimum',
      description: 'The item will cost this much or more',
      required: true,
    },
    {
      type: 10,
      name: 'maximum',
      description: 'The item will cost this much or less',
      required: true,
    },
  ],
  type: 1,
};

const EXPLAIN_ME_COMMAND = {
  name: 'explanationtrader',
  description: "Get the explanation of the bot",
  options: [
    {
      type: 5,
      name: 'ethereal',
      description: 'Should the message be only visible to you?',
      required: true,
    },
    {
      type: 4,
      name: 'page',
      description: 'What page?',
      required: true,
    },
  ],
  type: 1,
};

const WESTMARCH_COMMANDS = {
  name: 'westmarch',
  description: "The different westmarch commands",
  options: [
    {
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
          autocomplete: true,
        },
      ],
      type: 1,
    },
    {
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
          autocomplete: true,
        },
      ],
      type: 1,
    },
    {
      name: 'reward',
      description: 'Calculate what gp and items players get after session',
      options: [
        {
          type: 4,
          name: 'xp',
          description: 'How much xp does the party receive?',
          required: true,
        },
        {
          type: 4,
          name: 'players',
          description: 'Number of players to recieve items',
          required: true,
        },
      ],
      type: 1,
    },
    {
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
          autocomplete: true,
        },
        {
          type: 4,
          name: 'level',
          description: "Your character's level",
          required: true,
          choices: createLevelChoices(),
        },
      ],
      type: 1,
    },
    {
      name: 'character',
      description: "Add or remove a character's name from the bot record",
      options: [
        {
          type: 1,
          name: 'register',
          description: "Add a character to the bot's list",
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Name of your new character',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'unregister',
          description: "Remove a character from the bot's list",
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Name of the character',
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          type: 1,
          name: 'show',
          description: "Show all your registered characters",
        },
      ],
      type: 2,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [ITEM_RANGE_COMMAND, WESTMARCH_COMMANDS, EXPLAIN_ME_COMMAND];
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);