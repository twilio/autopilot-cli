const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {
  const spinner = ora().start('Creating assistant...')

  try {
    
    const name = args.name || "default assistant",
          schema = args.schema,
          template = args.template,
          url = args.url || "https://github.com/tingiris/", //TODO: template url should not be hard coded 
          profile = args.profile || "default"

    const assistant = await tag.createAssistant(name)

    spinner.stop()

    console.log(`Assistant "${assistant.uniqueName}" was created`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}