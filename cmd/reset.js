const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`)
    return
  }
  const spinner = ora().start()

  try {
    const sid = args.assistant

    const result = await ta.resetAssistant(sid)

    spinner.stop()
    //TODO: maybe include name of deleted assistant
    console.log(`Reset assistant with SID: ${args.assistant}`)

  } catch (err) {
    spinner.stop()
    
    console.error(`ERROR: ${err}`)
  }
}