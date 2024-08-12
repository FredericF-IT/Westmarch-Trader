import { writeDataFile, readDataFile, mapToString, parseMap } from './data/dataIO.js';
import {
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { namesCharactersFile, characterDowntimeProgress } from "./data/fileNames.js";

export function setValueCharacter(userID, characterName, category, job, name, value) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
      
  activeItemBuilds[userID][characterName][category][job][name] = value;
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

export function getValueCharacter(userID, characterName, category, job, name) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
  return activeItemBuilds[userID][characterName][category][job][name];
}

export function finishJob(userID, characterName, category, job) {
  const activeItemBuilds = JSON.parse(readDataFile(characterDowntimeProgress));
     
  delete activeItemBuilds[userID][characterName][category][job];
  
  const output = JSON.stringify(activeItemBuilds, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

export function characterExisits(userID, characterName) {
  const userCharacters = JSON.parse(readDataFile(namesCharactersFile))[userID];
  
  return userCharacters != undefined && userCharacters.includes(characterName);
}

const rareSeperator = "$.$=$";

export function requestCharacterRegistration(type, characterName, data) {
  return {
    ephemeral: true,
    content: `${characterName} has not been registered.\n` +
      "Would you like to do so and continue with the command?",
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
              type: MessageComponentTypes.BUTTON,
              custom_id: rareSeperator + `_${type}_${characterName}_${data.join("_")}`,
              label: "Register & continue",
              style: ButtonStyleTypes.PRIMARY,
          },
        ],
      },
    ],
  };
}

export function getDX(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

import { getSanesItemPrices } from './itemsList.js';
import { escapeHeading } from 'discord.js';
const allItems = getSanesItemPrices();

export function filterItems(gpReceived, gpMinimumCost) {
  return allItems.filter(function(element) {
      return element[1].price <= gpReceived && element[1].price >= gpMinimumCost;
  });
}