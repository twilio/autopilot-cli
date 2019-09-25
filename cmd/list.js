const AutopilotCore = require('@dabblelab/autopilot-core'),
      ora = require('ora');

module.exports = async (args) => {

  const spinner = await ora().start('Getting assistants...\n');

  try {
    const profile = args.credentials || "default",
          twilioClient = await require('../lib/twilio-assistant/client')(profile);

    const assistants = await AutopilotCore.listAssistant(twilioClient);

    await spinner.stop();
    
    for( let i = 0 ; i < assistants.length ; i++){
        console.log(`${assistants[i].sid} ${assistants[i].uniqueName}`);
    }


  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}