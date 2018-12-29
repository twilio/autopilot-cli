
const deleteTask = async (client, assistantSid, taskSid) => {

    return await client.autopilot
            .assistants(assistantSid)
            .tasks(taskSid)
            .remove()
            .catch((err) => {
                throw err;
            })
}

module.exports = {
    deleteTask
}