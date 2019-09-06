const ora = require('ora');
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {
  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`);
    return;
  }

  const spinner = ora().start('Deleting assistant...');

  try {
    const sid = encodeURIComponent(args.assistant);
    const profile = args.credentials || 'default';

    // const recovery_schema = await ta.exportAssistant(sid, profile, true);
    const result = await ta.deleteAssistantFully(sid, profile);

    spinner.stop();

    console.log(`\nRemoved assistant with UniqueName: ${args.assistant}`)
  } catch (err) {
    spinner.stop();
    
    console.error(`ERROR: ${err}`)
  }
};