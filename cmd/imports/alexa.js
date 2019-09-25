const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('model')) {
    console.log(`The '--model' argument is required`);
    return;
  }

  const model = args.model,
        redirectURL = args.redirectURL || 'https://inquisitive-stretch-2083.twil.io/generic',
        profile = args.credentials || "default",
        twilioClient = await require('../../lib/twilio-assistant/client')(profile);

  let fullPath = `${path.resolve()}/${model}`;

  const spinner = ora().start('Importing assistant...');

  try {

    let assistant = {};
    const filename = await AutopilotCore.importAlexaModel(fullPath, redirectURL);
    const alexaFulPath = path.resolve(process.cwd(),filename);

    if(await AutopilotCore.existAssistant(alexaFulPath, twilioClient)){

      assistant = await AutopilotCore.updateAssistant(alexaFulPath, twilioClient);
    }else {

      assistant = await AutopilotCore.createAssistant(alexaFulPath, twilioClient);
    }
    
    spinner.stop();
    console.log(`Assistant "${assistant.uniqueName}" was imported`);
  }catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}
  