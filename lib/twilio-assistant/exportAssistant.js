const files = require('../files');
const ora = require('ora')

const exportAssistant = async (assistantSid,profile) => {

  const client = await require('./client')(profile);

  const spinner = await ora().start('Exporting assistant...\n')

  // return await client.preview.understand
  //   .assistants
  //   .list().then((assistants) => {

  //     let choices = [];
  //     for (let i = 0; i < assistants.length; i++) {
  //       choices.push(assistants[i].uniqueName);
  //       if (i === assistants.length - 1) {
  //         spinner.stop();
  //         inquirer.prompt([
  //           {
  //             type: 'list',
  //             name: 'assistantName',
  //             message: 'Choose your assistant: ',
  //             choices: choices
  //           }
  //         ]).then(async (answer) => {
  //           let seletedAssistant = answer.assistantName

           // const f_index = await _.findIndex(assistants, { uniqueName: seletedAssistant }),
              //assistant = assistants[f_index];

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

            // get all assistants
            //spinner.start('Exporting assistant...');
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

                spinner.text = 'Exporting assistant FallbackActions...'

                await client.preview.understand
                  .assistants(assistant.sid)
                  .assistantFallbackActions
                  .get()
                  .fetch()
                  .then((fallbackActions) => {
                    sampleAssistant.fallbackActions = fallbackActions.data;
                  })

                spinner.text = 'Exporting assistant InitiationkActions...'

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

                spinner.text = 'Exporting assistant Field Types & Values...'

                return await client.preview.understand
                .assistants(assistant.sid)
                .fieldTypes
                .list()
                .then( async (fieldTypes) => {
                    for( let i = 0 ; i < fieldTypes.length ; i++){
                      await client.preview.understand
                      .assistants(assistant.sid)
                      .fieldTypes(fieldTypes[i].sid)
                      .fieldValues
                      .list()
                      .then ( async (fieldValues) => {
                          let values = [];
                          for( let j = 0 ; j < fieldValues.length ; j++){
                            values.push({
                              "sid": fieldValues[j].sid,
                              "language": fieldValues[j].language,
                              "value": fieldValues[j].value,
                              "synonymOf": fieldValues[j].synonymOf
                            })
                            if( j === fieldValues.length-1){
                              sampleAssistant.fieldTypes.push({
                                "sid": fieldTypes[i].sid,
                                "uniqueName": fieldTypes[i].uniqueName,
                                "values": values
                              });
                            }
                          }
                      })
                        
                      if(i === fieldTypes.length-1){
                        return assistant;
                      }
                    }
                })
              })

              .then(async (assistant) => {

                spinner.text = 'Exporting assistant tasks...'
                // get assistant intents
                return await client.preview.understand
                .assistants(assistant.sid)
                .intents
                .list()
                .then( async (tasks) => {
                  let assistant_tasks = [];
                    for( let i = 0 ; i < tasks.length ; i++){
                      let actions = {}, task_samples = [], task_fields = [];

                      spinner.text = `Exporting task action...`
                      await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(tasks[i].sid)
                      .intentActions
                      .get()
                      .fetch()
                      .then(async (intentAction) => {
                        
                        actions = intentAction.data;
                      })
                      
                      spinner.text = `Exporting task samples...`
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

                      spinner.text = 'Exporting task FieldTypes...'

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
                          
                          spinner.text = `Writing schema json`

                          const filename = await files.createAssistantJSONFile(assistant.uniqueName);

                          await files.writeAssistantJSONFile(sampleAssistant,filename);

                          await spinner.stop()
                          assistant.filename = filename;
                          return await assistant;
                      }
                    }
                })
              })

              .catch((error) => {
                spinner.stop()
                console.log(error);
              })
          //})
        //}
      //}

    // })
    // .catch((error) => {
    //   spinner.stop()
    //   console.log(`error in list ${error.message}`);
    // });
}


module.exports = { exportAssistant };