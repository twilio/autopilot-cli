const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {
  const spinner = ora().start()

  try {

    //const assistant = await tag.getAssistants()

    spinner.stop()

    // assistants
    //   .each(assistants => {
    //     console.log(`${assistants.sid} ${assistants.uniqueName}`)
    //   });

    console.log(`This command is not implemented yet.`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}