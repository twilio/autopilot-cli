const config = require('../config.js');
const twilio = require('twilio');
const fs = require('fs');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

const tag = function () { };

// returns a promise that resolves to true if a file exists
tag.prototype.fileExists = function(filepath){
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, error => {
      resolve(!error);
    });
  });
}

tag.prototype.createAssistantFully = function (schemaFile) {
  
  if (this.fileExists(schemaFile) === false) return Promise.reject("File does not exist");

  const schema = require(schemaFile);

  return Promise.resolve()
    .then(() => {
      //create new assistant
      return client.preview.understand
        .assistants
        .create({
          friendlyName: schema.uniqueName,
          uniqueName: schema.uniqueName,
          logQueries: true
        });
    })
    .catch((err) => {
      if (err.message.includes("UniqueName already in use")) {
        return client.preview.understand
          .assistants
          .create({
            friendlyName: `${schema.uniqueName}-${Date.now()}`,
            uniqueName: `${schema.uniqueName}-${Date.now()}`,
            logQueries: true
          });
      }
    })
    .then(async (assistant) => {
      //add intents to assistant
      console.log(`created assistant: ${assistant.uniqueName}`);

      for (let intent of schema.intents) {
        await client.preview.understand
          .assistants(assistant.uniqueName)
          .intents
          .create({ uniqueName: intent.uniqueName, actions: intent.actions })
          .then(result => {
            console.log(`Added intent: ${intent.uniqueName}`);
          })
          .catch(err => {
            console.log(`ERROR: ${err.message}`);
          });
      }

      return assistant;
    })
    .then((assistant) => {
      //add assistant actions
      return client.preview.understand
        .assistants(assistant.sid)
        .update({
          fallbackActions: schema.fallbackActions,
          initiationActions: schema.initiationActions
        });
    })
    .then(async (assistant) => {
      //add custom fields to assistant

      for (let fieldType of schema.fieldTypes) {
        await client.preview.understand
          .assistants(assistant.uniqueName)
          .fieldTypes
          .create({ uniqueName: fieldType.uniqueName })
          .then(result => {
            console.log(`create field type: ${fieldType.uniqueName}`)
          })
          .catch(err => {
            console.log(`ERROR: ${err.message}`)
          });

        for (let value of fieldType.values) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .fieldTypes(fieldType.uniqueName)
            .fieldValues
            .create({ language: value.language, value: value.value, synonymOf: value.synonymOf })
            .then(result => {
              console.log(`create field type value: ${value.value}`)
            })
            .catch(err => {
              console.log(`ERROR: ${err.message}`)
            });
        }
      }

      return assistant;
    })
    .then(async (assistant) => {
      //add fields to intents
      for (let intent of schema.intents) {
        for (let field of intent.fields) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .fields
            .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
            .then(result => {
              console.log(`Added field: ${field.uniqueName} to ${intent.uniqueName} intent`);
            })
            .catch(err => {
              console.log(`ERROR: ${err.message}`)
            });
        }
      }

      return assistant;
    })
    .then(async (assistant) => {
      //add samples
      for (let intent of schema.intents) {
        for (let sample of intent.samples) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .samples
            .create({ language: sample.language, taggedText: sample.taggedText })
            .then(result => {
              console.log(`Added sample: ${sample.taggedText} to ${intent.uniqueName} intent`);
            })
            .catch(err => {
              console.log(`ERROR: ${err.message}`)
            });
        }
      }
      return assistant;
    })
    // .then((assistant) => {
    //   //remove 'hello-world' intent and initial modelBuild
    //   return deleteHelloWorldIntent(assistant);
    // })
    .then((assistant) => {
      //start model build 
      return client.preview.understand
        .assistants(assistant.uniqueName)
        .modelBuilds
        .create({ uniqueName: assistant.uniqueName });
    })
    .catch(err => {
      throw err;
    })
}

tag.prototype.deleteAssistantFully = function (assistantIdentifier) {
  return Promise.resolve()
    .then(() => {
      // get the assistant
      return client.preview.understand
        .assistants(assistantIdentifier);
    })
    .then(assistant => {
      assistant.intents.each((intent) => {
        //remove samples
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(intent.sid)
          .samples
          .each((sample) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(intent.sid)
              .samples(sample.sid)
              .remove()
              .catch((err) => {
                console.log(err.message);
              });
          })

        //remove fields
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(intent.sid)
          .fields
          .each((field) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(intent.sid)
              .fields(field.sid)
              .remove()
              .catch((err) => {
                console.log(err.message);
              });
          })
      });

      return assistant;
    })
    .then(async (assistant) => {
      //remove custom field type values
      await assistant.fieldTypes.each(fieldType => {
        client.preview.understand
          .assistants(assistant._solution.sid)
          .fieldTypes(fieldType.sid)
          .fieldValues
          .each(async fieldValues => {
            await client.preview.understand
              .assistants(assistant._solution.sid)
              .fieldTypes(fieldType.sid)
              .fieldValues(fieldValues.sid)
              .remove()
              .catch((err) => {
                console.log(err.message, 'fieldValues');
                //deleteAssistantFully(assistantIdentifier);
              });
          });
      });

      //remove custom field types
      await assistant.fieldTypes.each(async (fieldType) => {
        await client.preview.understand
          .assistants(assistant._solution.sid)
          .fieldTypes(fieldType.sid)
          .remove()
          .catch((err) => {
            console.log(assistant._solution.sid, fieldType.sid);
            console.log(err.message, 'fieldTypes');
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      return assistant;
    })
    .then(assistant => {
      //remove intents
      assistant.intents.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .remove()
          .catch((err) => {
            console.log(err.message);
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      //remove models
      assistant.modelBuilds.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .modelBuilds(result.sid)
          .remove()
          .catch((err) => {
            console.log(err.message);
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      return assistant;
    })
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })
    .catch(err => {
      console.log(err.message);
      this.deleteAssistantFully(assistantIdentifier);
    })

}

tag.prototype.getAssistants = function () {
  return client.preview.understand
    .assistants;
}

tag.prototype.updateAssistant = function (schemaFile) {

}

tag.prototype.deleteIntent = function (assistantIdentifier, intentIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .remove();
}

module.exports = new tag();
