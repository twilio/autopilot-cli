

const deleteAssistantFully = async (assistantIdentifier,profile) => {

  const client = await require('./client')(profile);

  return await Promise.resolve()

    //remove samples and fields
    .then( async () => {

      await client.autopilot
        .assistants(assistantIdentifier)
        .tasks
        .list()
        .then( async (tasks) => {

          if(tasks.length){

            for( let i = 0 ; i < tasks.length ; i++){

                // task samples
                await client.autopilot
                .assistants(assistantIdentifier)
                .tasks(tasks[i].uniqueName)
                .samples
                .list()
                .then ( async (samples) => {

                  if(samples.length){

                    for( let j = 0 ; j < samples.length ; j++){

                      await client.autopilot
                        .assistants(assistantIdentifier)
                        .tasks(tasks[i].uniqueName)
                        .samples(samples[j].sid)
                        .remove()

                    }
                  }

                })

                // task fields
                await client.autopilot
                .assistants(assistantIdentifier)
                .tasks(tasks[i].uniqueName)
                .fields
                .list()
                .then ( async (fields) => {

                  if(fields.length){

                    for( let j = 0 ; j < fields.length ; j++){

                      await client.autopilot
                        .assistants(assistantIdentifier)
                        .tasks(tasks[i].uniqueName)
                        .fields(fields[j].uniqueName)
                        .remove()

                    }
                  }

                })

            }
          }
        })

        return assistantIdentifier;
    })

    //remove field type and its values
    .then(async (assistant) => {

      await client.autopilot
        .assistants(assistantIdentifier)
        .fieldTypes
        .list()
        .then( async (fieldTypes) => {

          if(fieldTypes.length){

            for( let i = 0 ; i < fieldTypes.length ; i++){

                // field values
                await client.autopilot
                .assistants(assistantIdentifier)
                .fieldTypes(fieldTypes[i].uniqueName)
                .fieldValues
                .list()
                .then ( async (fieldValues) => {

                  if(fieldValues.length){

                    for( let j = 0 ; j < fieldValues.length ; j++){

                      await client.autopilot
                      .assistants(assistantIdentifier)
                      .fieldTypes(fieldTypes[i].uniqueName)
                      .fieldValues(fieldValues[j].sid)
                      .remove()

                    }
                  
                  }

                  // field types
                  await client.autopilot
                    .assistants(assistantIdentifier)
                    .fieldTypes(fieldTypes[i].uniqueName)
                    .remove()
                })
            }
          
          }
        
        })
      return assistant;
  })

  //remove tasks and model builds
  .then( async (assistant) => {

      await client.autopilot
      .assistants(assistantIdentifier)
      .tasks
      .list()
      .then( async (tasks) => {

        if(tasks.length){

          for( let i = 0 ; i < tasks.length ; i++){

            await client.autopilot
              .assistants(assistantIdentifier)
              .tasks(tasks[i].uniqueName)
              .remove()

          }
        
        }
          
      });

      await client.autopilot
        .assistants(assistantIdentifier)
        .modelBuilds
        .list()
        .then(async (modelBuilds) => {

          if(modelBuilds.length){

            // delete the oldest first
            modelBuilds.sort((a, b) => {
                if (a.dateCreated < b.dateCreated) {
                    return -1;
                } else if (a.dateCreated === b.dateCreated) {
                    return 0;
                } else {
                    return 1;
                }
            });

            for(let i=0 ; i<modelBuilds.length ; i++){

              await client.autopilot
              .assistants(assistantIdentifier)
              .modelBuilds(modelBuilds[i].uniqueName)
              .remove()
  
            }
          
          }
          
        })
    return assistant;
  })

    //remove assistant
    .then(async (assistant) => {
      return await client.autopilot
        .assistants(assistantIdentifier)
        .remove();
    })

    // retry on error
    .catch(err => {
      throw err;
    })

}

module.exports = { deleteAssistantFully };