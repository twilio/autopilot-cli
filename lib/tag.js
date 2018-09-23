const config = require('../config.js');
const twilio = require('twilio');
const fs = require('fs');
const files = require('./files');
const _ = require('lodash');
const request = require('request');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

const tag = function () { };

// returns a promise that resolves to true if a file exists
tag.prototype.fileExists = function (filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, error => {
      resolve(!error);
    });
  });
}

tag.prototype.createAssistant = function (assistantName, logQueries = true) {

  let params = {
    friendlyName: assistantName,
    uniqueName: assistantName.replace(' ', '-').toLowerCase(),
    logQueries: logQueries
  }

  return Promise.resolve()
    .then(() => {
      return client.preview.understand
        .assistants
        .create(params);
    })
    .catch((err) => {
      if (err.message.includes("UniqueName already in use")) {
        return client.preview.understand
          .assistants
          .create({
            friendlyName: `${params.friendlyName}`,
            uniqueName: `${params.uniqueName}-${Date.now()}`,
            logQueries: true
          });
      }
    })

}

tag.prototype.createAssistantFully = function (schemaFile) {

  if (this.fileExists(schemaFile) === false) return Promise.reject("File does not exist");

  const schema = require(schemaFile);

  return Promise.resolve()

    //create new assistant
    .then(() => {
      return client.preview.understand
        .assistants
        .create({
          friendlyName: schema.uniqueName,
          uniqueName: schema.uniqueName,
          logQueries: true
        });
    })

    //create a unique name if name exists
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

    //add intents to assistant
    .then(async (assistant) => {

      //console.log(`created assistant: ${assistant.uniqueName}`);

      for (let intent of schema.intents) {
        await client.preview.understand
          .assistants(assistant.uniqueName)
          .intents
          .create({ uniqueName: intent.uniqueName, actions: intent.actions })
          .then(result => {
            //console.log(`Added intent: ${intent.uniqueName}`);
          })
          .catch(err => {
            //console.log(`ERROR: ${err.message}`);
          });
      }

      return assistant;
    })

    //add assistant actions
    .then((assistant) => {
      return client.preview.understand
        .assistants(assistant.sid)
        .update({
          fallbackActions: schema.fallbackActions,
          initiationActions: schema.initiationActions
        });
    })

    //add custom fields to assistant
    .then(async (assistant) => {

      for (let fieldType of schema.fieldTypes) {
        await client.preview.understand
          .assistants(assistant.uniqueName)
          .fieldTypes
          .create({ uniqueName: fieldType.uniqueName })
          .then(result => {
            //console.log(`create field type: ${fieldType.uniqueName}`)
          })
          .catch(err => {
            //console.log(`ERROR: ${err.message}`)
          });

        for (let value of fieldType.values) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .fieldTypes(fieldType.uniqueName)
            .fieldValues
            .create({ language: value.language, value: value.value, synonymOf: value.synonymOf })
            .then(result => {
              //console.log(`create field type value: ${value.value}`)
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`)
            });
        }
      }

      return assistant;
    })

    //add fields to intents
    .then(async (assistant) => {

      for (let intent of schema.intents) {
        for (let field of intent.fields) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .fields
            .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
            .then(result => {
              //console.log(`Added field: ${field.uniqueName} to ${intent.uniqueName} intent`);
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`)
            });
        }
      }

      return assistant;
    })

    //add samples
    .then(async (assistant) => {

      for (let intent of schema.intents) {
        for (let sample of intent.samples) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .samples
            .create({ language: sample.language, taggedText: sample.taggedText })
            .then(result => {
              //console.log(`Added sample: ${sample.taggedText} to ${intent.uniqueName} intent`);
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`)
            });
        }
      }
      return assistant;
    })

    //start model build 
    .then((assistant) => {

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

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier);
    })

    //remove samples
    .then(assistant => {
      assistant.intents.each((intent) => {

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
                //console.log(err.message);
              });
          })
      });

      return assistant;
    })

    //remove fields
    .then(assistant => {
      assistant.intents.each((intent) => {
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
                //console.log(err.message);
              });
          })
      })

      return assistant;
    })

    //remove custom field type values
    .then(async (assistant) => {

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
                //console.log(err.message, 'fieldValues');
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
            //console.log(err.message, 'fieldTypes');
          });
      });

      return assistant;
    })

    //remove intents
    .then(assistant => {

      assistant.intents.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .remove()
          .catch((err) => {
            //console.log(err.message);
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

    //remove assistant
    .then((assistant) => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })

    // retry on error
    .catch(err => {
      //console.log(err.message);
      //TODO: might need to limit this to X retries
      this.deleteAssistantFully(assistantIdentifier);
    })

}

tag.prototype.deleteAssistant = function (assistantIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .remove()
    .then(result => {
      return result;
    });
}

tag.prototype.resetAssistant = function (assistantIdentifier) {
  return Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier);
    })

    //remove samples
    .then(assistant => {
      assistant.intents.each((intent) => {

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
                //console.log(err.message);
              });
          })
      });

      return assistant;
    })

    //remove fields
    .then(assistant => {
      assistant.intents.each((intent) => {
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
                //console.log(err.message);
              });
          })
      })

      return assistant;
    })

    //remove custom field type values
    .then(async (assistant) => {

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
                //console.log(err.message, 'fieldValues');
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
            //console.log(assistant._solution.sid, fieldType.sid);
            //console.log(err.message, 'fieldTypes');
          });
      });

      return assistant;
    })

    //remove intents
    .then(assistant => {

      assistant.intents.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .remove()
          .catch((err) => {
            //console.log(err.message);
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

    // retry on error
    .catch(err => {
      //console.log(err.message);
      //TODO: might need to limit this to X retries
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

tag.prototype.createField = function (assistantIdentifier, intentIdentifier, uniqueName, fieldType) {
  TODO://tag.prototype.createField() should validate parameters
 
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .fields
    .create(`{ fieldType: ${fieldType}, uniqueName: ${uniqueName} }`);
}

tag.prototype.exportAssistant = function (assistantIdentifier, filename) {
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

module.exports = new tag();
