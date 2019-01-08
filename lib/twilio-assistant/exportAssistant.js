const files = require('../files');

const exportAssistant = async (assistantSid,profile, recoverSchema = false) => {

  const client = await require('./client')(profile);

    let sampleAssistant = {
      "assistantSid": "",
      "friendlyName": "",
      "logQueries": true,
      "uniqueName": "",
      "defaults": {},
      "styleSheet": {},
      "fieldTypes": [],
      "tasks": [],
      "modelBuild" : {}
    };

    return await Promise.resolve()

      // fetch assistant info
      .then ( async () => {

          return client.autopilot
            .assistants(assistantSid)
            .fetch().then((assistant) => {

              return assistant;
            })
      })

      // fetch assistant defaults and stylesheet
      .then(async (assistant) => {

        sampleAssistant.assistantSid = assistant.sid;
        sampleAssistant.friendlyName = assistant.friendlyName;
        sampleAssistant.uniqueName = assistant.uniqueName;

        // fetch assistant defaults
        await client.autopilot
          .assistants(assistant.sid)
          .defaults()
          .fetch()
          .then((defaults) => {

            sampleAssistant.defaults = defaults.data;

          })

        // fetch assistant stylesheet
        await client.autopilot
          .assistants(assistant.sid)
          .styleSheet()
          .fetch()
          .then((styleSheet) => {

            sampleAssistant.styleSheet = styleSheet.data;

          })

          return assistant;
      })

      // fetch assistant field types/values
      .then( async (assistant) => {

        // fetch assistant field types
        return await client.autopilot
        .assistants(assistant.sid)
        .fieldTypes
        .list()
        .then( async (fieldTypes) => {

          let assistant_fieldTypes = [];

          if(fieldTypes.length){

            for( let i = 0 ; i < fieldTypes.length ; i++){

              let values = [];

              // fetch assistant field type values
              await client.autopilot
              .assistants(assistant.sid)
              .fieldTypes(fieldTypes[i].sid)
              .fieldValues
              .list()
              .then ( async (fieldValues) => {

                  if(fieldValues.length){

                    for( let j = 0 ; j < fieldValues.length ; j++){

                      values.unshift({
                        "sid": fieldValues[j].sid,
                        "language": fieldValues[j].language,
                        "value": fieldValues[j].value,
                        "synonymOf": fieldValues[j].synonymOf
                      })
                      if( j === fieldValues.length-1){

                        assistant_fieldTypes.push({
                          "sid": fieldTypes[i].sid,
                          "uniqueName": fieldTypes[i].uniqueName,
                          "values": values
                        });

                      }
                    }
                  }
              })
                
              if(i === fieldTypes.length-1){

                sampleAssistant.fieldTypes = assistant_fieldTypes;
                return assistant;

              }
            }
          }
          else {

            sampleAssistant.fieldTypes = assistant_fieldTypes;
            return assistant;

          }

        })
      })

      // fetch assistant tasks
      .then(async (assistant) => {

        // fetch assistant tasks
        return await client.autopilot
        .assistants(assistant.sid)
        .tasks
        .list()
        .then( async (tasks) => {

          let assistant_tasks = [];

          if(tasks.length){

            for( let i = 0 ; i < tasks.length ; i++){

              let actions = {}, task_samples = [], task_fields = [];

              // fetch assistant task actions
              await client.autopilot
              .assistants(assistant.sid)
              .tasks(tasks[i].sid)
              .taskActions
              .get()
              .fetch()
              .then(async (taskAction) => {
                
                actions = taskAction.data;
              })
              
              // fetch assistant task samples
              await client.autopilot
              .assistants(assistant.sid)
              .tasks(tasks[i].sid)
              .samples
              .list()
              .then ( async (samples) => {

                  for( let j = 0 ; j < samples.length ; j++){

                    task_samples.push({
                      "sid": samples[j].sid,
                      "language": samples[j].language,
                      "taggedText": samples[j].taggedText
                    });
                  
                  }
              })

              // fetch assistant task field
              await client.autopilot
              .assistants(assistant.sid)
              .tasks(tasks[i].sid)
              .fields
              .list()
              .then ( async (fields) => {

                  for( let j = 0 ; j < fields.length ; j++){
                    
                    task_fields.push({
                      "sid": fields[j].sid,
                      "uniqueName": fields[j].uniqueName,
                      "fieldType": fields[j].fieldType
                    })
                  
                  }
              })

              await assistant_tasks.push({
                "sid": tasks[i].sid,
                "uniqueName": tasks[i].uniqueName,
                "actions": actions,
                "fields": task_fields,
                "samples": task_samples
              })

              if( i === tasks.length-1){

                  sampleAssistant.tasks = assistant_tasks;
                  return await assistant;

              }

            }

          }
          else{

            sampleAssistant.tasks = assistant_tasks;
            return await assistant;

          }

        })

      })

      // fetch assistant model builds
      .then( async (assistant) => {

          await client.autopilot
                .assistants(assistant.sid)
                .modelBuilds
                .list()
                .then( async(model_build) =>{

                    sampleAssistant.modelBuild = {
                        "sid" : model_build[0].sid,
                        "uniqueName" : model_build[0].uniqueName
                    }  
                })

          const filename = await files.createAssistantJSONFile(assistant.uniqueName, recoverSchema);

          await files.writeAssistantJSONFile(sampleAssistant, filename, recoverSchema);

          assistant.filename = filename;
          
          return await assistant;
      })
      .catch((error) => {
        throw error;
      })
        
}

module.exports = { exportAssistant };