const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('schema')) {
    console.log(`The '--schema' argument is required`);
    return;
  }

  const spinner = ora();

  try {

    const schema = args.schema,
          profile = args.credentials || "default",
          assistantSid = args.assistant || false,
          twilioClient = await require('../lib/twilio-assistant/client')(profile);

    spinner.start('Updating assistant...');
    const fullPath = `${path.resolve()}/${schema}`; 

    const assistant = await AutopilotCore.updateAssistant(fullPath, twilioClient, assistantSid);
    
    spinner.stop();

    console.log(`\nAssistant "${assistant.uniqueName}" was updated`);

  } catch (err) {

    spinner.stop();
    console.log(err);
    console.error(`ERROR: ${err}`);
  }
}