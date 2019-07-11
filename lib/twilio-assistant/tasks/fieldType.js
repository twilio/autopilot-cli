const _ = require('lodash');

const deleteTaskFields = async (client, assistantUniqueName, task, modelFields = false) => {

    let fieldList = [];
    await client.autopilot
            .assistants(assistantUniqueName)
            .tasks(task.uniqueName)
            .fields
            .list()
            .then ( async (fields) => {

                for(let field of fields){

                    if(modelFields){

                        const f_index = _.findIndex(modelFields.fields, {fieldType : field.fieldType, uniqueName : field.uniqueName});

                        if(f_index < 0){

                            await client.autopilot
                                .assistants(assistantUniqueName)
                                .tasks(task.uniqueName)
                                .fields(field.uniqueName)
                                .remove()
                        }else{

                            fieldList.push(field);
                        }
                    }else{

                        await client.autopilot
                            .assistants(assistantUniqueName)
                            .tasks(task.uniqueName)
                            .fields(field.uniqueName)
                            .remove()
                    }
                }
            })
    return fieldList;
}

const addTaskFields = async (client, assistantUniqueName, taskUniqueName, taskFields, schemaTasks = false) => {

    if(schemaTasks){

        const index = _.findIndex(schemaTasks, {"uniqueName" : taskUniqueName});

        const taskFields1 = (taskFields.length >= schemaTasks[index].fields.length) ? taskFields : schemaTasks[index].fields,
            taskFields2 = (schemaTasks[index].fields.length <= taskFields.length) ? schemaTasks[index].fields : taskFields;

        const addTaskFieldsList = _.differenceBy(taskFields1, taskFields2, 'uniqueName');

        await client.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .update({
                actions : schemaTasks[index].actions
            });

        for(let field of addTaskFieldsList){

            await client.autopilot
                .assistants(assistantUniqueName)
                .tasks(taskUniqueName)
                .fields
                .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
        }
    }
    else{

        for(let field of taskFields){

            await client.autopilot
                .assistants(assistantUniqueName)
                .tasks(taskUniqueName)
                .fields
                .create({ fieldType: field.fieldType, uniqueName: field.uniqueName })
        }
    }
    return assistantUniqueName;
}

module.exports = {
    deleteTaskFields,
    addTaskFields
}