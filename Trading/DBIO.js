// @ts-check
import sqlite3 from 'sqlite3';
import { readDataFile } from './data/dataIO.js';
import { errorResponse, tierToCostLimits, tierToFindableRarities } from './utils.js';
import { updateItems } from './itemsList.js';
import { EventEmitter, EventListener } from './Events.js';

/**
 * @typedef {import("./types.js").item} item
 * @typedef {import("./types.js").dtData} dtData
 * @typedef {import("./types.js").responseObject} responseObject
*/

class DBLoadedEventEmitter extends EventEmitter {
  notify(){super.notify(null);}
}

export class DBLoadedListener extends EventListener{
  /** @param {(args: Date) => void} func */
  constructor(func) { super(func); }
}

export class CharacterNotFoundError extends Error{
  /**
   * @param {string} userID 
   * @param {string} characterName 
   */
  constructor(userID, characterName){
    super();
    this.characterName = characterName;
    this.name = "CharacterNotFoundError";
    this.message = "User "+userID+" has unregistered character and tried using it again. Check for downtime resetting by unregistering.";
  }

  /**
   * @return {responseObject}
   */
  getErrorResponse(){
    return errorResponse("Character is not in database. Please register them again to continue.\n\`\`\`/westmarch character register name:"+this.characterName+"\`\`\`");
  }
}

/**
 * @typedef {Object} databaseTypes
 * @property {player[]} player_characters
 */

/** 
 * @typedef {Object} player 
 * @property {string} discord_id
 * @property {string} character
 * @property {number} used_downtime represents boolean
 * @property {number} character_id
 */ 

export class DBIO{
  /** @type {sqlite3.Database} */
  #db;

  /** @type {DBIO | null} */
  static #dbInstance = null;
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

  dbLoadedEmitter = new DBLoadedEventEmitter();

  /** @param {DBLoadedListener} listener */
  registerDBLoadedListener(listener){
    this.dbLoadedEmitter.registerListener(listener);
  }

  /**
   * @param {string} path 
   */
  init(path) {
    /** @type {sqlite3.Database} */
    this.#db = new sqlite3.Database(path, async (err) => {
      if (err) {
        console.error('Failed to connect to the database:', err.message);
      } else {
        console.log('Connected to the trader.db SQLite database.');
        await this.updateTables().then();
        this.dbLoadedEmitter.notify();
      }
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

  /**
   * @return {Promise<string[]>}
   */
  async getDowntimeNames(){
    return (await this.#sqlite3Query("SELECT name FROM downtimes;", []).then()).map(data => data.name);
  }

  /**
   * @typedef {Object} downtimeData
   * @property {string} name
   * @property {number} id
   */
  /**
   * @return {Promise<downtimeData[]>}
   */
  async getDowntimes() {
    return ((await this.#sqlite3Query("SELECT id, name FROM downtimes;", []).then()).map(data => {
      return {name: data.name, id: data.id-1};
    }));
  }

  /**
   * @return {Promise<string[]>}
   */
  async getDowntimeNameToTableName() {
    const data = await this.#sqlite3Query("SELECT id, dbTableName FROM downtimes;", []).then();
    /** @type {string[]} */
    const mapper = [];
    for (const activity of data) {
      mapper[activity.id - 1] = activity.dbTableName;
    }
    return mapper;
  }

  /** ITEM I/O **/

  /**
   * @param {string} currentInput 
   * @return {Promise<item[]>}
   */
  async get25ItemNamesQuery(currentInput) {
    return await this.#sqlite3Query(`SELECT item_name, id FROM item_cost WHERE item_name LIKE ? LIMIT 25;`, ["%"+currentInput+"%"]).then();
  }

  /**
   * @param {string | number} itemID 
   * @return {Promise<item>}
   */
  async getItem(itemID){
    return (await this.#sqlite3Query("SELECT * FROM item_cost WHERE id=? LIMIT 1;", [itemID]).then())[0];
  }

  /**
   * @param {number} lowestPrice 
   * @param {number} highestPrice 
   * @return {Promise<item[]>}
   */
  async filterItems(lowestPrice, highestPrice) {
    return await this.#sqlite3Query("SELECT * FROM item_cost WHERE ?<=price AND price<=? ORDER BY price ASC;", [lowestPrice, highestPrice]).then();
  }

  /**
   * @param {number} priceTier 
   * @param {boolean} filterRarity 
   * @return {Promise<item[]>}
   */
  async filterItemsbyTier(priceTier, filterRarity) {
    const limits = tierToCostLimits[priceTier];
    return await this.#sqlite3Query("SELECT * FROM item_cost WHERE ?<=price AND price<=? " + (filterRarity ? `AND rarity IN ("${tierToFindableRarities[priceTier].join('", "')}") ` : "") + "ORDER BY price ASC;", [limits.min, limits.max]).then();
  }

  /** CHARACTER I/O **/

  /**
   * @param {string} userID 
   * @return {Promise<string[]>}
   */
  async getCharacters(userID){
    return (await this.#sqlite3Query("SELECT character FROM player_characters WHERE discord_id=?;", [userID]).then()).map((character) => character.character);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @return {Promise<boolean>}
   */
  async characterExists(userID, characterName){
    const character = await this.#sqlite3Query("SELECT * FROM player_characters WHERE discord_id=? AND character=? LIMIT 1;", [userID, characterName]).then();
    return character.length >= 1;
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {boolean?} used_downtime 
   */
  insertCharacter(userID, characterName, used_downtime) {
    this.#db.serialize(async () => {
      await this.#sqlite3Query("INSERT INTO player_characters (discord_id, character, used_downtime) VALUES (?, ?, ?);", [userID, characterName, used_downtime ? 1 : 0]).then();
      this.#createDowntimeList(userID, characterName);
    });
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   */
  deleteCharacter(userID, characterName) {
    // TODO
    this.#db.serialize(() => {
      this.#deleteDowntimeList(userID, characterName);
      this.#sqlite3Query("DELETE FROM player_characters WHERE discord_id=? AND character=?;", [userID, characterName]);
    });
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
    this.#sqlite3Query("INSERT INTO downtime_record (discord_id, character, job_id, job_data) VALUES (?, ?, ?, ?);", [userID, characterName, job_id, stringData]);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   * @return {Promise<dtData>} 
   */
  async getCharacterJob(userID, characterName, job_id) {
    const stringData = await this.#sqlite3Query("SELECT job_data FROM downtime_record WHERE discord_id=? AND character=? AND job_id=? LIMIT 1;", [userID, characterName, job_id]).then();
    return this.#parseSQL(stringData[0].job_data);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   * @param {dtData} job_data 
   */
  updateCharacterJob(userID, characterName, job_id, job_data) {
    this.#sqlite3Query("UPDATE downtime_record SET job_data=? WHERE discord_id=? AND character=? AND job_id=?;", [this.#stringifySQL(job_data), userID, characterName, job_id]);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} job_id 
   */
  deleteCharacterJob(userID, characterName, job_id) {
    this.#sqlite3Query("DELETE FROM downtime_record WHERE discord_id=? AND character=? AND job_id=?;", [userID, characterName, job_id]);
  }

  /**
   * @param {boolean?} used_downtime 
   * @param {string?} condition 
   * @return {void}
   */
  setAllCharactersDowntimeActionUsed(used_downtime, condition) {
    this.#sqlite3QueryUnparamtered(`UPDATE player_characters SET used_downtime=${used_downtime ? 1 : 0}${condition ? " WHERE "+condition : ""};`, []);
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  * @param {boolean?} used_downtime 
  * @return {void}
  */
  setCharacterDowntimeActionUsed(userID, characterName, used_downtime) {
    this.#sqlite3Query(`UPDATE player_characters SET used_downtime=${used_downtime ? 1 : 0} WHERE discord_id=? AND character=?";`, [userID, characterName]);
  }

  /**
  * @throws {CharacterNotFoundError} Will throw error if character is not in db
  * @param {string} userID 
  * @param {string} characterName 
  * @return {Promise<boolean>}
  */
  async getCharacterDowntimeActionUsed(userID, characterName) {
    const charDT = (await this.#sqlite3Query("SELECT used_downtime FROM player_characters WHERE discord_id=? AND character=? LIMIT 1;", [userID, characterName]).then());
    if(charDT.length == 0)
      throw new CharacterNotFoundError(userID, characterName);
    return 1 === charDT[0].used_downtime;
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
    `WHERE roll_group=? AND level=?;`, [roll, level]).then())[0];
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  * @return {Promise<string>}
  */
  async #getCharacterID(userID, characterName) {
    const result = await this.#sqlite3Query("SELECT character_id FROM player_characters WHERE discord_id=? AND character=? LIMIT 1;", [userID, characterName]).then();
    console.log(result);
    return result[0].character_id;
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  * @return {Promise<string>}
  */
  async #downtimeListName(userID, characterName) {
    const char_id = await this.#getCharacterID(userID, characterName).then();
    console.log(char_id);
    return "dt_history_" + char_id;
  }

  async #createMissingLists() {
    /** @type {{discord_id: string, character: string}[]} */
    const chars = await this.#sqlite3Query("SELECT discord_id, character FROM player_characters;", []);
    chars.forEach((char) => {
      this.#createDowntimeList(char.discord_id, char.character);
    });
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  */
  async #createDowntimeList(userID, characterName) {
    const createDef = `CREATE TABLE IF NOT EXISTS ${await this.#downtimeListName(userID, characterName).then()} (downtime_id INTEGER PRIMARY KEY AUTOINCREMENT, summary TEXT NOT NULL);`;
    this.#sqlite3QueryUnparamtered(createDef, []);
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  */
  async #deleteDowntimeList(userID, characterName) {
    const createDef = `DROP TABLE IF EXISTS ${await this.#downtimeListName(userID, characterName).then()};`;
    this.#sqlite3QueryUnparamtered(createDef, []);
  }

  /**
   * @param {string} userID
   * @param {string} characterName 
   * @param {string} summary 
   */
  async insertDowntimeResult(userID, characterName, summary) {
    this.#sqlite3QueryUnparamtered(`INSERT INTO ${await this.#downtimeListName(userID, characterName).then()} (summary) VALUES (?);`, [summary]);
  }

  /**
   * @typedef {Object} dtListEntry
   * @property {string} summary
   */
  /**
   * @param {string} userID 
   * @param {string} characterName
   * @returns {Promise<dtListEntry[]>}
   */
  async getDowntimeList(userID, characterName) {
    return await this.#sqlite3QueryUnparamtered(`SELECT summary FROM ${await this.#downtimeListName(userID, characterName).then()};`, []).then();
  }

  createCharTables(){
    const tryDropOld = "DROP TABLE IF EXISTS player_characters;"
    
    const createDef = `CREATE TABLE IF NOT EXISTS player_characters (character_id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT NOT NULL, character TEXT NOT NULL, used_downtime INTEGER NOT NULL, UNIQUE (discord_id, character));`;
    
    const tryDropOldDT = "DROP TABLE IF EXISTS downtime_record;"
    
    const createDefDT = `CREATE TABLE IF NOT EXISTS downtime_record (character_id INTEGER PRIMARY KEY, job_id TEXT NOT NULL UNIQUE, job_data TEXT NOT NULL);`;

    return [tryDropOld, createDef, tryDropOldDT, createDefDT];
  }

  async updateTables() {

    /** @type {Map<string, player>} */
    const oldTables = new Map();
    
    const tryDropOld = "DROP TABLE IF EXISTS player_characters;"
    const createDef = `CREATE TABLE IF NOT EXISTS player_characters (character_id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT NOT NULL, character TEXT NOT NULL, used_downtime INTEGER NOT NULL, UNIQUE (discord_id, character));`;
    
    const tryDropOldDT = "DROP TABLE IF EXISTS downtime_record;"
    const createDefDT = `CREATE TABLE IF NOT EXISTS downtime_record (character_id INTEGER PRIMARY KEY, job_id TEXT NOT NULL UNIQUE, job_data TEXT NOT NULL);`;

    let lines = [tryDropOld, createDef, tryDropOldDT, createDefDT];

    /** @type {player[]} */
    const oldData = await this.#sqlite3Query("SELECT * FROM player_characters;", []).then();
    console.log(oldData);

    let i = 1;
    oldData.forEach((player) => {
      lines.push(`INSERT INTO player_characters (character_id, discord_id, character, used_downtime) VALUES (${i}, "${player.discord_id}", "${player.character}", ${player.used_downtime});`);  

      const oldTableName = player.character.replace(/ /g, "").toLowerCase()+"_"+player.discord_id+"_dt";
      lines.push(`ALTER TABLE ${oldTableName} RENAME TO ${"dt_history_"+i};`);
      oldTables.set(oldTableName, player);
      i++;
    });
    console.log(lines);

    this.#db.serialize(() => {
      for(let line of lines) {
        console.log(line);
        this.#db.run(line, err => {
          if(err != null){
            console.error(err);
          } else {
            console.log("success");
          }
        });
      }
    });
  }

  async createDB() {
    await updateItems().then();
    //this.createDowntimeSQLs();
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

  /** @type {Map<String, sqlite3.Statement>} */
  #Statements = new Map();

  /**
   * @param {string} query
   * @param {Object[]} args 
   * @return {Promise<Object[]>}
   */
  async #sqlite3Query(query, args) {
    let statement = this.#Statements.get(query);
    if(statement == undefined) {
      statement = this.#db.prepare(query);
      this.#Statements.set(query, statement);
    }
    
    return await new Promise(function (resolve, reject) {
      statement.all(args, (/** @type {Error | null} */ err, /** @type {Object[]} */ rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Only used when the query cannot be fully parametered (contains variable table or coloumn names etc)
   * @param {string} query
   * @param {Object[]} args 
   * @return {Promise<Object[]>}
   */
  async #sqlite3QueryUnparamtered(query, args) {
    const statement = this.#db.prepare(query);

    return await new Promise(function (resolve, reject) {
      statement.all(args, (/** @type {Error | null} */ err, /** @type {Object[]} */ rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}