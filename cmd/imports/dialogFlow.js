const path = require('path');
const ora = require('ora')
const ta = require('../../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('dfbackup')) {
    console.log(`The '--dfbackup' argument is required`)
    return
  }
  if (!args.hasOwnProperty('dfagent')) {
    console.log(`The '--dfagent' argument is required`)
    return
  }

  const dfbackup = args.dfbackup,
    name = args.dfagent,
    profile = args.credentials || "default";

  let fullPath = `${path.resolve()}/${dfbackup}` 

  const spinner = ora().start('Importing assistant...')

  try {

    const filename = await ta.importAssistant(fullPath, name);

    const dfbackupFulPath = path.resolve(process.cwd(),filename);
    
    const assistant = await ta.createAssistantFully(dfbackupFulPath,profile)


    spinner.stop()   

    console.log(`Assistant "${assistant.uniqueName}" was imported`)
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}