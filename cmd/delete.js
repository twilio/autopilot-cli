const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {
  const spinner = ora().start()

  try {
    const sid = args.assistant

    const result = await tag.deleteAssistantFully(sid)

    spinner.stop()
    //TODO: maybe include name of deleted assistant
    console.log(`Removed assistant with SID: ${args.assistant}`)

  } catch (err) {
    spinner.stop()
    
    console.error(`ERROR: ${err}`)
  }
}