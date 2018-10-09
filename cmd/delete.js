const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`)
    return
  }

  const spinner = ora().start('Deleting assistant...')

  try {
    const sid = args.assistant,
          profile = args.profile || "default";

    const recovery_schema = await ta.exportAssistant(sid, profile, true);
    const result = await ta.deleteAssistantFully(sid,profile)

    spinner.stop()
    //TODO: maybe include name of deleted assistant
    console.log(`\nRemoved assistant with SID: ${args.assistant}`)

  } catch (err) {
    spinner.stop()
    
    console.error(`ERROR: ${err}`)
  }
}