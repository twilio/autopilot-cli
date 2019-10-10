const ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {
  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`);
    return;
  }

  const spinner = ora();

  try {

    const sid = args.assistant,
          profile = args.credentials || "default",
          twilioClient = await require('../lib/twilio-assistant/client')(profile);

    spinner.start('Deleting assistant...');
    await AutopilotCore.exportAssistant(sid, twilioClient, true);
    await AutopilotCore.deleteAssistant(sid, twilioClient);

    spinner.stop();
    console.log(`\nRemoved assistant with UniqueName: ${args.assistant}`);

    console.log(`\nRemoved assistant with UniqueName: ${args.assistant}`)
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
};