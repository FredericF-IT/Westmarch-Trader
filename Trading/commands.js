import 'dotenv/config';
import { capitalize } from './utils.js';
import { getDowntimes } from "./downtimes.js";

// Get the items from itemList.js
function createCommandChoices() {
  const choices = getDowntimes();
  const commandChoices = [];
  for (let i = 0; i < choices.length; i++) {
    commandChoices.push({
      name: capitalize(choices[i][0]),
      value: choices[i][1].id.toString(),
    });
  } 
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

const tierCoices = [{
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
}];

const ITEM_TIER_COMMAND = {
  name: 'getitemsbytier',
  description: "Print a list of items that appear as random loot at a tier.",
  options: [
    {
      type: 4,
      name: 'tier',
      description: 'What tier?',
      choices: tierCoices,
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
          choices: tierCoices,
          required: true,
        },
        {
          type: 4,
          name: 'xp',
          description: 'How much xp does the party receive?',
          required: true,
        },
        {
          type: 4,
          name: 'reward',
          description: 'What reward does the party receive?',
          required: false,
          choices: [{
            name: "Items",
            value: 0
          },{
            name: "Gold",
            value: 1
          }],
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

export const ALL_COMMANDS = [ITEM_RANGE_COMMAND, ITEM_TIER_COMMAND, WESTMARCH_COMMANDS, EXPLAIN_ME_COMMAND];//, TEST_COMMAND];
//InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);