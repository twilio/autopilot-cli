const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('schema')) {
    console.log(`The '--schema' argument is required`);
    return;
  }

  const spinner = ora().start('Updating assistant...');

  try {

    const schema = args.schema,
          profile = args.credentials || "default",
          twilioClient = await require('../lib/twilio-assistant/client')(profile);

    const fullPath = `${path.resolve()}/${schema}`; 

    const assistant = await AutopilotCore.updateAssistant(fullPath, twilioClient);
    
    spinner.stop();

    console.log(`\nAssistant "${assistant.uniqueName}" was updated`);

  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}