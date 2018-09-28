const ora = require('ora')
const files = require('../lib/files')

module.exports = async (args) => {
  const spinner = ora().start('Getting assistants...')

  try {

    //get args here
    const schema = args.schema,
          profile = args.profile || "default";

    const schemaPath = `${files.getCurrentDirectoryBase()}/${schema}`

    //const pathExists = files.fileExists(schema)

    spinner.stop()

    if (!files.fileExists(schema)) {
      console.log(`The file '${schema}' can't be found.`)
      return
    }
    //do work here
    console.log(`Hello from the temp command. The schema path is ${schemaPath} and exists = ${pathExists}` )

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}