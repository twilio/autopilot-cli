const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`);
    return;
  }
  if (!args.hasOwnProperty('field')) {
    console.log(`The '--field' argument is required`);
    return;
  }
  if (!args.hasOwnProperty('csv')) {
    console.log(`The '--csv' argument is required`);
    return;
  }

  const assistantSid = args.assistant,
        fieldUniqueName = args.field,
        csvPath = args.csv,
        profile = args.credentials || "default",
        twilioClient = await require('../lib/twilio-assistant/client')(profile);

  let fullPath = `${path.resolve()}/${csvPath}`;
 
  const spinner = ora().start('Adding field values...');

  try {

    const assistant = await AutopilotCore.bulkUploadFieldValues(assistantSid, fieldUniqueName, csvPath, twilioClient);

    spinner.stop();
    console.log(`Field values added to the assistant '${assistant.uniqueName}'`);
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}