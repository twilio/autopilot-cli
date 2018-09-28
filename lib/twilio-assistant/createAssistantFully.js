const fs = require('fs');

const ora = require('ora')

const createAssistantFully = function (schemaFile, profile) {

  const client = require('./client')(profile); 

  const spinner = ora().start('Creating assistant...')

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

      spinner.text = `adding task...`

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

      spinner.text = `Adding fallback and initiation actions...`

      if (schema.hasOwnProperty('fallbackActions.actions')) {
        client.preview.understand
          .assistants(assistant.sid)
          .update({
            fallbackActions: schema.fallbackActions,
            initiationActions: schema.initiationActions
          })
          .then((result) => {

          }).catch((err) => {
            //console.log(`ERROR: ${err.message}`)
          });
      }

      return assistant;
    })

    //add custom fields to assistant
    .then(async (assistant) => {

      spinner.text = `adding field types...`

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
          
          spinner.text = `adding field values...`

          if (fieldType.hasOwnProperty('values')) {
            for (let value of fieldType.values) {
              await client.preview.understand
                .assistants(assistant.uniqueName)
                .fieldTypes(fieldType.uniqueName)
                .fieldValues
                .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
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

      spinner.text = `Adding intents field types...`

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

      spinner.text = `Adding intents samples...`

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
    .then(async (assistant) => {
      spinner.text = `Creating model build...`
      await client.preview.understand
        .assistants(assistant.uniqueName)
        .modelBuilds
        .create({ uniqueName: assistant.uniqueName })
        .then(result => {
          //log result
        })
        .catch(err = {
          //log error
        });

      spinner.stop()

      return assistant;
    })

    .catch(err => {
      spinner.stop()
      throw err;
    })

}

module.exports = { createAssistantFully };