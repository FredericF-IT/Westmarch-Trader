// @ts-check
import 'dotenv/config';
import { capitalize, currency } from './utils.js';
import { DBIO } from './DBIO.js';

export class commandCreator{
  /**
   * @param {DBIO} db 
   * @returns 
   */
  static async createCommandChoices(db) {
    const choices = await db.getDowntimes().then();
    const commandChoices = [];
    for (let i = 0; i < choices.length; i++) {
      commandChoices.push({
        name: capitalize(choices[i].name),
        value: choices[i].id.toString(),
      });
    } 
    return commandChoices;
  }

  static createLevelChoices() {
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


  static ITEM_RANGE_COMMAND = {
    name: 'getitemsinrange',
    description: "Print a list of items within two " + currency + " values, according to sane's.",
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

  static tierCoices = [{
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

  static ITEM_TIER_COMMAND = {
    name: 'getitemsbytier',
    description: "Print a list of items that appear as random loot at a tier.",
    options: [
      {
        type: 4,
        name: 'tier',
        description: 'What tier?',
        choices: commandCreator.tierCoices,
        required: true,
      },
    ],
    type: 1,
  };

  static EXPLAIN_ME_COMMAND = {
    name: 'explanationtrader',
    description: "Get / Update the explanation of the bot. Deletes all his previous messages.",
    type: 1,
  };

  /**
   * @param {DBIO} db 
   * @return {Promise<Object[]>}
   */
  static async getCommands(db){
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
          name: 'logbook',
          description: 'Creates the log for a session.',
          options: [
            {
              type: 3,
              name: 'session',
              description: 'What was the sesions name?',
              required: true,
            },
            {
              type: 4,
              name: 'tier',
              description: 'What was the recommended tier?',
              choices: commandCreator.tierCoices,
              required: true,
            },
            {
              type: 4,
              name: 'xp',
              description: 'How much xp does the party receive?',
              required: true,
            },
            {
              type: 5,
              name: 'randomitem',
              description: 'Should an item be generated?',
              required: true,
            },
            {
              type: 4,
              name: currency,
              description: 'How much (if any) '+currency+' per player?',
              required: false,
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
                {
                  type: 4,
                  name: 'level',
                  description: "Your character's level",
                  required: true,
                  choices: commandCreator.createLevelChoices(),
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
                  choices: await commandCreator.createCommandChoices(db).then(),
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
              choices: await commandCreator.createCommandChoices(db).then(),
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
              choices: commandCreator.createLevelChoices(),
            },
          ],
        },
        {
          type: 1,
          name: 'downtimehistory',
          description: "List all downtimes your character did",
          options: [
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

    return [WESTMARCH_COMMANDS, commandCreator.EXPLAIN_ME_COMMAND, commandCreator.ITEM_RANGE_COMMAND, commandCreator.ITEM_TIER_COMMAND];
  }
}