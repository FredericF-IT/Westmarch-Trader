import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

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

const ALL_COMMANDS = [BUY_ITEM_COMMAND, SELL_ITEM_COMMAND];
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);