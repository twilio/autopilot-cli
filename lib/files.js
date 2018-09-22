const fs = require('fs');
const path = require('path');
const prettyJSONStringify = require('pretty-json-stringify');

module.exports = {
  getCurrentDirectoryBase : () => {
    return path.basename(process.cwd());
  },

  directoryExists : (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  fileExists : (filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  createAssistantJSONFile : async (filename) => {
    try{
      if(fs.existsSync(path.join(process.cwd(),`${filename}.json`))){
        filename = `${filename}-${Date.now()}.json`;
        await fs.writeFileSync(path.join(process.cwd(),filename));
        return filename;
      }else{
        await fs.writeFileSync(path.join(process.cwd(),`${filename}.json`),{});
        return `${filename}.json`;
      }
    } catch (err){
      return err;
    }
  },

  writeAssistantJSONFile : async(data,filename) => {
    return fs.writeFileSync(path.join(process.cwd(),filename),prettyJSONStringify(data));
  }

};