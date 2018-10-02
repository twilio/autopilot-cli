//const client = require('./client');
const ora = require('ora');

const resetAssistant = async (assistantIdentifier, profile) => {

  const client = await require('./client')(profile);

  //const spinner = await ora().start('Resetting assistant...')

  return await Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .fetch()
    })

    //remove assistant actions
    .then(async (assistant) => {
      let params = {
        initiationActions: { actions: [{ "say": { "speech": "Hello World!" } }] },
        fallbackActions: { actions: [{ "say": { "speech": "Hello World!" } }] }
      }

      await client.preview.understand
        .assistants(assistantIdentifier)
        .update(params)
      
      return await assistant;
    })

    //remove samples
    .then( async (assistant) => {

      //spinner.text = `Resetting task samples...`

        return await client.preview.understand
        .assistants(assistantIdentifier)
        .intents
        .list()
        .then( async (tasks) => {
            for( let i = 0 ; i < tasks.length ; i++){
                await client.preview.understand
                .assistants(assistantIdentifier)
                .intents(tasks[i].sid)
                .samples
                .list()
                .then ( async (samples) => {
                    for( let j = 0 ; j < samples.length ; j++){
                      await client.preview.understand
                        .assistants(assistantIdentifier)
                        .intents(tasks[i].sid)
                        .samples(samples[j].sid)
                        .remove()
                        .catch((err) => {
                          //console.log(err.message)
                        })
                    }
                })
              if(i === tasks.length-1){
                  return assistant;
              }
            }
        })
    })

    //remove fields
    .then(async (assistant) => {

      //spinner.text = `Resetting task field types...`

        return await client.preview.understand
        .assistants(assistantIdentifier)
        .intents
        .list()
        .then( async (tasks) => {
            for( let i = 0 ; i < tasks.length ; i++){
                await client.preview.understand
                .assistants(assistantIdentifier)
                .intents(tasks[i].sid)
                .fields
                .list()
                .then ( async (fields) => {
                    for( let j = 0 ; j < fields.length ; j++){
                      await client.preview.understand
                        .assistants(assistantIdentifier)
                        .intents(tasks[i].sid)
                        .fields(fields[j].sid)
                        .remove()
                        .catch((err) => {
                          //console.log(err.message)
                        })
                    }
                })
              if(i === tasks.length-1){
                  return assistant;
              }
            }
        })
    })

    //remove custom field type values
    .then(async (assistant) => {

        await client.preview.understand
        .assistants(assistantIdentifier)
        .fieldTypes
        .list()
        .then( async (fieldTypes) => {
            for( let i = 0 ; i < fieldTypes.length ; i++){
                await client.preview.understand
                .assistants(assistantIdentifier)
                .fieldTypes(fieldTypes[i].sid)
                .fieldValues
                .list()
                .then ( async (fieldValues) => {
                  //spinner.text = `Resetting field values...`
                    for( let j = 0 ; j < fieldValues.length ; j++){
                      await client.preview.understand
                      .assistants(assistantIdentifier)
                      .fieldTypes(fieldTypes[i].sid)
                      .fieldValues(fieldValues[j].sid)
                      .remove()
                      .catch((err) => {
                        //console.log(err.message, 'fieldValues');
                      })
                    }
                })
              if(i===fieldTypes.length-1){
                return assistant;
              }
            }
        })
    })

    .then (async (assistant) => {

      //spinner.text = `Resetting field types...`
      
      return await client.preview.understand
        .assistants(assistantIdentifier)
        .fieldTypes
        .list()
        .then( async (fieldTypes) => {
            for( let i = 0 ; i < fieldTypes.length ; i++){
                await client.preview.understand
                  .assistants(assistantIdentifier)
                  .fieldTypes(fieldTypes[i].sid)
                  .remove()
                  .catch((err) => {
                    //console.log(assistant._solution.sid, fieldType.sid);
                    //console.log(err.message);
                  })
              if(i === fieldTypes.length-1){
                return assistant;
              }
            }
          })
    })

    //remove tasks
    .then( async (assistant) => {

        //spinner.text = `Resetting tasks...`
        await client.preview.understand
        .assistants(assistantIdentifier)
        .intents
        .list()
        .then( async (tasks) => {
            for( let i = 0 ; i < tasks.length ; i++){
              await client.preview.understand
                .assistants(assistantIdentifier)
                .intents(tasks[i].sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message);
                });
              }
        });

        //spinner.text = `Resetting model builds...`
        await client.preview.understand
          .assistants(assistantIdentifier)
          .modelBuilds
          .list().then(async (modelBuilds) => {
            for(let i=0 ; i<modelBuilds.length ; i++){
              await client.preview.understand
              .assistants(assistantIdentifier)
              .modelBuilds(modelBuilds[i].sid)
              .remove()
              .catch((err) => {
                console.log(err.message);
                //deleteAssistantFully(assistantIdentifier);
              });
            }
          })
      //await spinner.stop();
      return await assistant;
    })

    // retry on error
    .catch(err => {
      console.log(err.message);
      //spinner.stop();
      //resetAssistant(assistantIdentifier, profile);
    })

}
//resetAssistant('UA3ff3899095d133289c5a5cd90a196269', 'default');
module.exports = { resetAssistant };