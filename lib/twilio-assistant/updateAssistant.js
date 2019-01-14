const fs = require('fs'),
      _ = require('underscore');

const updateAssistant = async (schemaFile, profile) => {

  const {deleteFieldTypes, deleteAllFieldTypes} = require('./fieldType/fieldValue'),
        {deleteTaskFields, addTaskFields} = require('./tasks/fieldType'),
        {deleteTaskSamples, addTaskSamples} = require('./tasks/samples'),
        {deleteTask} = require('./tasks/task');

  const client = await require('./client')(profile);


  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('assistantSid')) {
    throw new Error(`The 'assistantSid' property must be defined in your schema.`)
  }

  return await Promise.resolve()

    //fetch the assistant info
    .then(( ) => {

      return client.autopilot
        .assistants(schema.assistantSid)
        .fetch()
    })

    //update basic assistant properties and their actions and style sheet
    .then(assistant => {

      let params = {
        friendlyName: schema.friendlyName,
        uniqueName: schema.uniqueName,
        logQueries: (schema.hasOwnProperty('logQueries')) ? schema.logQueries : true
      }

      if(schema.hasOwnProperty('defaults') && schema.defaults.hasOwnProperty('defaults')){
        
        params['defaults'] = schema.defaults;
      }

      if(schema.hasOwnProperty('styleSheet') && schema.styleSheet.hasOwnProperty('style_sheet')){

        params['styleSheet'] = schema.styleSheet;
      }

      return client.autopilot
        .assistants(assistant.sid)
        .update(params)
    })

    //removing tasks, samples,field types and custom field types 
    .then(async (assistant) => {

        await client.autopilot
                .assistants(assistant.sid)
                .tasks
                .list()
                .then( async (TaskList) => {

                  if(TaskList.length){

                    for( let i = 0 ; i < TaskList.length ; i++){

                      const t = TaskList[i];

                      await deleteTaskSamples(client, assistant.sid, t.sid);
                      await deleteTaskFields(client, assistant.sid, t.sid);

                      if(schema.hasOwnProperty('tasks') && schema.tasks.length){

                        const index = _.findIndex(schema.tasks, { "sid" : t.sid});

                        if(index < 0)
                          await deleteTask(client,assistant.sid, t.sid);
                      }
                      else
                        await deleteTask(client,assistant.sid, t.sid);

                      if( i=== TaskList.length - 1)
                      {
                          if(schema.fieldTypes.length){

                            await deleteFieldTypes(client, assistant.sid, schema.fieldTypes);

                          }else{

                              await deleteAllFieldTypes(client, assistant.sid);
                          }
                      }
                      
                    }
                  }
                })
        
        return await assistant;
    })

    // adding assistant field types
    .then( async (assistant) => {


      if (schema.hasOwnProperty('fieldTypes') && schema.fieldTypes.length) {

        await client.autopilot
          .assistants(assistant.sid)
          .fieldTypes
          .list()
          .then( async(fieldTypes) => {

              if(fieldTypes.length){

                for (let fieldType of schema.fieldTypes) {
          
                  if(fieldType.hasOwnProperty('sid')){
        
                    if (fieldType.hasOwnProperty('values')) {

                      for (let value of fieldType.values) {

                        if(!value.synonymOf)
                        {
                          await client.autopilot
                            .assistants(assistant.sid)
                            .fieldTypes(fieldType.sid)
                            .fieldValues
                            .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                            .then(result => {
                            })
                        }
                      }
                      for (let value of fieldType.values) {

                        if(value.synonymOf)
                        {

                          await client.autopilot
                          .assistants(assistant.sid)
                          .fieldTypes(fieldType.uniqueName)
                          .fieldValues
                          .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                          .then(result => {
                          })
                        }

                      }

                    }
        
                  }else{
        
                    await client.autopilot
                      .assistants(assistant.sid)
                      .fieldTypes
                      .create({ uniqueName: fieldType.uniqueName })
                      .then(result => {
                      })
        
                    if (fieldType.hasOwnProperty('values')) {

                      for (let value of fieldType.values) {

                        if(!value.synonymOf)
                        {
                          await client.autopilot
                            .assistants(assistant.sid)
                            .fieldTypes(fieldType.sid)
                            .fieldValues
                            .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                            .then(result => {
                            })
                        }
                      }
                      for (let value of fieldType.values) {

                        if(value.synonymOf)
                        {

                          await client.autopilot
                          .assistants(assistant.sid)
                          .fieldTypes(fieldType.uniqueName)
                          .fieldValues
                          .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                          .then(result => {
                          })
                        }

                      }

                    }

                  }

                }

              }
              else{

                for (let fieldType of schema.fieldTypes) {

                  await client.autopilot
                      .assistants(assistant.sid)
                      .fieldTypes
                      .create({ uniqueName: fieldType.uniqueName })
                      .then(result => {
                      })
        
                    if (fieldType.hasOwnProperty('values')) {

                      for (let value of fieldType.values) {

                        if(!value.synonymOf)
                        {

                          await client.autopilot
                          .assistants(assistant.sid)
                          .fieldTypes(fieldType.uniqueName)
                          .fieldValues
                          .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                          .then(result => {
                          })
                        }

                      }
                      for (let value of fieldType.values) {

                        if(value.synonymOf)
                        {

                          await client.autopilot
                          .assistants(assistant.sid)
                          .fieldTypes(fieldType.uniqueName)
                          .fieldValues
                          .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
                          .then(result => {
                          })
                        }

                      }

                    }
                }

              }
          });
      }
      return await assistant;
    })

    //adding new tasks

    .then( async (assistant) => {

        if(schema.hasOwnProperty('tasks') && schema.tasks.length){

          await client.autopilot
              .assistants(assistant.sid)
              .tasks
              .list()
              .then( async (TaskList) => {

                if(TaskList.length){

                  for (let task of schema.tasks) {

                    if(!(task.hasOwnProperty('sid') && task.sid.length))
                    {
                        await client.autopilot
                          .assistants(assistant.uniqueName)
                          .tasks
                          .create({ uniqueName: task.uniqueName, actions: task.actions })
                          .then( async( result) => {
      
                              await addTaskFields(client, assistant.sid, result.sid, task.fields);
                              await addTaskSamples(client, assistant.sid, result.sid, task.samples);
                          })
                          .catch(err => {
                          });
                    }else{
      
                      await addTaskFields(client, assistant.sid, task.sid, task.fields);
                      await addTaskSamples(client, assistant.sid, task.sid, task.samples);
                    }
                  }
                }else{

                  for (let task of schema.tasks) {

                      await client.autopilot
                        .assistants(assistant.uniqueName)
                        .tasks
                        .create({ uniqueName: task.uniqueName, actions: task.actions })
                        .then( async( result) => {
    
                            await addTaskFields(client, assistant.sid, result.sid, task.fields);
                            await addTaskSamples(client, assistant.sid, result.sid, task.samples);
                        })
                  }
                }
              });
        }
        return await assistant
    })

    // updating/creating model build
    .then(async (assistant) => {

      if(schema.hasOwnProperty('modelBuild') && schema.modelBuild.hasOwnProperty('sid')){

        await client.autopilot
          .assistants(assistant.uniqueName)
          .modelBuilds(schema.modelBuild.sid)
          .update({ uniqueName: schema.modelBuild.uniqueName })
          .then(result => {
          })
      }
      else{

        await client.autopilot
          .assistants(assistant.uniqueName)
          .modelBuilds
          .create({ uniqueName: `${schema.modelBuild.uniqueName}-${Date.now()}` })
          .then(result => {
          })
      }
      

      return await assistant;
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
}

module.exports = {updateAssistant};

