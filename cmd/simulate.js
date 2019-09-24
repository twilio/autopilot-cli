const ora = require('ora'),
      prettyJSONStringify = require('pretty-json-stringify'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`);
    return
  }
  if (!args.hasOwnProperty('text')) {
    console.log(`The '--text' argument is required`);
    return
  }

  const assistantSid = args.assistant,
        text = args.text,
        channel = 'cli',
        profile = args.credentials || "default",
        twilioClient = await require('../lib/twilio-assistant/client')(profile);
 
  const spinner = ora().start('Sending text to channel...');

  try {

    const channelResponse = await AutopilotCore.customChannel(assistantSid, channel, text, twilioClient);

    spinner.stop();
    console.log(`Channel response\n`);
    console.log(prettyJSONStringify(channelResponse));
    
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}