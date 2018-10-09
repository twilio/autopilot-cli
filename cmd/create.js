const path = require('path');
const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('schema')) {
    console.log(`The '--schema' argument is required`)
    return
  }

  const name = schema = args.schema,
    profile = args.profile || "default"

  let fullPath = `${path.resolve()}/${schema}` 

  const spinner = ora().start('Creating assistant...')

  try {

    const assistant = await ta.createAssistantFully(fullPath,profile)

    spinner.stop()   

    console.log(`Assistant "${assistant.uniqueName}" was created`)
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}