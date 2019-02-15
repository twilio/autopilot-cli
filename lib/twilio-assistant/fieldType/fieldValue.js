const fs = require('fs'),
      parse = require('csv-parse'),
      util = require('util');

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

// Bulk Fields CLI Code
const addFieldValues = async(client, assistantUniqueName, fieldTypeUniqueName, csvFile) => {

    try{

        await client.autopilot
        .assistants(assistantUniqueName)
        .fieldTypes(fieldTypeUniqueName)
        .fetch().then( async ( fieldTypes ) => {

            await deleteFieldValues(client, assistantUniqueName, fieldTypes.uniqueName);
            const fieldValuesJSON = await getFieldValuesFromCSV(csvFile);

            await field_value_add(client, assistantUniqueName, fieldTypes.uniqueName, fieldValuesJSON);

            return assistantUniqueName;
        }).catch(async ( error ) => {

            if(error.status == 404){
                console.log(`Code : ${fieldTypeUniqueName}`)

                await client.autopilot
                    .assistants(assistantUniqueName)
                    .fieldTypes
                    .create({ uniqueName: fieldTypeUniqueName })
                    .then( async (result) => {

                        const fieldValuesJSON = await getFieldValuesFromCSV(csvFile);
                        await field_value_add(client, assistantUniqueName, result.uniqueName, fieldValuesJSON);

                        return assistantUniqueName;
                    })
                    .catch(err => {
                        throw err;
                    });
            }
            else{

                throw error;
            }
        })

    }catch(err){

        throw err;
    }
}

const field_value_add = async(client, assistantUniqueName, fieldTypeUniqueName, fieldValuesJSON) => {

    if(fieldValuesJSON.length){

        for( let i = 0 ; i < fieldValuesJSON.length ; i ++){

            //console.log(fieldValuesJSON[i]);
            await client.autopilot
                .assistants(assistantUniqueName)
                .fieldTypes(fieldTypeUniqueName)
                .fieldValues
                .create(fieldValuesJSON[i])
                .catch((error) => {

                    if(error.status != 409){

                        console.log(error);
                        throw error;
                    }
                    
                })
        }
    }
    return assistantUniqueName;
}

const getFieldValuesFromCSV = async(csvFile) => {

    const readFile = util.promisify(fs.readFile),
          parser = util.promisify(parse);

    try{

        return readFile(csvFile)
        .then( async (data) => {

            return parser(data, {
                trim: true,
                skip_empty_lines: true
            })
            .then((parsedData) => {
        
                let fieldValues = [];
                if(parsedData.length){

                    for( let i = 0 ; i < parsedData.length ; i ++){

                        const fldvl = parsedData[i].filter(Boolean);
                        if(fldvl.length){

                            let synonymOf = '';
                            for(let j = 0 ; j < fldvl.length ; j ++){

                                if(j == 0){

                                    fieldValues.push({
                                        "language": "en-US",
                                        "value": fldvl[j].trim(),
                                        "synonymOf": synonymOf
                                    });

                                    synonymOf = fldvl[j].trim();
                                }else{

                                    fieldValues.push({
                                        "language": "en-US",
                                        "value": fldvl[j].trim(),
                                        "synonymOf": synonymOf
                                    });
                                }
                                
                            }                            
                        }
                    }
                }
                //console.log(fieldValues);
                return fieldValues;
            })
            .catch((err) => {
        
                throw err;
            })
        })
        .catch((err) => {

            throw err;
        })
    }catch(err){

        throw err;
    }
    
}

module.exports = {
    deleteAllFieldTypes,
    deleteFieldTypes,
    addFieldTypes,
    addFieldValues
}