

const importAlexaAssistant = async (importSchemaPath, redirectURL) => {

    const fs = require('fs-extra'),
          files = require('../files'),
          dataTypes = require('./import-lib/DataTypes.json');

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

        const model = require(importSchemaPath);


        sampleAssistant.friendlyName = model.interactionModel.languageModel.invocationName.trim().replace(/\s/g,"-");
        sampleAssistant.uniqueName = model.interactionModel.languageModel.invocationName.trim().replace(/\s/g,"-");

        //custom slot types
        
        for(let type of model.interactionModel.languageModel.types || []){

            let values = [];

            for(let value of type.values){

                values.push({
                    "language" : "en-US",
                    "value" : value.name.value,
                    "synonymOf" : null
                });

                for(let synonyms of value.name.synonyms || []){

                    values.push({
                        "language" : "en-US",
                        "value" : synonyms,
                        "synonymOf" : value.name.value
                    });
                }
            }

            sampleAssistant.fieldTypes.push({
                "uniqueName" : type.name,
                "values" : values
            });
        }

        return model;
    })

    // picking up tasks and field types
    .then( async (model) => {

        for(let intent of model.interactionModel.languageModel.intents || []){

            let fields = [], samples = [], intentName = intent.name;

            // getting fields
            for(let slot of intent.slots || []){

                let type = slot.type;
                if(slot.type.substring(0,6) === "AMAZON")
                    type = dataTypes.alexa[slot.type] || 'Twilio.FIRST_NAME';

                fields.push({
                    "uniqueName" : slot.name,
                    "fieldType" : type
                });
            }

            //getting samples
            for(let sample of intent.samples || []){

                samples.push({
                    "language" : "en-US",
                    "taggedText" : sample
                });
            }

            if(intent.name.substring(0,6) === "AMAZON"){

                intentName = intent.name.substring(7,intent.name.length);
                for(let sample of dataTypes.built_in_task[intent.name] || []){

                    samples.push({
                        "language" : "en-US",
                        "taggedText" : sample
                    });
                }
            }

            if(intent.name === "AMAZON.FallbackIntent"){

                sampleAssistant.defaults = {
                    "defaults" : {
                        "assistant_initiation" : "",
                        "fallback" : `task://${intentName}`,
                        "collect" : {
                            "validate_on_failure" : `task://${intentName}`
                        }
                    }
                }
            }

            sampleAssistant.tasks.push({
                "uniqueName" : intentName,
                "actions" : {
                    "actions" : [
                        {
                            "redirect": redirectURL
                        }
                    ]
                },
                "fields" : fields,
                "samples" : [...new Set(samples.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
            })
        }

        const filename = await files.createAssistantJSONFile(sampleAssistant.uniqueName, false);

        await files.writeAssistantJSONFile(sampleAssistant, filename, false);
        return filename;
    })

    .catch( (err) => {
        throw err;
    })
}

module.exports = {importAlexaAssistant};