const client = require('./client');
const files = require('../files');
const _ = require('lodash');
const request = require('request');
const inquirer = require('inquirer');

const exportAssistant = function () {
  client.preview.understand
    .assistants
    .list().then((assistants)=>{
      chooseAssistantFromList(assistants);
    })
    .catch((error)=>{
      console.log(`error in list ${error.message}`);
    }); 
}

function chooseAssistantFromList (assistants){
  let choices = [];
  for(let i = 0 ; i < assistants.length ; i++){
    choices.push(assistants[i].uniqueName);
    if( i === assistants.length-1){
      inquirer.prompt([
          {
              type: 'list',
              name: 'assistantName',
              message: 'Choose your assistant: ',
              choices :choices
          }
      ]).then(async (answer) => {
          let seletedAssistant = answer.assistantName
          console.log(seletedAssistant);
          const filename = await files.createAssistantJSONFile(seletedAssistant);
          const f_index = await _.findIndex(assistants,{uniqueName:seletedAssistant}),
                assistant = assistants[f_index];
          await exportAssistantSchema(assistant,filename);
      })
    }
  }
}

function exportAssistantSchema (assistant,filename){
  let sampleAssistant = {
    "sid" : "",
    "friendlyName": "",
    "logQueries": true,
    "uniqueName": "",
    "fallbackActions" : {},
    "initiationActions" : {},
    "types": [],
    "intents": []
  };

  // get all assistants
  return Promise.resolve()
  .then(async () => {

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

            // get fallback actions
            await client.preview.understand
            .assistants(assistant.sid)
            .assistantFallbackActions
            .get()
            .fetch()
            .then((fallbackActions) => {
              sampleAssistant.fallbackActions = fallbackActions.data;
            })

            // write json with fallback actions
            await files.writeAssistantJSONFile(sampleAssistant,filename);

            // get initiation actions
            await client.preview.understand
            .assistants(assistant.sid)
            .assistantInitiationActions
            .get()
            .fetch()
            .then((initiationActions) => {
              sampleAssistant.initiationActions = initiationActions.data;
            })

            // write json with initiation actions
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
            sampleAssistant.intents.push({
              "sid" : intent.sid,
              "uniqueName" : intent.uniqueName,
              "actions" : {},
              "actions" : [],
              "fields" : [],
              "samples" : []
            })

            // write intent
            await files.writeAssistantJSONFile(sampleAssistant,filename);

            // get intent action
            await client.preview.understand
            .assistants(assistant.sid)
            .intents(intent.sid)
            .intentActions
            .get()
            .fetch()
            .then(async (intentAction) =>{

              const index = await _.findIndex(sampleAssistant.intents,{uniqueName:intent.uniqueName});
              sampleAssistant.intents[index].actions = intentAction.data;
            })

            // write intent action
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

module.exports = {exportAssistant};