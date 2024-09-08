import * as fs from 'fs';

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