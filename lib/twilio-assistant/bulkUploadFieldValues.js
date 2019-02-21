
const bulkUploadFieldValues = async (assistantSid, fieldUniqueName, csvFile, profile) => {

  const fs = require('fs'),
        client = await require('./client')(profile),
        fieldValue = require('./fieldType/fieldValue');

  if (!fs.existsSync(csvFile)) {

    throw new Error(`The file ${csvFile} was not be found.`)
  }

  return await Promise.resolve()

    
    
    //assistant info
    .then ( async () => {

      return client.autopilot
        .assistants(assistantSid)
        .fetch().then((assistant) => {

          return assistant;
        })
    })

    .then( async (assistant) => {

      await fieldValue.addFieldValues(client, assistant.uniqueName, fieldUniqueName, csvFile)
      return assistant;
    })

    .catch(err => {
      throw err;
    })

}

module.exports = { bulkUploadFieldValues };