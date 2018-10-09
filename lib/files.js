const fs = require('fs');
const path = require('path');
const prettyJSONStringify = require('pretty-json-stringify');
const os   = require('os');
const _    = require('lodash');

const twilioRecoverySchemaDir = path.resolve(os.homedir(),'.twilio/recovery_schema');
const filePath = path.resolve(os.homedir(),'.twilio/recovery_schema','restoreSchema.json');

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

  createAssistantJSONFile : async (filename, recoverSchema = false) => {
    if(recoverSchema){
      if(checkDirectoryExists()){
        await fs.writeFileSync(path.join(twilioRecoverySchemaDir,`backup-${filename}.json`),prettyJSONStringify({}));
        return `backup-${filename}.json`;
      }
    }else{
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
    }
  },

  writeAssistantJSONFile : async(data, filename, recoverSchema = false) => {
    if(recoverSchema){

      const writeData = await fs.writeFileSync(path.join(twilioRecoverySchemaDir,filename),prettyJSONStringify(data));

      let restoreSchemaJSON = await readRecoverSchema();

      if(restoreSchemaJSON.length){
        const f_index = _.findIndex(restoreSchemaJSON,{name : data.uniqueName});

        if(f_index>=0){
          restoreSchemaJSON[f_index] = {
            "name" : data.uniqueName,
            "schema_path" : filename
          }
        }else{
          restoreSchemaJSON.push({
            "name" : data.uniqueName,
            "schema_path" : filename
          })  
        }
      }else{
        restoreSchemaJSON.push({
          "name" : data.uniqueName,
          "schema_path" : filename
        })
      }

      const updateRestoreSchema = await await fs.writeFileSync(filePath,prettyJSONStringify(restoreSchemaJSON));

      return writeData;
    }else{
      return fs.writeFileSync(path.join(process.cwd(),filename),prettyJSONStringify(data));
    }
  },

  removeFile : async(filePath) => {
    try{
      return fs.unlinkSync(filePath);
    }catch(e) {
      console.log(e.message);
      return e;
    }
  }

};

function checkDirectoryExists(){
  if(fs.existsSync(twilioRecoverySchemaDir)){
      return true;
  }else{
      try{
          fs.mkdirSync(twilioRecoverySchemaDir);
          return true
      }catch(e){
          return false;
      }
  }
}

function readRecoverSchema(){
  try {
      let content = require(filePath);
      return content;
  } catch (e) {
      return [];
  }
}
