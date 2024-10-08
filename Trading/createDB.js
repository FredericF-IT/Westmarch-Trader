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
    this.#db = new sqlite3.Database(path, (err) => {
      if (err) {
        console.error('Failed to connect to the database:', err.message);
      } else {
        console.log('Connected to the trader.db SQLite database.');
        this.dbLoadedEmitter.notify();
      }
      //this.createCharTables();
      this.#createMissingLists();
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
    return (await this.#sqlite3Query("SELECT name FROM downtimes;").then()).map(data => data.name);
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
    return ((await this.#sqlite3Query("SELECT id, name FROM downtimes;").then()).map(data => {
      return {name: data.name, id: data.id-1};
    }));
  }

  /**
   * @return {Promise<string[]>}
   */
  async getDowntimeNameToTableName() {
    const data = await this.#sqlite3Query("SELECT id, dbTableName FROM downtimes;").then();
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
    return character.length >= 1;
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {boolean?} used_downtime 
   */
  insertCharacter(userID, characterName, used_downtime) {
    this.#sqlite3Query(`INSERT INTO player_characters (discord_id, character, used_downtime) VALUES ("${userID}", "${characterName}", ${used_downtime ? "TRUE" : "FALSE"});`);
    this.#createDowntimeList(userID, characterName);
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
  * @throws {CharacterNotFoundError} Will throw error if character is not in db
  * @param {string} userID 
  * @param {string} characterName 
  * @return {Promise<boolean>}
  */
  async getCharacterDowntimeActionUsed(userID, characterName) {
    const charDT = (await this.#sqlite3Query(`SELECT used_downtime FROM player_characters WHERE discord_id="${userID}" AND character="${characterName}" LIMIT 1;`).then());
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
    `WHERE roll_group=${roll} AND level=${level};`).then())[0];
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  */
  #downtimeListName(userID, characterName) {
    return characterName.replace(/ /g, "").toLowerCase()+"_"+userID+"_dt";
  }

  async #createMissingLists() {
    /** @type {{discord_id: string, character: string}[]} */
    const chars = await this.#sqlite3Query("SELECT discord_id, character FROM player_characters;");
    chars.forEach((char) => {
      console.log(char);
      this.#createDowntimeList(char.discord_id, char.character);
    });
  }

  /**
  * @param {string} userID 
  * @param {string} characterName 
  */
  #createDowntimeList(userID, characterName) {
    const createDef = `CREATE TABLE IF NOT EXISTS ${this.#downtimeListName(userID, characterName)} (downtime_id INTEGER PRIMARY KEY AUTOINCREMENT, summary TEXT NOT NULL);`;
    console.log(createDef);
    this.#sqlite3Query(createDef);
  }

  /**
   * @param {string} userID 
   * @param {string} characterName 
   * @param {string} summary 
   */
  insertDowntimeResult(userID, characterName, summary) {
    this.#sqlite3Query(`INSERT INTO ${this.#downtimeListName(userID, characterName)} (summary) VALUES ("${summary}");`);
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
    return await this.#sqlite3Query(`SELECT summary FROM ${this.#downtimeListName(userID, characterName)};`).then();
  }

  createCharTables(){
    const tryDropOld = "DROP TABLE IF EXISTS player_characters;"
    
    const createDef = `CREATE TABLE IF NOT EXISTS player_characters (discord_id TEXT NOT NULL, character TEXT NOT NULL, used_downtime INTEGER NOT NULL, PRIMARY KEY (discord_id, character));`;
    
    const tryDropOldDT = "DROP TABLE IF EXISTS downtime_record;"
    
    const createDefDT = `CREATE TABLE IF NOT EXISTS downtime_record (discord_id TEXT NOT NULL, character TEXT NOT NULL, job_id TEXT NOT NULL, job_data TEXT NOT NULL, PRIMARY KEY (discord_id, character, job_id));`;

    return [tryDropOld, createDef, tryDropOldDT, createDefDT];
  }

  // needs input file
  /**createDowntimeSQLs() {
    for(let jsTableName of Object.keys(downtimeTables)) {
      const sqlTableName = jsNameToTableName.get(jsTableName);
      const baseString = "-- SQLite;\n" +
      `DROP TABLE IF EXISTS ${sqlTableName};\n` +
      `CREATE TABLE ${sqlTableName} (` +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "level INTEGER NOT NULL," +
        "roll_group INTEGER NOT NULL," +
        "outcome TEXT NOT NULL" +
      ");\n\n" +
      "-- Insert the data;\n";
  
      const baseStringEvents = "-- SQLite;\n" +
      `DROP TABLE IF EXISTS ${sqlTableName}_events;\n` + 
      `CREATE TABLE ${sqlTableName}_events (` +
        "eventID int NOT NULL, " +
        "description TEXT NOT NULL" +
      ");\n\n" +
      "-- Insert the data;\n";
  
      let resultMain = baseString;
      let resultEvents = baseStringEvents;
  
      const data = downtimeTables[jsTableName].table;
      for (let rollGroup = 0; rollGroup < data[0].length; rollGroup++) {
        const event = data[0][rollGroup];
        resultEvents += `INSERT INTO ${sqlTableName}_events (eventID, description) VALUES (` +
          rollGroup + ', "' + event +'");\n';
        for (let level = 1; level < data.length; level++) {
          const effect = data[level][rollGroup];
          const entry = `INSERT INTO ${sqlTableName} (level, roll_group, outcome) VALUES (`+
            (level + 1) + ", " +
            rollGroup + ', "' +
            effect + '");\n';
  
          resultMain += entry;
        }
      }
      
      writeDataFileRequest(`./data/${sqlTableName}.sql`, resultMain);
      writeDataFileRequest(`./data/${sqlTableName}_events.sql`, resultEvents);
    }
  }*/

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