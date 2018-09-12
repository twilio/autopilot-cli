const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {
  const spinner = ora().start()

  try {

    const sid = args.assistant

    spinner.stop()

    //TODO: finish the export command

    console.log(`This command is not implemented yet.`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}