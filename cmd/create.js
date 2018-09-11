const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {
  const spinner = ora().start('Creating assistant...')

  try {

    const assistant = await tag.createAssistantFully('../test/test_assistant.json')

    spinner.stop()

    console.log(`Assistant "${assistant.uniqueName}" was created`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}