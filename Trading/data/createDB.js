// @ts-check
import sqlite3 from 'sqlite3';
import { readDataFile } from './dataIO.js';
import { tierToCostLimits, tierToFindableRarities } from '../utils.js';
import { updateItems } from '../itemsList.js';
import { createDowntimeSQLs } from '../downtimes.js';

/**
 * @typedef {import("../types.js").item} item
 * @typedef {import("../types.js").dtData} dtData
*/

export class DBIO{
  /** @type {sqlite3.Database} */
  #db;

  /** @type {DBIO} */
  static #dbInstance;
  /** @type {boolean} */
  static #allowInstance;

  constructor(){
    if(!DBIO.#allowInstance)
      throw new Error("Can not create instance. Please use DBIO.getDB()");
  }

  /**
   * Always returns the same instance of the database.
   * @return {DBIO}
   */
  static getDB(){
    // always returns same instance
    this.#allowInstance = true;
    this.#dbInstance = this.#dbInstance || new DBIO();
    this.#allowInstance = false;
    return this.#dbInstance;
  }

  /**
   * @param {string} path 
   */
  init(path) {
    /** @type {sqlite3.Database} */
    this.#db = new sqlite3.Database(path, (err) => {
      if (err) {
        console.error('Failed to connect to the database:', err.message);
      } else {
        console.log('Connected to the trader.db SQLite database.');
      }
      //this.createCharTables();
    });
  }

  close() {
    this.#db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
      process.exit(0);
    });
  }

  /**
   * @param {Object} data 
   * @return {string}
   */
  #stringifySQL(data){
    return JSON.stringify(data).replace(/"/g, "'");
  }

  /**
   * @param {string} data 
   * @return {Object}
   */
  #parseSQL(data){
    return JSON.parse(data.replace(/'/g, '"'));
  }

  /** ITEM I/O **/

  /**
   * @param {string} currentInput 
   * @return {Promise<item[]>}
   */
  async get25ItemNamesQuery(currentInput) {
    return await this.#sqlite3Query(`SELECT item_name, id FROM item_cost WHERE item_name LIKE '%${currentInput}%' LIMIT 25;`).then();
  }

  /**
   * @param {string | number} itemID 
   * @return {Promise<item>}
   */
  async getItem(itemID){
    return (await this.#sqlite3Query(`SELECT * FROM item_cost WHERE id=${itemID} LIMIT 1;`).then())[0];
  }

  /**
   * @param {number} lowestPrice 
   * @param {number} highestPrice 
   * @return {Promise<item[]>}
   */
  async filterItems(lowestPrice, highestPrice) {
    return await this.#sqlite3Query(`SELECT * FROM item_cost WHERE ${lowestPrice}<=price AND price<=${highestPrice} ORDER BY price ASC;`).then();
  }

  /**
   * @param {number} priceTier 
   * @param {boolean} filterRarity 
   * @return {Promise<item[]>}
   */
  async filterItemsbyTier(priceTier, filterRarity) {
    const limits = tierToCostLimits[priceTier];
    return await this.#sqlite3Query(`SELECT * FROM item_cost WHERE ${limits.min}<=price AND price<=${limits.max} ${filterRarity ? `AND rarity IN ("${tierToFindableRarities[priceTier].join('", "')}") ` : ""}ORDER BY price ASC;`).then();
  }

  /** CHARACTER I/O **/

  /**
   * @param {string} userID 
   * @return {Promise<string[]>}
   */
  async getCharacters(userID){
    return (await this.#sqlite3Query(`SELECT character FROM player_characters WHERE discord_id="${userID}";`).then()).map((character) => character.character);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @return {Promise<boolean>}
   */
  async characterExists(userID, characterName){
    const character = await this.#sqlite3Query(`SELECT * FROM player_characters WHERE discord_id="${userID}" AND character="${characterName}" LIMIT 1;`).then();
    return character.length == 1;
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {boolean?} used_downtime 
   */
  insertCharacter(userID, characterName, used_downtime) {
    this.#sqlite3Query(`INSERT INTO player_characters (discord_id, character, used_downtime) VALUES ("${userID}", "${characterName}", ${used_downtime ? "TRUE" : "FALSE"});`);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   */
  deleteCharacter(userID, characterName) {
    this.#sqlite3Query(`DELETE FROM player_characters WHERE discord_id="${userID}" AND character="${characterName}";`);
  }

  /** DOWNTIME I/O **/

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   * @param {dtData} job_data 
   */
  createCharacterJob(userID, characterName, job_id, job_data) {
    const stringData = this.#stringifySQL(job_data);
    this.#sqlite3Query(`INSERT INTO downtime_record (discord_id, character, job_id, job_data) VALUES ("${userID}", "${characterName}", "${job_id}", "${stringData}");`);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   * @return {Promise<dtData>} 
   */
  async getCharacterJob(userID, characterName, job_id) {
    const stringData = await this.#sqlite3Query(`SELECT job_data FROM downtime_record WHERE discord_id="${userID}" AND character="${characterName}" AND job_id="${job_id}" LIMIT 1;`).then();
    return this.#parseSQL(stringData[0].job_data);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   * @param {dtData} job_data 
   */
  updateCharacterJob(userID, characterName, job_id, job_data) {
    this.#sqlite3Query(`UPDATE downtime_record SET job_data="${this.#stringifySQL(job_data)}" WHERE discord_id="${userID}" AND character="${characterName}" AND job_id="${job_id}";`);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   */
  deleteCharacterJob(userID, characterName, job_id) {
    this.#sqlite3Query(`DELETE FROM downtime_record WHERE discord_id="${userID}" AND character="${characterName}" AND job_id="${job_id}";`);
  }

  /**
   * @param {boolean?} used_downtime 
   * @param {string?} condition 
   * @return {void}
   */
  setAllCharactersDowntimeActionUsed(used_downtime, condition) {
    this.#sqlite3Query(`UPDATE player_characters SET used_downtime=${used_downtime ? "TRUE" : "FALSE"}${condition ? " WHERE "+condition : ""};`);
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  * @param {boolean?} used_downtime 
  * @return {void}
  */
  setCharacterDowntimeActionUsed(userID, characterName, used_downtime) {
    this.#sqlite3Query(`UPDATE player_characters SET used_downtime=${used_downtime ? "TRUE" : "FALSE"} WHERE discord_id="${userID}" AND character="${characterName}";`);
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  * @return {Promise<boolean>}
  */
  async getCharacterDowntimeActionUsed(userID, characterName) {
    return 1 === (await this.#sqlite3Query(`SELECT used_downtime FROM player_characters WHERE discord_id="${userID}" AND character="${characterName}" LIMIT 1;`).then())[0].used_downtime;
  }

  /**
   * @typedef {Object} dtResult
   * @property {string} description
   * @property {string} outcome
   */
  /**
   * @param {string} downtimeTableName 
   * @param {number} level 
   * @param {number} roll 
   * @return {Promise<dtResult>}
   */
  async getDowntimeResult(downtimeTableName, level, roll) {
    return (await this.#sqlite3Query("SELECT outcome, description " +
    `FROM ${downtimeTableName} ` +
    `INNER JOIN ${downtimeTableName}_events ON roll_group=${downtimeTableName}_events.eventID ` +
    `WHERE roll_group=${roll} AND level=${level};`).then())[0];
  }

  createCharTables(){
    const tryDropOld = "DROP TABLE IF EXISTS player_characters;"
    
    const createDef = `CREATE TABLE IF NOT EXISTS player_characters (discord_id TEXT NOT NULL, character TEXT NOT NULL, used_downtime INTEGER NOT NULL, PRIMARY KEY (discord_id, character));`;
    
    const tryDropOldDT = "DROP TABLE IF EXISTS downtime_record;"
    
    const createDefDT = `CREATE TABLE IF NOT EXISTS downtime_record (discord_id TEXT NOT NULL, character TEXT NOT NULL, job_id TEXT NOT NULL, job_data TEXT NOT NULL, PRIMARY KEY (discord_id, character, job_id));`;

    return [tryDropOld, createDef, tryDropOldDT, createDefDT];
  }

  async createDB() {
    await updateItems().then();
    createDowntimeSQLs();
    // These files were created above.
    // Now they will be ised to create Tables in our database.
    const files = [
      "./data/crime_rewards_events.sql",
      "./data/crime_rewards.sql",
      "./data/job_rewards_events.sql",
      "./data/job_rewards.sql",
      "./data/training_rewards_events.sql",
      "./data/training_rewards.sql",
      "./data/insertItems2.sql"
    ];
    for(let file of files) {
      const codeLines = readDataFile(file).split(";");
      const cleanLines = codeLines.map(line => line.replace("\n", ""));

      this.#db.serialize(() => {
        for(let lineClean of cleanLines) {
          this.#db.run(lineClean, err => {
            if(err != null){
              console.error(err);
            }
          });
        }
      });
    }
  }

  /**
   * @param {string} query
   * @return {Promise<Object[]>}
   */
  async #sqlite3Query(query) {
    const sql = query;
    const db = this.#db;
    return await new Promise(function (resolve, reject) {
      db.all(sql, [], (/** @type {Error | null} */ err, /** @type {Object[]} */ rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}