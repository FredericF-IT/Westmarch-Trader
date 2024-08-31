import sqlite3 from 'sqlite3';
import { readDataFile } from './dataIO.js';
import { db2 } from '../app.js';

/**
 * 
 * @param {string} downtimeTableName 
 * @param {number} level 
 * @param {number} roll 
 * @return {string}
 */
export function getDowntimeQuery(downtimeTableName, level, roll) {
  return "SELECT outcome, description " +
  `FROM ${downtimeTableName} ` +
  `INNER JOIN ${downtimeTableName}_events ON roll_group=${downtimeTableName}_events.eventID ` +
  `WHERE roll_group=${roll} AND level=${level};`;
}

export function get25ItemNamesQuery(currentInput) {
  return `SELECT item_name, id FROM item_cost WHERE item_name LIKE '%${currentInput}%' LIMIT 25;`;
}

export function getItem(itemID){
  return `SELECT * FROM item_cost WHERE id=${itemID} LIMIT 1;`;
}

/**
 * @param {number} lowestPrice 
 * @param {number} highestPrice 
 * @return {string}
 */
export function filterItems(lowestPrice, highestPrice) {
  return `SELECT * FROM item_cost WHERE ${lowestPrice}<=price AND price<=${highestPrice} ORDER BY price ASC;`;
}

/**
 * @param {number} priceTier 
 * @return {string}
 */
export function filterItemsbyTier(priceTier) {
  return `SELECT * FROM item_cost WHERE ${priceTier}=price_tier ORDER BY price ASC;`;
}

/**
 * 
 * @param {sqlite3.Database} db 
 */
export function createDB(db) {
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
    for(let line of codeLines) {
      const lineClean = line.replace("\n", "");
      db.serialize(() => {
        db.run(lineClean, err => {
          if(err != null){
            console.error(err);
          }
          console.log(lineClean);
        });
      });
    }
  }
}

/**
 *
 * @param {string} query
 * @param {(err: Error | null, rows: Object[]) => void} callback
 */
export function sqlite3Query(query, callback) {
  const sql = query;
  db2.all(sql, [], callback);
}

/*
SELECT roll_group, outcome, description
FROM crime_rewards
INNER JOIN crime_rewards_events ON roll_group=crime_rewards_events.eventID
WHERE roll_group=${roll} AND level=$level;
*/