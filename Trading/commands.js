import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { getDowntimes, getProficiencies } from './itemsList.js';

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
  type: 1,
};

const TEST_COMMAND = {
  name: 'woopwoop',
  description: "testing",
  options: [
    {
      type: 6,
      name: 'players',
      description: 'players',
      required: true,
    },
  ],
  type: 1,
  
}

const WESTMARCH_COMMANDS = {
  type: 1,
  name: 'westmarch',
  description: "The different westmarch commands",
  options: [
    {
      name: 'buy',
      type: 1,
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
        {
          type: 4,
          name: 'amount',
          description: 'How many of these items to buy',
          required: false,
        },
      ],
    },
    {
      name: 'sell',
      type: 1,
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
        {
          type: 4,
          name: 'amount',
          description: 'How many of these items to sell',
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: 'reward',
      description: 'Logbook template. Calculate what gp and items players get after session',
      options: [
        {
          type: 4,
          name: 'tier',
          description: 'What was the recommended tier?',
          choices: [{
            name: "Tier 1 (2-4)",
            value: "1",
          },{
            name: "Tier 2 (5-10)",
            value: "2",
          },{
            name: "Tier 3 (11-16)",
            value: "3",
          },{
            name: "Tier 4 (17-20)",
            value: "4",
          }],
          required: true,
        },
        {
          type: 4,
          name: 'xp',
          description: 'How much xp does the party receive?',
          required: true,
        },
      ],
    },
    {
      type: 2,
      name: 'item-downtime',
      description: 'Take a downtime action to craft or change items using proficiency ',
      options: [
        {
          type: 1,
          name: 'craft',
          description: "Craft an item from materials",
          options: [
            {
              type: 3,
              name: 'item',
              description: 'Item of choice',
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
            /*{
              type: 3,
              name: 'proficiency',
              description: 'Pick tool proficiency if any',
              choices: createProficiencyChoices(),
            },*/
          ],
        },
        {
          type: 1,
          name: 'change',
          description: "Change an items type (e.g.: Longsword -> Mace, Helmet -> Ring)",
          options: [
            {
              type: 3,
              name: 'testa',
              description: 'not implmented',
              required: true,
              choices: createCommandChoices(),
            },
          ],
        },
      ],
    },
    {
      type: 1,
      name: 'downtime',
      description: "Use a downtime action to gain benefits",
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
    },
    {
      name: 'character',
      type: 2,
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
    },
  ],
};

export const ALL_COMMANDS = [ITEM_RANGE_COMMAND, WESTMARCH_COMMANDS, EXPLAIN_ME_COMMAND];//, TEST_COMMAND];
//InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);