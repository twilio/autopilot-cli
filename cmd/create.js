const path = require('path'),
      ora = require('ora'),
      AutopilotCore = require('@dabblelab/autopilot-core');

module.exports = async (args) => {

  const spinner = ora();

  try {

    let schema = args.schema || 'templates',
        profile = args.credentials || "default"
 
    let clonedAssistant = '';

    if(schema == 'templates'){

      let url = 'https://raw.githubusercontent.com/twilio/autopilot-templates/master/Assistants/templates.json';
      
      clonedAssistant = await AutopilotCore.cloneTemplate(url);

      schema = path.join(clonedAssistant, 'schema.json');

    }

    let fullPath = `${path.resolve()}/${schema}`,
        twilioClient = await require('../lib/twilio-assistant/client')(profile);

    spinner.start('Creating assistant...');

    const assistant = await AutopilotCore.createAssistant(fullPath, twilioClient);

    spinner.stop();   
    console.log(`Assistant "${assistant.uniqueName}" was created`);
    
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}