

const {unzip} = require('zip-unzip-promise'),
      path = require('path'),
      fs = require('fs-extra'),
      files = require('../files');

const importAssistant = async (importSchemaPath, assistant_name) => {

    const importer = require('./import-lib');

    if (!fs.existsSync(importSchemaPath)) {
        throw new Error(`The file ${importSchemaPath} was not be found.`)
    }

    let sampleAssistant = {
        "friendlyName": "",
        "logQueries": true,
        "uniqueName": "",
        "defaults": {},
        "styleSheet": {},
        "fieldTypes": [],
        "tasks": []
      };

    return await Promise.resolve()

    .then( async () => {

        const dir = path.basename(importSchemaPath),
              folder = dir.substr(0,dir.indexOf('.'));

        const dirPath = await unzip(importSchemaPath, path.resolve(process.cwd(),folder));

        return dirPath;
    })

    .then( async (extractedDir) => {

        // read entities and intents directory
        let entitiesFiles = [], intentsFiles = [];

        if(fs.existsSync(path.resolve(extractedDir, 'entities')))
            entitiesFiles = await fs.readdirSync(path.resolve(extractedDir, 'entities'));
        if(fs.existsSync(path.resolve(extractedDir, 'intents')))
            intentsFiles = await fs.readdirSync(path.resolve(extractedDir, 'intents'));

        // getting Field Types
        const fieldTypes = await importer.FieldTypes(entitiesFiles, path.resolve(extractedDir, 'entities'));

        // getting Tasks, assistant initiation and fallback
        const tasksObj = await importer.Tasks(intentsFiles, path.resolve(extractedDir, 'intents'));


        sampleAssistant.uniqueName = assistant_name.replace(/\'|-|\s|,/g," ").replace(/\s+/g,' ').trim().replace(/\s/g,"-");
        sampleAssistant.friendlyName = assistant_name.replace(/\'|-|\s|,/g," ").replace(/\s+/g,' ').trim().replace(/\s/g,"-");
        sampleAssistant.fieldTypes = fieldTypes;
        sampleAssistant.tasks = tasksObj.tasks;

        if(tasksObj.assistant_initiation)
        {
            if(sampleAssistant.defaults.hasOwnProperty('defaults')){
                sampleAssistant.defaults.defaults.assistant_initiation = `task://${tasksObj.assistant_initiation}`;
            }
            else{
                sampleAssistant.defaults = {
                    "defaults" : {
                        "assistant_initiation" : `task://${tasksObj.assistant_initiation}`
                    }
                }
            }
        }
        if(tasksObj.fallback)
        {
            if(sampleAssistant.defaults.hasOwnProperty('defaults')){
                sampleAssistant.defaults.defaults.fallback = `task://${tasksObj.fallback}`;
                sampleAssistant.defaults.defaults.collect = {
                    "validate_on_failure" : `task://${tasksObj.fallback}`
                };
            }
            else{
                sampleAssistant.defaults = {
                    "defaults" : {
                        "fallback" : `task://${tasksObj.fallback}`,
                        "collect" : {
                            "validate_on_failure" : `task://${tasksObj.fallback}`
                        }
                    }
                }
            }
            
        }

        const filename = await files.createAssistantJSONFile(sampleAssistant.uniqueName, false);

        await files.writeAssistantJSONFile(sampleAssistant, filename, false);

        await fs.removeSync(extractedDir);
        //assistant.filename = filename;
        return filename;
    })

    .catch( (err) => {
        throw err;
    })
}

module.exports = {importAssistant};