import * as fs from 'fs';
const characterDowntimeProgress = "data/downtimeProgress.json";
const namesCharactersFile = "data/PlayerNames.json";

export function readDataFile(fileName) {
  return fs.readFileSync("./"+fileName).toString('utf-8');
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

export const activeDowntimes = JSON.parse(readDataFile(characterDowntimeProgress));

export const WEEKLY_CATEGORY = "weeklyUsed";
export const CRAFTING_CATEGORY = "crafting";


/**    CHARACTER IO     **/

export const characters = JSON.parse(readDataFile(namesCharactersFile));