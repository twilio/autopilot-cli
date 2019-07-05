const fs = require('fs'),
      _ = require('lodash');

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

    //removing tasks, samples, and field types
    .then(async (assistant) => {

        let taskList = [], sampleList = [], fieldList = [];
        await client.autopilot
                .assistants(assistant.uniqueName)
                .tasks
                .list()
                .then( async (tasks) => {

                  for(let task of tasks){

                    const index = _.findIndex(schema.tasks, { "uniqueName" : task.uniqueName});

                    if(index < 0){

                      await deleteTaskSamples(client, schema.uniqueName, task);
                      await deleteTaskFields(client, schema.uniqueName, task);
                      await deleteTask(client, schema.uniqueName, task.uniqueName);

                    }else{

                      sampleList = await deleteTaskSamples(client, schema.uniqueName, task, schema.tasks[index]);
                      fieldList = await deleteTaskFields(client, schema.uniqueName, task, schema.tasks[index]);

                      task.sampleList = sampleList;
                      task.fieldList = fieldList;
                      taskList.push(task);  
                    }
                  }

                  await deleteFieldTypes(client, schema.uniqueName, schema.fieldTypes);

                  for(let task of taskList){

                    await addTaskFields(client, assistant.uniqueName, task.uniqueName, task.fieldList, schema.tasks);
                    await addTaskSamples(client, assistant.uniqueName, task.uniqueName, task.sampleList, schema.tasks);
                  }
                })
        
        return {taskList : taskList, assistant : assistant};
    })

    // delete assistant custom field types
    .then( async ({taskList, assistant}) => {


      
      const tasks1 = (taskList.length >= schema.tasks.length) ? taskList : schema.tasks,
              tasks2 = (schema.tasks.length <= taskList.length) ? schema.tasks : taskList;

      const addTaskList = _.differenceBy(tasks1, tasks2, 'uniqueName');

      for(let task of addTaskList){

        await client.autopilot
        .assistants(schema.uniqueName)
        .tasks
        .create({ uniqueName: task.uniqueName, actions: task.actions });

        await addTaskFields(client, schema.uniqueName, task.uniqueName, task.fields);
        await addTaskSamples(client, schema.uniqueName, task.uniqueName, task.samples);
      }
      return assistant;
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

