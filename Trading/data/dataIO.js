import * as fs from "fs"; // require node.js file system module

export function readDataFile(fileName) {
  return fs.readFileSync("./"+fileName).toString('utf-8');
}

export function writeDataFile(fileName, dataString) {
  fs.writeFileSync("./"+fileName, dataString);
}

export function parseMap(dataString) {
  if(dataString == "") return new Map();
  function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
  return JSON.parse(dataString, reviver);
}

export function mapToString(dataMap) {
  function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: [...value]
      };
    } else {
      return value;
    }
  }
  return JSON.stringify(dataMap, replacer);
}