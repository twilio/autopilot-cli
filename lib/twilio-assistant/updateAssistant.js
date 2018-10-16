const fs = require('fs');

const updateAssistant = async (schemaFile, profile) => {

  const {resetAssistant} = require('./resetAssistant');
  const client = await require('./client')(profile);


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
      return client.autopilot
        .assistants(schema.assistantSid)
        .fetch()
    })

    //update basic assistant properties and clear assistant actions
    .then(assistant => {
      let params = {
        friendlyName: schema.friendlyName,
        uniqueName: schema.uniqueName,
        logQueries: (schema.hasOwnProperty('logQueries')) ? schema.logQueries : true,
        defaults : {
          defaults: {
              assistant_initiation: '',
              fallback: ''
          }
        },
        styleSheet: {
          style_sheet:{
            voice: {
              say_voice: 'Polly.Salli'
            }
          }
        }
      }

      return client.autopilot
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

        for (let task of schema.tasks) {
          await client.autopilot
            .assistants(assistant.uniqueName)
            .tasks
            .create({ uniqueName: task.uniqueName })
            .then(result => {
            })
            .catch(err => {
            });
        }
      }
      return await assistant;
    })

    //add assistant actions
    .then( async (assistant) => {
      if (schema.hasOwnProperty('defaults')) {

        return await client.autopilot
          .assistants(assistant.sid)
          .update({
            defaults: schema.defaults,
            styleSheet: schema.styleSheet
          });
      } else {
        return await assistant;
      }
    })

    //update task actions
    .then( async(assistant) => {
      if (schema.hasOwnProperty('tasks')) {

        for (let task of schema.tasks) {
          if (task.hasOwnProperty('actions')) {

            await client.autopilot
            .assistants(assistant.uniqueName)
            .tasks(task.uniqueName)
            .update({actions : task.actions})
          }
        }
      }
      return await assistant
    })

    //update custom fieldTypes
    .then(async (assistant) => {

      if (schema.hasOwnProperty('fieldTypes')) {

        for (let fieldType of schema.fieldTypes) {
          await client.autopilot
            .assistants(assistant.uniqueName)
            .fieldTypes
            .create({ uniqueName: fieldType.uniqueName })
            .then(result => {
            })
            .catch(err => {
            });

          if (fieldType.hasOwnProperty('values')) {

            for (let value of fieldType.values) {
              await client.autopilot
                .assistants(assistant.uniqueName)
                .fieldTypes(fieldType.uniqueName)
                .fieldValues
                .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                .then(result => {
                })
                .catch(err => {
                });
            }
          }
        }
      }

      return await assistant;
    })

    //add fields to tasks
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          if (task.hasOwnProperty('fields')) {
            for (let field of task.fields) {
              await client.autopilot
                .assistants(assistant.uniqueName)
                .tasks(task.uniqueName)
                .fields
                .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
                .then(result => {
                })
                .catch(err => {
                });
            }
          }
        }
      }

      return await assistant;
    })

    //add samples
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          for (let sample of task.samples) {
            await client.autopilot
              .assistants(assistant.uniqueName)
              .tasks(task.uniqueName)
              .samples
              .create({ language: sample.language, taggedText: sample.taggedText })
              .then(result => {
              })
              .catch(err => {
              });
          }
        }
      }
      return await assistant;
    })
    .then(async (assistant) => {

      await client.autopilot
        .assistants(assistant.uniqueName)
        .modelBuilds
        .create({ uniqueName: assistant.uniqueName })
        .then(result => {
        })
        .catch(err = {
        });

      return await assistant;
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
}

module.exports = {updateAssistant};

