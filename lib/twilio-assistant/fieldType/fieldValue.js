const deleteAllFieldTypes = async (client ,assistantUniqueName) => {

    try{

        await client.autopilot.assistants(assistantUniqueName)
              .fieldTypes
              .list()
              .then ( async (fieldTypes) => {

                if(fieldTypes.length){

                    for(let i = 0 ; i < fieldTypes.length ; i ++){
                        
                        await client.autopilot.assistants(assistantUniqueName)
                            .fieldTypes(fieldTypes[i].uniqueName)
                            .fieldValues
                            .list()
                            .then ( async (fieldValues) => {

                                if(fieldValues.length){

                                    for(let j = 0 ; j < fieldValues.length ; j ++){

                                        await client.autopilot
                                            .assistants(assistantUniqueName)
                                            .fieldTypes(fieldTypes[i].uniqueName)
                                            .fieldValues(fieldValues[j].sid)
                                            .remove()
                                            .catch((err) => {

                                                console.log(err.message);
                                            }); 
                                    }
                                }
                                
                            });

                        await client.autopilot
                            .assistants(assistantUniqueName)
                            .fieldTypes(fieldTypes[i].uniqueName)
                            .remove()
                            .catch((err) => {
                                console.log(err.message);
                            }); 
                    }
                }
              })                    
        return assistantUniqueName;

    }catch(err){

        throw err;
    }
}

const deleteFieldTypes = async (client, assistantUniqueName, schemaFields) => {

    try{
        await client.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes
            .list()
            .then ( async (fieldTypes) => {

                if(fieldTypes.length){

                    for( let i = 0 ; i < fieldTypes.length ; i++ ){

                        const index = _.findIndex(schemaFields, { uniqueName : fieldTypes[i].uniqueName})

                        if(index >= 0){

                            await deleteFieldValues(client,assistantUniqueName,fieldTypes[i].uniqueName);
                        }else{

                            await deleteFieldValues(client,assistantUniqueName,fieldTypes[i].uniqueName);
                            await client.autopilot
                                .assistants(assistantUniqueName)
                                .fieldTypes(fieldTypes[i].uniqueName)
                                .remove()
                                .catch((err) => {
                                    throw err;
                                })
                        }
                        
                    }
                }
            })
            .catch((err) => {
                throw err;
            })
        return true;
    }catch(err){

        throw err;
    }
}

const deleteFieldValues = async(client, assistantUniqueName,fieldUniqueName) => {

    try{

        await client.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldUniqueName)
            .fieldValues
            .list()
            .then ( async (fieldValues) => {

                if(fieldValues.length){

                    for(let i = 0 ; i < fieldValues.length ; i ++){
                        
                        await client.autopilot
                            .assistants(assistantUniqueName)
                            .fieldTypes(fieldUniqueName)
                            .fieldValues(fieldValues[i].sid)
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
        return await true;
    }catch(err){

        throw err;
    }
}

const addFieldTypes = async (client, assistantUniqueName , schemaFieldTypes) => {

    try{

        if(schemaFieldTypes.length){

            await client.autopilot
                .assistants(assistantUniqueName)
                .fieldTypes
                .list()
                .then ( async (fieldTypes) => {

                if(fieldTypes.length){

                    for( let i = 0 ; i < schemaFieldTypes.length ; i ++){

                        const index = _.findIndex(fieldTypes, { uniqueName : schemaFieldTypes[i].uniqueName});

                        if(index < 0){

                            await client.autopilot
                            .assistants(assistantUniqueName)
                            .fieldTypes
                            .create({ uniqueName: schemaFieldTypes[i].uniqueName })
                            .then(result => {
                            })
                            .catch(err => {
                                throw err;
                            });
                        }
                    }
                }
                else{

                    for( let i = 0 ; i < schemaFieldTypes.length ; i ++){

                        await client.autopilot
                        .assistants(assistantUniqueName)
                        .fieldTypes
                        .create({ uniqueName: schemaFieldTypes[i].uniqueName })
                        .then(result => {
                        })
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
    deleteAllFieldTypes,
    deleteFieldTypes,
    addFieldTypes
}