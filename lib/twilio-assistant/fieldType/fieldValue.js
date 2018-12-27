const deleteAllFieldTypes = async (client ,assistantSid) => {

    await client.autopilot.assistants(assistantSid)
              .fieldTypes
              .list()
              .then ( async (fieldTypes) => {

                if(fieldTypes.length){

                    for(let i = 0 ; i < fieldTypes.length ; i ++){
                        
                        await client.autopilot.assistants(assistantSid)
                            .fieldTypes(fieldTypes[i].sid)
                            .fieldValues
                            .list()
                            .then ( async (fieldValues) => {

                                if(fieldValues.length){

                                    for(let j = 0 ; j < fieldValues.length ; j ++){

                                        await client.autopilot
                                            .assistants(assistantSid)
                                            .fieldTypes(fieldTypes[i].sid)
                                            .fieldValues(fieldValues[j].sid)
                                            .remove()
                                            .catch((err) => {

                                                console.log(err.message);
                                            }); 
                                    }
                                }
                                
                            });

                        await client.autopilot
                            .assistants(assistantSid)
                            .fieldTypes(fieldTypes[i].sid)
                            .remove()
                            .catch((err) => {
                                console.log(err.message);
                            }); 
                    }
                }
              })                    
     return assistantSid;
}

const deleteFieldTypes = async (client, assistantSid, schemaFields) => {
    await client.autopilot
            .assistants(assistantSid)
            .fieldTypes
            .list()
            .then ( async (fieldTypes) => {

                if(fieldTypes.length){

                    for( let i = 0 ; i < fieldTypes.length ; i++ ){

                        const index = _.findIndex(schemaFields, { sid : fieldTypes[i].sid})

                        if(index >= 0){

                            await deleteFieldValues(client,assistantSid,fieldTypes[i].sid);
                        }else{

                            await deleteFieldValues(client,assistantSid,fieldTypes[i].sid);
                            await client.autopilot
                                .assistants(assistantSid)
                                .fieldTypes(fieldTypes[i].sid)
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
}

const deleteFieldValues = async(client, assistantSid,fieldSid) => {

    await client.autopilot
            .assistants(assistantSid)
            .fieldTypes(fieldSid)
            .fieldValues
            .list()
            .then ( async (fieldValues) => {

                if(fieldValues.length){

                    for(let i = 0 ; i < fieldValues.length ; i ++){
                        
                        await client.autopilot
                            .assistants(assistantSid)
                            .fieldTypes(fieldSid)
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
}

const addFieldTypes = async (client, assistantSid, fieldTypeSid , fieldValues) => {

    if(fieldValues.length){

        for( let i = 0 ; i < fieldValues.length ; i ++){

            await client.autopilot
                .assistants(assistantSid)
                .fieldTypes(fieldTypeSid)
                .fieldValues
                .create({ language: fieldValues[i].language, value: fieldValues[i].value, synonymOf: (fieldValues[i].synonymOf)?fieldValues[i].synonymOf:'' })
                .then(result => {
                })
                .catch(err => {
                    throw err;
                });

            if( i === fieldValues.length - 1){

                return assistantSid;
            }
        }

    }else{

        return assistantSid;
    }
}

module.exports = {
    deleteAllFieldTypes,
    deleteFieldTypes,
    addFieldTypes
}