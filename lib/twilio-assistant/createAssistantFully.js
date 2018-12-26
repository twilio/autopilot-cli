const fs = require('fs');

const createAssistantFully = async (schemaFile, profile) => {

  const client = await require('./client')(profile);

  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('friendlyName') && !schema.hasOwnProperty('uniqueName')) {
    throw new Error(`A 'friendlyName' and/or 'uniqueName' must be defined in your schema.`)
  }

  let assistant_Obj = {
    friendlyName: schema.uniqueName,
    uniqueName: schema.uniqueName,
    logQueries: true,
  };

  if(schema.hasOwnProperty('defaults') && schema.defaults.hasOwnProperty('defaults'))
    assistant_Obj["defaults"] = schema.defaults;
  
  if(schema.hasOwnProperty('styleSheet') && schema.styleSheet.hasOwnProperty('styleSheet'))
    assistant_Obj["styleSheet"] = schema.styleSheet;

  return await Promise.resolve()

    
    
    //create new assistant
    .then(async () => {
      return client.autopilot
        .assistants
        .create(assistant_Obj)
    })

    //create a unique name if name exists
    .catch(async(err) => {
      if (err.message.includes("UniqueName already in use") || err.message.includes("Failed to create assistant "+schema.uniqueName)) {

        assistant_Obj.uniqueName = `${schema.uniqueName}-${Date.now()}`;
        assistant_Obj.friendlyName = `${schema.uniqueName}-${Date.now()}`;
        
        return client.autopilot
          .assistants
          .create(assistant_Obj)
      }
    })

    // delete hello-world task
    .then(async (assistant) => {
      return await client.autopilot
      .assistants(assistant.uniqueName)
      .tasks
      .list().then(async (tasks) => {
        if(tasks.length){
          for(let j=0 ; j < tasks.length; j++){
            await client.autopilot
            .assistants(assistant.uniqueName)
            .tasks(tasks[j].sid)
            .samples
            .list().then(async (samples) => {
              if(samples.length)
              {
                for( let i = 0 ; i < samples.length ; i++){
                  await client.autopilot
                  .assistants(tasks[j].assistantSid)
                  .tasks(tasks[j].sid)
                  .samples(samples[i].sid)
                  .remove()
                  .catch((error) => {
                  });
                }
              }
            })
            .catch(err => {
            })
  
            if( j=== tasks.length-1){
              await client.autopilot
              .assistants(assistant.uniqueName)
              .tasks('hello-world')
              .remove()
              .catch((error) => {
                console.log(error.message);
              });
              return await assistant;
            }
          }
        }
        else{
          return assistant;
        }
      })
    })

    //add tasks to assistant
    .then(async (assistant) => {
      if (schema.hasOwnProperty('tasks')) {
        for (let task of schema.tasks) {
          await client.autopilot
            .assistants(assistant.uniqueName)
            .tasks
            .create({ uniqueName: task.uniqueName, actions: task.actions })
            .then(result => {
            })
            .catch(err => {
            });
        }
      }
      return assistant;
    })

    //add assistant actions
    // .then((assistant) => {

    //   if (schema.hasOwnProperty('fallbackActions.actions')) {
    //     client.autopilot
    //       .assistants(assistant.sid)
    //       .update({
    //         fallbackActions: schema.fallbackActions,
    //         initiationActions: schema.initiationActions
    //       })
    //       .then((result) => {
    //       }).catch((err) => {
    //       });
    //   }

    //   return assistant;
    // })

    //add custom fields to assistant
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

      return assistant;
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

      return assistant;
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
      return assistant;
    })

    //start model build 
    .then(async (assistant) => {

      await client.autopilot
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

module.exports = { createAssistantFully };