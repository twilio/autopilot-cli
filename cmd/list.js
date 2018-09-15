const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {
  const spinner = ora().start('Getting assistants...')

  try {

    const assistants = await ta.listAssistants()

    spinner.stop()

    assistants
      .each(assistants => {
        console.log(`${assistants.sid} ${assistants.uniqueName}`)
      });

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}