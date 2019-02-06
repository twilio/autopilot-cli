const fs = require('fs'),
      _ = require('underscore');

const updateAssistant = async (schemaFile, profile) => {

  const {deleteFieldTypes, deleteAllFieldTypes, addFieldTypes} = require('./fieldType/fieldValue'),
        {deleteTaskFields, addTaskFields} = require('./tasks/fieldType'),
        {deleteTaskSamples, addTaskSamples} = require('./tasks/samples'),
        {deleteTask, addTasks} = require('./tasks/task');

  const client = await require('./client')(profile);


  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('uniqueName')) {
    throw new Error(`The 'uniqueName' property must be defined in your schema.`)
  }

  return await Promise.resolve()

    //fetch the assistant info
    .then(( ) => {

      return client.autopilot
        .assistants(schema.uniqueName)
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
        .assistants(assistant.uniqueName)
        .update(params)
    })

    //removing tasks, samples,field types and custom field types 
    .then(async (assistant) => {

        await client.autopilot
                .assistants(assistant.uniqueName)
                .tasks
                .list()
                .then( async (TaskList) => {

                  if(TaskList.length){

                    for( let i = 0 ; i < TaskList.length ; i++){

                      const t = TaskList[i];

                      await deleteTaskSamples(client, assistant.uniqueName, t.uniqueName);
                      await deleteTaskFields(client, assistant.uniqueName, t.uniqueName);

                      if(schema.hasOwnProperty('tasks') && schema.tasks.length){

                        const index = _.findIndex(schema.tasks, { "uniqueName" : t.uniqueName});

                        if(index < 0)
                          await deleteTask(client,assistant.uniqueName, t.uniqueName);
                      }
                      else
                        await deleteTask(client,assistant.uniqueName, t.uniqueName);

                      if( i=== TaskList.length - 1)
                      {
                          if(schema.fieldTypes.length){

                            await deleteFieldTypes(client, assistant.uniqueName, schema.fieldTypes);

                          }else{

                              await deleteAllFieldTypes(client, assistant.uniqueName);
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

        await addFieldTypes(client, assistant.uniqueName, schema.fieldTypes);

        for (let fieldType of schema.fieldTypes) {

          if (fieldType.hasOwnProperty('values')) {

            for (let value of fieldType.values) {

              if(!value.synonymOf)
              {
                await client.autopilot
                  .assistants(assistant.uniqueName)
                  .fieldTypes(fieldType.uniqueName)
                  .fieldValues
                  .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
              }
            }
            for (let value of fieldType.values) {

              if(value.synonymOf)
              {

                await client.autopilot
                .assistants(assistant.uniqueName)
                .fieldTypes(fieldType.uniqueName)
                .fieldValues
                .create({ language: value.language, value: value.value, synonymOf: (value.synonymOf)?value.synonymOf:'' })
              }

            }

          }

        }
      }
      return await assistant;
    })

    //adding new tasks

    .then( async (assistant) => {

        if(schema.hasOwnProperty('tasks') && schema.tasks.length){

          // add newly added task
          await addTasks(client, assistant.uniqueName, schema.tasks);
          
          for (let task of schema.tasks) {

            await addTaskFields(client, assistant.uniqueName, task.uniqueName, task.fields);
            await addTaskSamples(client, assistant.uniqueName, task.uniqueName, task.samples);
          }
        }
        return await assistant
    })

    // updating/creating model build
    .then(async (assistant) => {

      if(schema.hasOwnProperty('modelBuild') && schema.modelBuild.hasOwnProperty('uniqueName')){

        await client.autopilot
          .assistants(assistant.uniqueName)
          .modelBuilds(schema.modelBuild.uniqueName)
          .update({ uniqueName: schema.modelBuild.uniqueName })
      }
      else{

        await client.autopilot
          .assistants(assistant.uniqueName)
          .modelBuilds
          .create({ uniqueName: `${schema.uniqueName}-${Date.now()}` })
      }
      

      return await assistant;
    })
    .catch(err => {
      throw err;
    })
}

module.exports = {updateAssistant};

