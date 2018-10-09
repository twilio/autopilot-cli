

const resetAssistant = async (assistantIdentifier, profile) => {

  const client = await require('./client')(profile);

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
                  })
              if(i === fieldTypes.length-1){
                return assistant;
              }
            }
          })
    })

    //remove tasks
    .then( async (assistant) => {

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
                });
              }
        });

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
              });
            }
          })
      return await assistant;
    })

    // retry on error
    .catch(err => {
      console.log(err.message);
    })

}
//resetAssistant('UA3ff3899095d133289c5a5cd90a196269', 'default');
module.exports = { resetAssistant };