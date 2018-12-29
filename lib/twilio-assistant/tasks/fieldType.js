const deleteTaskFields = async (client, assistantSid, taskSid) => {

    await client.autopilot
            .assistants(assistantSid)
            .tasks(taskSid)
            .fields
            .list()
            .then ( async (fields) => {

                if(fields.length){

                    for( let i = 0 ; i < fields.length ; i ++){

                        await client.autopilot
                                .assistants(assistantSid)
                                .tasks(taskSid)
                                .fields(fields[i].sid)
                                .remove()
                                .catch((err) => {
                                    console.log(err.message);
                                })
                        
                    }
                }
            })
    return assistantSid;
}

const addTaskFields = async (client, assistantSid, taskSid, taskFields) => {

    if(taskFields.length){

        for( let i = 0 ; i < taskFields.length ; i ++){

            await client.autopilot
                .assistants(assistantSid)
                .tasks(taskSid)
                .fields
                .create({ fieldType: taskFields[i].fieldType, uniqueName: taskFields[i].uniqueName })
                .then(result => {
                })
                .catch(err => {
                    throw err;
                });

            if( i === taskFields.length - 1){

                return assistantSid
            }
        }
    }else{

        return assistantSid
    }
}

module.exports = {
    deleteTaskFields,
    addTaskFields
}