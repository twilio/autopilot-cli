const path = require('path');
const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {

  if (!args.hasOwnProperty('schema')) {
    console.log(`The '--schema' argument is required`)
    return
  }

  const name = schema = args.schema,
    profile = args.profile || "default"

  let fullPath = `${path.resolve()}/${schema}` 

  const spinner = ora().start()

  try {

    const schema = args.schema

    const assistant = await tag.updateAssistant(fullPath)

    spinner.stop()   

    console.log(`Assistant "${assistant.uniqueName}" was updated`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}