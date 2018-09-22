const ora = require('ora')
const tag = require('../lib/tag');
const files = require('../lib/files');

module.exports = async (args) => {
  const spinner = ora().start('Exporting assistant...')

  try {

    const sid = args.assistant
    //console.log(sid);
    //const assistant = await tag.exportAssistant(sid);
    const filename = await files.createAssistantJSONFile(sid);
    const assistant = await tag.exportAssistant(sid,filename);

    spinner.stop()

    console.log(`File exported in ${filename}`);

    //TODO: finish the export command
    //console.log(assistant);

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}