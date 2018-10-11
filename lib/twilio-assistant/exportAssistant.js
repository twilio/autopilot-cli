const files = require('../files');

const exportAssistant = async (assistantSid,profile, recoverSchema = false) => {

  const client = await require('./client')(profile);

    let sampleAssistant = {
      "assistantSid": "",
      "friendlyName": "",
      "logQueries": true,
      "uniqueName": "",
      "fallbackActions": {},
      "initiationActions": {},
      "fieldTypes": [],
      "tasks": []
    };
    return await Promise.resolve()

      .then ( async () => {
          return client.preview.understand
            .assistants(assistantSid)
            .fetch().then((assistant) => {
              return assistant;
            })
      })
      .then(async (assistant) => {

        sampleAssistant.assistantSid = assistant.sid;
        sampleAssistant.friendlyName = assistant.friendlyName;
        sampleAssistant.uniqueName = assistant.uniqueName;

        await client.preview.understand
          .assistants(assistant.sid)
          .assistantFallbackActions
          .get()
          .fetch()
          .then((fallbackActions) => {
            sampleAssistant.fallbackActions = fallbackActions.data;
          })

        await client.preview.understand
          .assistants(assistant.sid)
          .assistantInitiationActions
          .get()
          .fetch()
          .then((initiationActions) => {
            sampleAssistant.initiationActions = initiationActions.data;
          })

          return await assistant;
      })

      .then( async (assistant) => {

        return await client.preview.understand
        .assistants(assistant.sid)
        .fieldTypes
        .list()
        .then( async (fieldTypes) => {
          let assistant_fieldTypes = [];
          if(fieldTypes.length){
            for( let i = 0 ; i < fieldTypes.length ; i++){
              let values = [];
              await client.preview.understand
              .assistants(assistant.sid)
              .fieldTypes(fieldTypes[i].sid)
              .fieldValues
              .list()
              .then ( async (fieldValues) => {
                  if(fieldValues.length){
                    for( let j = 0 ; j < fieldValues.length ; j++){
                      values.push({
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

      .then(async (assistant) => {

        // get assistant intents
        return await client.preview.understand
        .assistants(assistant.sid)
        .intents
        .list()
        .then( async (tasks) => {
          let assistant_tasks = [];
          if(tasks.length){
            for( let i = 0 ; i < tasks.length ; i++){
              let actions = {}, task_samples = [], task_fields = [];

              await client.preview.understand
              .assistants(assistant.sid)
              .intents(tasks[i].sid)
              .intentActions
              .get()
              .fetch()
              .then(async (intentAction) => {
                
                actions = intentAction.data;
              })
              
              await client.preview.understand
              .assistants(assistant.sid)
              .intents(tasks[i].sid)
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

              await client.preview.understand
              .assistants(assistant.sid)
              .intents(tasks[i].sid)
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

                  const filename = await files.createAssistantJSONFile(assistant.uniqueName, recoverSchema);

                  await files.writeAssistantJSONFile(sampleAssistant, filename, recoverSchema);
                  assistant.filename = filename;
                  return await assistant;
              }
            }
          }
          else{
            sampleAssistant.tasks = assistant_tasks;

            const filename = await files.createAssistantJSONFile(assistant.uniqueName, recoverSchema);

            await files.writeAssistantJSONFile(sampleAssistant, filename, recoverSchema);
            assistant.filename = filename;
            return await assistant;
          }
        })
      })

      .catch((error) => {
        console.log(error);
      })
}


module.exports = { exportAssistant };