

const deleteAssistantFully = async (assistantIdentifier,profile) => {

  const client = await require('./client')(profile);

  return await Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier);
    })

    //remove samples
    .then( async (assistant) => {

        return await client.preview.understand
        .assistants(assistantIdentifier)
        .intents
        .list()
        .then( async (tasks) => {
          if(tasks.length){
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
          }else{
            return assistant;
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
          if(tasks.length){
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
          }else{
            return assistant;
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
        if(fieldTypes.length){
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
        }else{
          return assistant;
        }
      })
  })

  .then (async (assistant) => {
    
    return await client.preview.understand
      .assistants(assistantIdentifier)
      .fieldTypes
      .list()
      .then( async (fieldTypes) => {
        if(fieldTypes.length){
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
        }else{
          return assistant;
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
            });
          }
        })
    return await assistant;
  })

    //remove assistant
    .then(async (assistant) => {
      return await client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })

    // retry on error
    .catch(err => {
      throw err;
    })

}

module.exports = { deleteAssistantFully };