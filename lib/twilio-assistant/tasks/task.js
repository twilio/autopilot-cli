
const deleteTask = async (client, assistantUniqueName, taskUniqueName) => {

    return await client.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .remove()
            .catch((err) => {
                throw err;
            })
}
const addTasks = async (client, assistantUniqueName , schemaTasks) => {

    try{

        if(schemaTasks.length){

            await client.autopilot.assistants(assistantUniqueName)
                  .tasks
                  .list()
                  .then ( async (taskList) => {
    
                    if(taskList.length){
    
                        for( let i = 0 ; i < schemaTasks.length ; i ++){
    
                            const index = _.findIndex(taskList, { uniqueName : schemaTasks[i].uniqueName});
    
                            if(index < 0){
    
                                await client.autopilot
                                .assistants(assistantUniqueName)
                                .tasks
                                .create({ uniqueName: schemaTasks[i].uniqueName, actions: schemaTasks[i].actions })
                                .catch(err => {
                                    throw err;
                                });
                            }else{

                                await client.autopilot
                                .assistants(assistantUniqueName)
                                .tasks(schemaTasks[i].uniqueName)
                                .update({actions : schemaTasks[i].actions})
                                .catch(err => {

                                    throw err;
                                })
                            }
                        }
                    }
                    else{
    
                        for( let i = 0 ; i < schemaTasks.length ; i ++){
    
                            await client.autopilot
                            .assistants(assistantUniqueName)
                            .tasks
                            .create({ uniqueName: schemaTasks[i].uniqueName, actions: schemaTasks[i].actions })
                            .catch(err => {
                                throw err;
                            });
                        }
                    }
                });
    
        }
        return assistantUniqueName;
    }catch(err){

        throw err;
    }
}

module.exports = {
    deleteTask,
    addTasks
}