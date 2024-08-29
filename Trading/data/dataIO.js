import * as fs from 'fs';
const characterDowntimeProgress = "data/downtimeProgress.json";
const namesCharactersFile = "data/PlayerNames.json";

/**
 * @typedef {import("discord.js").User} User
 * @typedef {import("./types.js").item} item
 */

export function readDataFile(fileName) {
  return fs.readFileSync("./"+fileName).toString('utf-8');
}

function writeDataFile(fileName, dataString) {
  writeDataFileRequest("./"+fileName, dataString);
}

let writing = 0;
export async function writeDataFileRequest(fileName, dataString) {
  let isWritten = false;
  while(!isWritten) {
    let wasWriting = writing++; // atomic for mutex
    if(wasWriting == 0){
      fs.writeFileSync("./"+fileName, dataString);
      isWritten = true;
    }
    writing--;
  }
}

/**    DOWNTIME I/O     **/

const activeDowntimes = JSON.parse(readDataFile(characterDowntimeProgress));

/**
 * Writes the current downtime DB to file 
 */
function updateDowntimeDB() {
  const output = JSON.stringify(activeDowntimes, null, "\t");
  writeDataFile(characterDowntimeProgress, output);
}

/**
 * 
 * @param {string} userID
 */
export function getUserDowntimes(userID) {
  let userDowntimes = activeDowntimes[userID];
  if (userDowntimes == undefined)
    return {};
  return structuredClone(userDowntimes);
}

/**
 * 
 * @param {string} userID 
 * @param {Object} data 
 */
export function setUserDowntimes(userID, data){
  activeDowntimes[userID] = data;
  updateDowntimeDB();
}

export const WEEKLY_CATEGORY = "weeklyUsed";
export const CRAFTING_CATEGORY = "crafting";

export function useWeeklyAction(userID, characterName){
  let characters = activeDowntimes[userID];
  
  if(characters === undefined) {
    characters = {};
    activeDowntimes[userID] = characters;
  } 
  
  if (characters[characterName] === undefined) {
    activeDowntimes[userID][characterName] = {};
  } 

  activeDowntimes[userID][characterName][WEEKLY_CATEGORY] = true;  
  updateDowntimeDB();
}

export function hasUsedWeeklyDowntime(userID, characterName){
  const characters = activeDowntimes[userID];
  if(characters == undefined) return false;
  const character = characters[characterName];
  if(character == undefined || character[WEEKLY_CATEGORY] == undefined) return false;
  return character[WEEKLY_CATEGORY];
}

export function resetAllWeeklyAction(){
  for(var userID in activeDowntimes) {
    const characters = activeDowntimes[userID];
    for(var characterName in characters){
      activeDowntimes[userID][characterName][WEEKLY_CATEGORY] = false;
    }
  }
  updateDowntimeDB();
}

/**
 * @param {string} userID
 * @param {string} characterName
 * @param {string} category
 * @param {string} job
 * @param {string} name
 * @param {Object} value
 * @return {void}
 */
export function setValueDowntime(userID, characterName, category, job, name, value) {
  activeDowntimes[userID][characterName][category][job][name] = value;
  updateDowntimeDB();
}

/**
 * @param {string} userID
 * @param {string} characterName
 * @param {string} category
 * @param {string} job
 * @param {string} name
 * @return {Object}
 */
export function getValueDowntime(userID, characterName, category, job, name) {
  return activeDowntimes[userID][characterName][category][job][name];
}

/**
 * Deletes the entry of the specific downtime thread
 * @param {string} userID
 * @param {string} characterName
 * @param {string} category
 * @param {string} job
 * @return {void}
 */
export function finishDowntimeActivity(userID, characterName, category, job) {
  delete activeDowntimes[userID][characterName][category][job];
  updateDowntimeDB();
}

/**    CHARACTER IO     **/

const characters = JSON.parse(readDataFile(namesCharactersFile));

/**
 * Writes the current characters DB to file 
 */
function updateCharacterDB() {
  const output = JSON.stringify(characters, null, "\t");
  writeDataFile(namesCharactersFile, output);
}

/**
 * Update a users characters
 * @param {string} userID
 * @param {string[]} newCharacters
 * @return {void}
 */
export function setCharacters(userID, newCharacters) {
  characters[userID] = newCharacters;
  updateCharacterDB();
}

/**
 * Returns copy of users characters
 * @param {User} user
 * @return {string[]}
 */
export function getCharacters(user) {
  let userCharacters = characters[user.id];
  if (userCharacters == undefined)
    return [user.username];
  return userCharacters.slice(0);
}

/**
 * Is the character saved in the users entry?
 * @param {string} userID
 * @param {string} characterName
 * @returns {bool}
 */
export function characterExists(userID, characterName) {
  const userCharacters = characters[userID];

  return userCharacters != undefined && userCharacters.includes(characterName);
}
