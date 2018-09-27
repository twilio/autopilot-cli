const client = require('./client');
const files = require('../files');

const ora = require('ora')
const _ = require('lodash');
const request = require('request');
const inquirer = require('inquirer');
const async = require('async');


const exportAssistant = function () {
  const spinner = ora().start(`Getting assistant List...\n`)
  client.preview.understand
    .assistants
    .list().then((assistants)=>{
      chooseAssistantFromList(assistants, spinner);
    })
    .catch((error)=>{
      spinner.stop();
      console.log(`error in list ${error.message}`);
    }); 
}

function chooseAssistantFromList (assistants, spinner){
  let choices = [];
  for(let i = 0 ; i < assistants.length ; i++){
    choices.push(assistants[i].uniqueName);
    if( i === assistants.length-1){

      spinner.stop()
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
          const f_index = await _.findIndex(assistants,{uniqueName:seletedAssistant}),
                assistant = assistants[f_index];
          await exportAssistantSchema(assistant);
      })
    }
  }
}

function exportAssistantSchema (assistant){

  const spinner1 = ora().start('Exporting assistant...')
  async.series({
    fallbackActions : (callback) =>{
      assistantFallbackActions(assistant, spinner1, callback);
    },
    initiationActions : (callback) =>{
      assistantInitiationActions(assistant, spinner1, callback);
    },
    assistantCustomFieldTypes : (callback) =>{
      assistantCustomFieldTypes(assistant, spinner1, callback);
    },
    assistantIntents : (callback) =>{
      assistantIntents(assistant, spinner1, callback);
    }
  }, async (err, result) => {
    if(err){
      console.log(err.message);
      spinner1.stop();
      process.exit(0);
    }
    else{
      let sampleAssistant = {
        "sid" : assistant.sid,
        "friendlyName": assistant.friendlyName,
        "logQueries": assistant.logQueries,
        "uniqueName": assistant.uniqueName,
        "fallbackActions" : result.fallbackActions,
        "initiationActions" : result.initiationActions,
        "fieldTypes": result.assistantCustomFieldTypes,
        "tasks": result.assistantIntents
      };

      const filename = await files.createAssistantJSONFile(assistant.uniqueName);
      await files.writeAssistantJSONFile(sampleAssistant,filename);
      spinner1.stop();
      console.log(`Assistant "${assistant.uniqueName}" was exported in "${filename}" file.`);
    }
  });

}

const assistantFallbackActions = (assistant, spinner1,callback) => {

  spinner1.text ='Exporting assistant FallbackActions...'

  client.preview.understand
    .assistants(assistant.sid)
    .assistantFallbackActions
    .get()
    .fetch()
    .then((fallbackActions) => {
      callback(null,fallbackActions.data);
    })
}

const assistantInitiationActions = (assistant, spinner1,callback) => {

  spinner1.text = 'Exporting assistant InitiationkActions...'

  client.preview.understand
    .assistants(assistant.sid)
    .assistantInitiationActions
    .get()
    .fetch()
    .then((initiationActions) => {
      callback(null,initiationActions.data);
    })
}

const assistantCustomFieldTypes = (assistant, spinner1,callback) => {

  spinner1.text = 'Exporting assistant FieldTypes...'

  let assistantFieldTypes = [];
  client.preview.understand
    .assistants(assistant.sid)
    .fieldTypes
    .list()
    .then((fieldTypes) => {
      
      async.each(fieldTypes,(fieldType,cb) => {
        assistantCustomFieldValues(assistant,fieldType, spinner1, (fieldValues) => {
          assistantFieldTypes.push({
            "sid" : fieldType.sid,
            "uniqueName" : fieldType.uniqueName,
            "values" : fieldValues
          });

          cb();
        })
      }, (err) => {
        callback(null,assistantFieldTypes);
      })
    });
}

const assistantCustomFieldValues = (assistant, fieldType, spinner1, callback) => {

  spinner1.text = 'Exporting assistant FieldValues...'

  let assistantFieldValues = [];
  client.preview.understand
    .assistants(assistant.sid)
    .fieldTypes(fieldType.sid)
    .fieldValues
    .list()
    .then((fieldValues) => {

      async.each(fieldValues,(fieldValue,cb) =>{
        assistantFieldValues.push({
          "sid" : fieldValue.sid,
          "language" : fieldValue.language,
          "value" : fieldValue.value,
          "synonymOf" : fieldValue.synonymOf
        });

        cb();

      },(err) => {
        callback(assistantFieldValues);
      })
    });
}

const assistantIntents = (assistant, spinner1,callback) => {

  spinner1.text = 'Exporting assitant Intents...'

  let assistantIntents = [];

  client.preview.understand
    .assistants(assistant.sid)
    .intents
    .list()
    .then((intents) => {
      async.each(intents, (intent, cb) => {
        async.series({
          assistantIntentActions : (i_cb) => {
            assistantIntentActions(assistant, intent, spinner1, i_cb);
          },
          assistantIntentSamples : (i_cb) => {
            assistantIntentSamples(assistant, intent, spinner1, i_cb);
          },
          assistantIntentfieldTypes : (i_cb) => {
            assistantIntentfieldTypes(assistant, intent, spinner1, i_cb);
          }
        }, (err, result) => {
          if(err){

            console.log(err.message);
            process.exit(0);

          }else{

            assistantIntents.push({
                "sid" : intent.sid,
                "uniqueName" : intent.uniqueName,
                "actions" : result.assistantIntentActions,
                "fields" : result.assistantIntentfieldTypes,
                "samples" : result.assistantIntentSamples
              });

              cb();
          }
        });
      }, (err) => {
          callback(null, assistantIntents);
      })
    })
}

const assistantIntentActions = (assistant, intent, spinner1, callback) => {

  spinner1.text = 'Exporting intent Actions...'
  client.preview.understand
    .assistants(assistant.sid)
    .intents(intent.sid)
    .intentActions
    .get()
    .fetch()
    .then((intentAction) =>{
      callback(null, intentAction.data);
    })
    .catch((error)=>{
      console.log(err.message);
    })
}
const assistantIntentSamples = (assistant,intent, spinner1,callback) => {

  spinner1.text = 'Exporting intent Samples...'

  let intentSamples = [];
  client.preview.understand
    .assistants(assistant.sid)
    .intents(intent.sid)
    .samples
    .list()
    .then((samples) => {
      async.each(samples, (sample, cb) => {

        intentSamples.push({
          "sid" : sample.sid,
          "language" : sample.language,
          "taggedText" : sample.taggedText
        });

        cb();

      }, (err) => {
        callback(null,intentSamples)
      })
    })
}
const assistantIntentfieldTypes = (assistant,intent, spinner1,callback) => {

  spinner1.text = 'Exporting intent FieldTypes...'

  let intentFields = [];
  client.preview.understand
    .assistants(assistant.sid)
    .intents(intent.sid)
    .fields
    .list()
    .then((fields) => {
      async.each(fields, (field, cb) => {

        intentFields.push({
          "sid" : field.sid,
          "uniqueName" : field.uniqueName,
          "fieldType" : field.fieldType
        });

        cb();
      }, (err) => {
        callback(null,intentFields);
      })
    })
}


module.exports = {exportAssistant};