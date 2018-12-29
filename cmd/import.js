const path = require('path');
const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('schema')) {
    console.log(`The '--schema' argument is required`)
    return
  }
  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`)
    return
  }

  const schema = args.schema,
    name = args.assistant,
    profile = args.credentials || "default";

  let fullPath = `${path.resolve()}/${schema}` 

  const spinner = ora().start('Importing assistant...')

  try {

    const filename = await ta.importAssistant(fullPath, name);

    const schemaFulPath = path.resolve(process.cwd(),filename);
    
    const assistant = await ta.createAssistantFully(schemaFulPath,profile)


    spinner.stop()   

    console.log(`Assistant "${assistant.uniqueName}" was imported`)
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}