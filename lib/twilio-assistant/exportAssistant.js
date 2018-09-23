const client = require('./client');
const files = require('../files');
const _ = require('lodash');
const request = require('request');

const exportAssistant = function (assistantIdentifier, filename) {
  let sampleAssistant = {
    "sid" : "",
    "friendlyName": "",
    "logQueries": true,
    "uniqueName": "",
    "types": [],
    "intents": []
  };

  // get all assistants
  client.preview.understand
    .assistants
    .each(async (assistant,cb)=> {
      if(assistant.uniqueName == assistantIdentifier || assistant.sid == assistantIdentifier){

        // resolve assistant
        return Promise.resolve(assistant)
        .then(async (assistant) => {

          // get field types
          await client.preview.understand
                .assistants(assistant.sid)
                .fieldTypes
                .each(async (fieldType) => {
                  sampleAssistant.sid = assistant.sid;
                  sampleAssistant.friendlyName = assistant.friendlyName;
                  sampleAssistant.uniqueName = assistant.uniqueName;
                  sampleAssistant.types.push({
                    "sid" : fieldType.sid,
                    "uniqueName" : fieldType.uniqueName,
                    "values" : []
                  });

                  // write json with assistant uniqueName, etc and field types
                  await files.writeAssistantJSONFile(sampleAssistant,filename);

                  // get fieldValues of a field type
                  await client.preview.understand
                    .assistants(assistant.sid)
                    .fieldTypes(fieldType.sid)
                    .fieldValues
                    .each(async (fieldValue) => {
                      const index = await _.findIndex(sampleAssistant.types,{uniqueName:fieldType.uniqueName});
                      sampleAssistant.types[index].values.push({
                        "sid" : fieldValue.sid,
                        "language" : fieldValue.language,
                        "value" : fieldValue.value,
                        "synonymOf" : fieldValue.synonymOf
                      })

                      // write field values of a field type
                      await files.writeAssistantJSONFile(sampleAssistant,filename);
                    });
                });
          return assistant;
        })

        .then((assistant) => {

          // get assistant intents
          client.preview.understand
                .assistants(assistant.sid)
                .intents
                .each(async (intent) => {
                  console.log(`${intent.uniqueName} ${intent.sid}`);
                  //console.log(client.preview.understand.assistants(assistantIdentifier).intents(intent.sid).intent_actions);
                  sampleAssistant.intents.push({
                    "sid" : intent.sid,
                    "uniqueName" : intent.uniqueName,
                    "fields" : [],
                    "samples" : []
                  })

                  // write intent
                  await files.writeAssistantJSONFile(sampleAssistant,filename);

                  // get intent samples
                  await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(intent.sid)
                      .samples
                      .each(async (sample) => {
                        const index = await _.findIndex(sampleAssistant.intents,{uniqueName:intent.uniqueName});
                        sampleAssistant.intents[index].samples.push({
                          "sid" : sample.sid,
                          "language" : sample.language,
                          "taggedText" : sample.taggedText
                        });

                        // write intent samples
                        await files.writeAssistantJSONFile(sampleAssistant,filename);
                      });
                  
                  // get intent fields
                  await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(intent.sid)
                      .fields
                      .each(async (field) => {
                        const index = await _.findIndex(sampleAssistant.intents,{uniqueName:intent.uniqueName});
                        sampleAssistant.intents[index].fields.push({
                          "sid" : field.sid,
                          "uniqueName" : field.uniqueName,
                          "fieldType" : field.fieldType
                        })

                        // write intent fields
                        await files.writeAssistantJSONFile(sampleAssistant,filename);
                      });
                })
          return assistant;
        })
      
        .catch((error) =>{
          console.log(error);
        })
      }
    });
}

module.exports = {exportAssistant};