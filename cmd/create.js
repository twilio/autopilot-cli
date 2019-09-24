const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  const spinner = ora()

  try {

    let schema = args.schema || 'templates',
        profile = args.credentials || "default"
 
    let clonedAssistant = '';

    if(schema == 'templates'){

      let url = 'https://raw.githubusercontent.com/twilio/autopilot-templates/master/Assistants/templates.json';
      

      // clonedAssistant = await ta.clone(url);
      clonedAssistant = await AutopilotCore.cloneTemplate(url);

      schema = path.join(clonedAssistant, 'schema.json');

    }

    spinner.start('Creating assistant...');

    let fullPath = `${path.resolve()}/${schema}`,
        twilioClient = await require('../lib/twilio-assistant/client')(profile);

    const assistant = await AutopilotCore.createAssistant(fullPath, twilioClient);

    spinner.stop();   
    console.log(`Assistant "${assistant.uniqueName}" was created`);
    
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}