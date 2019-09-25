const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('dfbackup')) {
    console.log(`The '--dfbackup' argument is required`);
    return;
  }
  if (!args.hasOwnProperty('dfagent')) {
    console.log(`The '--dfagent' argument is required`);
    return;
  }

  const dfbackup = args.dfbackup,
        name = args.dfagent,
        profile = args.credentials || "default",
        twilioClient = await require('../../lib/twilio-assistant/client')(profile);

  let fullPath = `${path.resolve()}/${dfbackup}`;

  const spinner = ora().start('Importing assistant...');

  try {

    const filename = await AutopilotCore.importDialogFlowAgent(fullPath, name);

    const dfbackupFulPath = path.resolve(process.cwd(),filename);

    let assistant = {};

    if(await AutopilotCore.existAssistant(dfbackupFulPath, twilioClient)){

      assistant = await AutopilotCore.updateAssistant(dfbackupFulPath, twilioClient);
    }else {

      assistant = await AutopilotCore.createAssistant(dfbackupFulPath, twilioClient);
    }

    spinner.stop();
    console.log(`Assistant "${assistant.uniqueName}" was imported`);
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}