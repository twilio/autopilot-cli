try {
  var config = require('../config.js');
} catch(e) {
  console.log("Oops! We did not find the config.js file in the Project Root Directory. Please refer to the README file for more information");
  process.exit();
}

const twilio = require('twilio');
const fs = require('fs');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

const tag = function () { };

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

  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('friendlyName') && !schema.hasOwnProperty('uniqueName')) {
    throw new Error(`A 'friendlyName' and/or 'uniqueName' must be defined in your schema.`)
  }
  return Promise.resolve()

    //create new assistant
    .then(() => {
      return client.preview.understand
        .assistants
        .create({
          friendlyName: schema.uniqueName,
          uniqueName: schema.uniqueName,
          logQueries: true
        })
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
          })
      }
    })

    //add tasks to assistant
    .then(async (assistant) => {
      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents
            .create({ uniqueName: task.uniqueName, actions: task.actions })
            .then(result => {
              //console.log(`Added task: ${task.uniqueName}`);
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`);
            });
        }
      }
      return assistant;
    })

    //add assistant actions
    .then((assistant) => {

      if (schema.hasOwnProperty('fallbackActions.actions')) {
        client.preview.understand
          .assistants(assistant.sid)
          .update({
            fallbackActions: schema.fallbackActions,
            initiationActions: schema.initiationActions
          })
          .then((result) => {
            
          }).catch((err) => {
            console.log(`ERROR: ${err.message}`)
          });
      }

      return assistant;
    })

    //add custom fields to assistant
    .then(async (assistant) => {

      if (schema.hasOwnProperty('fieldTypes')) {
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

          if (fieldType.hasOwnProperty('values')) {
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
        }
      }

      return assistant;
    })

    //add fields to tasks
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          if (task.hasOwnProperty('fields')) {
            for (let field of task.fields) {
              await client.preview.understand
                .assistants(assistant.uniqueName)
                .intents(task.uniqueName)
                .fields
                .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
                .then(result => {
                  //console.log(`Added field: ${field.uniqueName} to ${task.uniqueName} tasks`);
                })
                .catch(err => {
                  //console.log(`ERROR: ${err.message}`)
                });
            }
          }
        }
      }

      return assistant;
    })

    //add samples
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          for (let sample of task.samples) {
            await client.preview.understand
              .assistants(assistant.uniqueName)
              .intents(task.uniqueName)
              .samples
              .create({ language: sample.language, taggedText: sample.taggedText })
              .then(result => {
                //console.log(`Added sample: ${sample.taggedText} to ${task.uniqueName} task`);
              })
              .catch(err => {
                //console.log(`ERROR: ${err.message}`)
              });
          }
        }
      }
      return assistant;
    })

    //start model build 
    .then((assistant) => {

      client.preview.understand
        .assistants(assistant.uniqueName)
        .modelBuilds
        .create({ uniqueName: assistant.uniqueName })
        .then(result => {
          //log result
        })
        .catch(err = {
          //log error
        });

      return assistant;
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
      assistant.intents.each((task) => {

        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(task.sid)
          .samples
          .each((sample) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(task.sid)
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
      assistant.intents.each((task) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(task.sid)
          .fields
          .each((field) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(task.sid)
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

    //remove tasks
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
        .assistants(assistantIdentifier)
        .fetch()
    })

    //remove assistant actions
    .then(assistant => {
      let params = {
        initiationActions: { actions: [{ "say": { "speech": "Hello World!" } }] },
        fallbackActions: { actions: [{ "say": { "speech": "Hello World!" } }] }
      }

      return client.preview.understand
        .assistants(schema.assistantSid)
        .update(params)
    })

    //remove samples
    .then(assistant => {
      client.preview.understand
        .assistants(assistantIdentifier)
        .intents.each((task) => {

          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .samples
            .each((sample) => {
              client.preview.understand
                .assistants(assistantIdentifier)
                .intents(task.sid)
                .samples(sample.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message)
                })
            })
        });

      return assistant
    })

    //remove fields
    .then(assistant => {
      client.preview.understand
        .assistants(assistantIdentifier)
        .intents.each((task) => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .fields
            .each((field) => {
              client.preview.understand
                .assistants(assistantIdentifier)
                .intents(task.sid)
                .fields(field.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message);
                });
            })
        })

      return assistant
    })

    //remove custom field type values
    .then(async (assistant) => {

      if (assistant.hasOwnProperty('fieldTypes')) {
        await assistant.fieldTypes.each(fieldType => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .fieldTypes(fieldType.sid)
            .fieldValues
            .each(async fieldValues => {
              await client.preview.understand
                .assistants(assistantIdentifier)
                .fieldTypes(fieldType.sid)
                .fieldValues(fieldValues.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message, 'fieldValues');
                })
            })
        })
      }


      //remove custom field types
      if (assistant.hasOwnProperty('fieldTypes')) {
        await assistant.fieldTypes.each(async (fieldType) => {
          await client.preview.understand
            .assistants(assistant._solution.sid)
            .fieldTypes(fieldType.sid)
            .remove()
            .catch((err) => {
              //console.log(assistant._solution.sid, fieldType.sid);
              //console.log(err.message, 'fieldTypes');
            })
        })
      }

      return assistant;
    })

    //remove tasks
    .then(assistant => {
      if (assistant.hasOwnProperty('intents')) {
        assistant.intents.each((task) => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .remove()
            .catch((err) => {
              //console.log(err.message);
            });
        });
      }

      //remove models
      if (assistant.hasOwnProperty('modelBuilds')) {
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
      }

      return assistant;
    })

    // retry on error
    .catch(err => {
      console.log(err.message);
      this.resetAssistant(assistantIdentifier);
    })

}

tag.prototype.getAssistants = function () {
  return client.preview.understand
    .assistants;
}

tag.prototype.updateAssistant = function (schemaFile) {
  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('assistantSid')) {
    throw new Error(`The 'assistantSid' property must be defined in your schema.`)
  }

  return Promise.resolve()

    //get the assistant
    .then((_) => {
      return client.preview.understand
        .assistants(schema.assistantSid)
        .fetch()
    })

    //update basic assistant properties and clear assistant actions
    .then(assistant => {
      let params = {
        friendlyName: schema.friendlyName,
        uniqueName: schema.uniqueName,
        logQueries: (schema.hasOwnProperty('logQueries')) ? schema.logQueries : true,
        initiationActions: { actions: [{ "say": { "speech": "Hello World!" } }] },
        fallbackActions: { actions: [{ "say": { "speech": "Hello World!" } }] }
      }

      return client.preview.understand
        .assistants(schema.assistantSid)
        .update(params)
    })

    //remove all of the existing collections
    .then(assistant => {
      this.resetAssistant(schema.assistantSid)

      return assistant
    })

    //add updated tasks to assistant
    .then(async (assistant) => {
      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents
            .create({ uniqueName: task.uniqueName, actions: task.actions })
            .then(result => {
              //console.log(`Added task: ${task.uniqueName}`);
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`);
            });
        }
      }
      return assistant;
    })

    //add assistant actions
    .then((assistant) => {
      if (schema.hasOwnProperty('fallbackActions.actions')) {
        return client.preview.understand
          .assistants(assistant.sid)
          .update({
            fallbackActions: schema.fallbackActions,
            initiationActions: schema.initiationActions
          });
      } else {
        return assistant;
      }
    })

    //update task actions
    .then(assistant => {
      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          if (task.hasOwnProperty('actions')) {
            //create actions for task
            //TODO: finish this
          }
        }
      }
      return assistant
    })

    //update custom fieldTypes
    .then(async (assistant) => {

      if (schema.hasOwnProperty('fieldTypes')) {
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

          if (fieldType.hasOwnProperty('values')) {
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
        }
      }

      return assistant;
    })

    //add fields to tasks
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          if (task.hasOwnProperty('fields')) {
            for (let field of task.fields) {
              await client.preview.understand
                .assistants(assistant.uniqueName)
                .intents(task.uniqueName)
                .fields
                .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
                .then(result => {
                  //console.log(`Added field: ${field.uniqueName} to ${task.uniqueName} tasks`);
                })
                .catch(err => {
                  //console.log(`ERROR: ${err.message}`)
                });
            }
          }
        }
      }

      return assistant;
    })

    //add samples
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          for (let sample of task.samples) {
            await client.preview.understand
              .assistants(assistant.uniqueName)
              .intents(task.uniqueName)
              .samples
              .create({ language: sample.language, taggedText: sample.taggedText })
              .then(result => {
                //console.log(`Added sample: ${sample.taggedText} to ${task.uniqueName} task`);
              })
              .catch(err => {
                //console.log(`ERROR: ${err.message}`)
              });
          }
        }
      }
      return assistant;
    })
}

tag.prototype.deleteTask = function (assistantIdentifier, taskIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(taskIdentifier)
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

module.exports = new tag();
