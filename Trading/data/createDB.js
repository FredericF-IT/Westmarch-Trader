import sqlite3 from 'sqlite3';
import { readDataFile } from './dataIO.js';

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
    "./data/training_rewards.sql"
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
        });
      });
    }
  }
}

/*
SELECT roll_group, outcome, description
FROM crime_rewards
INNER JOIN crime_rewards_events ON roll_group=crime_rewards_events.eventID
WHERE roll_group=${roll} AND level=$level;
*/