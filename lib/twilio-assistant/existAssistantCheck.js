
const existAssistantCheck = async (modelPath, profile) => {

    const client = await require('./client')(profile),
          fs = require('fs');

    if (!fs.existsSync(modelPath)) {

        throw new Error(`The file ${modelPath} was not be found.`)
    }
    
    const schema = require(modelPath);

    if (!schema.hasOwnProperty('friendlyName') && !schema.hasOwnProperty('uniqueName')) {

        throw new Error(`A 'friendlyName' and/or 'uniqueName' must be defined in your schema.`)
    }


    return client.autopilot
            .assistants(schema.uniqueName)
            .fetch().then((assistant) => {

              return true;
            })
            .catch((error) => {

                if(error.code === 20404){

                    return false;
                }else{

                    throw error;
                }
            })
    
}

module.exports = {existAssistantCheck};