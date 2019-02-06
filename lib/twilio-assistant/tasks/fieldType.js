const deleteTaskFields = async (client, assistantUniqueName, taskUniqueName) => {

    await client.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .fields
            .list()
            .then ( async (fields) => {

                if(fields.length){

                    for( let i = 0 ; i < fields.length ; i ++){

                        await client.autopilot
                                .assistants(assistantUniqueName)
                                .tasks(taskUniqueName)
                                .fields(fields[i].uniqueName)
                                .remove()
                                .catch((err) => {

                                    throw err;
                                })
                        
                    }
                }
            })
    return assistantUniqueName;
}

const addTaskFields = async (client, assistantUniqueName, taskUniqueName, taskFields) => {

    if(taskFields.length){

        for( let i = 0 ; i < taskFields.length ; i ++){

            await client.autopilot
                .assistants(assistantUniqueName)
                .tasks(taskUniqueName)
                .fields
                .create({ fieldType: taskFields[i].fieldType, uniqueName: taskFields[i].uniqueName })
                .then(result => {
                })
                .catch(err => {
                    throw err;
                });

            if( i === taskFields.length - 1){

                return assistantUniqueName
            }
        }
    }else{

        return assistantUniqueName
    }
}

module.exports = {
    deleteTaskFields,
    addTaskFields
}