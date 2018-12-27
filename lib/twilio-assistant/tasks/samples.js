
const deleteTaskSamples = async(client, assistantSid, taskSid) => {
    await client.autopilot
            .assistants(assistantSid)
            .tasks(taskSid)
            .samples
            .list()
            .then ( async (samples) => {

                if(samples.length){

                    for( let i = 0 ; i < samples.length ; i ++){

                        await client.autopilot
                                .assistants(assistantSid)
                                .tasks(taskSid)
                                .samples(samples[i].sid)
                                .remove()
                                .catch((err) => {
                                    throw err;
                                })
                        
                    }
                }
            })
            .catch((err) => {
                throw err;
            })
    return assistantSid;
}




const addTaskSamples = async (client, assistantSid, taskSid, taskSamples) => {

    if(taskSamples.length){

        for( let i = 0 ; i < taskSamples.length ; i ++){
                await client.autopilot
                .assistants(assistantSid)
                .tasks(taskSid)
                .samples
                .create({
                    "language" : taskSamples[i].language,
                    "taggedText" : taskSamples[i].taggedText
                })
                .catch((err) => {

                    console.log(err.message);
                    throw err;
                })
        }
    }
    
    return assistantSid;
}

module.exports = {
    deleteTaskSamples,
    addTaskSamples
}