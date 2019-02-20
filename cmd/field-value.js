const path = require('path'),
      ora = require('ora'),
      prettyJSONStringify = require('pretty-json-stringify'),
      ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`)
    return
  }
  if (!args.hasOwnProperty('field')) {
    console.log(`The '--field' argument is required`)
    return
  }
  if (!args.hasOwnProperty('csv')) {
    console.log(`The '--csv' argument is required`)
    return
  }

  const assistantSid = args.assistant,
        fieldUniqueName = args.field,
        csvPath = args.csv,
        profile = args.credentials || "default";

  let fullPath = `${path.resolve()}/${csvPath}` 
 
  const spinner = ora().start('Adding field values...')

  try {

    const assistant = await ta.bulkUploadFieldValues(assistantSid, fieldUniqueName, csvPath, profile);


    spinner.stop()   

    console.log(`Field values added to the assistant '${assistant.uniqueName}'`);
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}