const fs = require('fs');
const ora = require('ora')
//const client = require('./client');

const updateAssistant = async (schemaFile, profile) => {

  const {resetAssistant} = require('./resetAssistant');
  const client = await require('./client')(profile);

  const spinner = await ora().start('Updating assistant...');


  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('assistantSid')) {
    throw new Error(`The 'assistantSid' property must be defined in your schema.`)
  }

  return await Promise.resolve()

    //get the assistant
    .then(( ) => {
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
    .then( async (assistant) => {
      await resetAssistant(schema.assistantSid, profile);

      return await assistant
    })

    //add updated tasks to assistant
    .then(async (assistant) => {
      if (schema.hasOwnProperty('tasks')) {
        spinner.text = `Updating tasks...`
        for (let task of schema.tasks) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents
            .create({ uniqueName: task.uniqueName })
            .then(result => {
              //console.log(`Added task: ${task.uniqueName}`);
            })
            .catch(err => {
              //console.log(`ERROR: ${err.message}`);
            });
        }
      }
      return await assistant;
    })

    //add assistant actions
    .then( async (assistant) => {
      if (schema.hasOwnProperty('fallbackActions.actions')) {

        spinner.text = `Updating assistant actions...`

        return await client.preview.understand
          .assistants(assistant.sid)
          .update({
            fallbackActions: schema.fallbackActions,
            initiationActions: schema.initiationActions
          });
      } else {
        return await assistant;
      }
    })

    //update task actions
    .then( async(assistant) => {
      if (schema.hasOwnProperty('tasks')) {
        spinner.text = `Updating task actions...`
        for (let task of schema.tasks) {
          if (task.hasOwnProperty('actions')) {

            await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(task.uniqueName)
            .update({actions : task.actions})
            //create actions for task
            //TODO: finish this
          }
        }
      }
      return await assistant
    })

    //update custom fieldTypes
    .then(async (assistant) => {

      if (schema.hasOwnProperty('fieldTypes')) {
        spinner.text = `Updating assistant field types...`
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
            spinner.text = `Updating assistant field values...`
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

      return await assistant;
    })

    //add fields to tasks
    .then(async (assistant) => {
      spinner.text = `Updating tasks field types...`
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

      return await assistant;
    })

    //add samples
    .then(async (assistant) => {
      spinner.text = `Updating tasks samples...`
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
      return await assistant;
    })
    .then(async (assistant) => {
      spinner.text = `Updating model build...`
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

      await spinner.stop()

      return await assistant;
    })
    .catch(err => {
      spinner.stop();
      console.log(err.message);
      process.exit();
    })
}

module.exports = {updateAssistant};

