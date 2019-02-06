
const deleteTaskSamples = async(client, assistantUniqueName, taskUniqueName) => {
    await client.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .samples
            .list()
            .then ( async (samples) => {

                if(samples.length){

                    for( let i = 0 ; i < samples.length ; i ++){

                        await client.autopilot
                                .assistants(assistantUniqueName)
                                .tasks(taskUniqueName)
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
    return assistantUniqueName;
}




const addTaskSamples = async (client, assistantUniqueName, taskUniqueName, taskSamples) => {

    if(taskSamples.length){

        for( let i = 0 ; i < taskSamples.length ; i ++){
                await client.autopilot
                .assistants(assistantUniqueName)
                .tasks(taskUniqueName)
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
    
    return assistantUniqueName;
}

module.exports = {
    deleteTaskSamples,
    addTaskSamples
}