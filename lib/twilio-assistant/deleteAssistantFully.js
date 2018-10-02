//const client = require('./client');
const ora = require('ora');

const deleteAssistantFully = async (assistantIdentifier,profile) => {

  const client = await require('./client')(profile);
  const spinner = await ora().start('Deleting assistant...')

  return await Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier);
    })

    //remove samples
    .then( async (assistant) => {

      spinner.text = `Deleting task samples...`

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

      spinner.text = `Deleting task field types...`

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
      spinner.text = `Deleting field values...`
      return await client.preview.understand
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

    spinner.text = `Deleting field types...`
    
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

      spinner.text = `Deleting tasks...`
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

      spinner.text = `Deleting model builds...`
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

    //remove assistant
    .then(async (assistant) => {
      spinner.stop();
      return await client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })

    // retry on error
    .catch(err => {
      //console.log(err.message);
      spinner.stop();
        //deleteAssistantFully(assistantIdentifier,profile);
    })

}

module.exports = { deleteAssistantFully };