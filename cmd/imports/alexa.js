const path = require('path');
const ora = require('ora');
const ta = require('../../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('model')) {
    console.log(`The '--model' argument is required`)
    return
  }

  const model = args.model,
        redirectURL = args.redirectURL || 'https://inquisitive-stretch-2083.twil.io/generic',
        profile = args.credentials || "default";

  let fullPath = `${path.resolve()}/${model}` 

  const spinner = ora().start('Importing assistant...');

  try {

    let assistant = {};
    const filename = await ta.importAlexaAssistant(fullPath, redirectURL);
    const alexaFulPath = path.resolve(process.cwd(),filename);
    
    if(ta.existAssistantCheck(alexaFulPath,profile)){

      console.log(`Updating Assistant...`);
      assistant = await ta.updateAssistant(alexaFulPath,profile);
    }else{
      console.log(`Creating Assistant...`);
      assistant = await ta.createAssistantFully(alexaFulPath,profile);
    }
    
    spinner.stop();
    console.log(`Assistant "${assistant.uniqueName}" was imported`);
  }catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}
  