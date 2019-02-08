const path = require('path');
const ora = require('ora')
const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  const spinner = ora()

  try {

    let schema = args.schema || 'templates',
    profile = args.credentials || "default"
 
    let clonedAssistant = '';

    if(schema == 'templates'){

      let url = 'https://raw.githubusercontent.com/twilio/autopilot-templates/master/Assistants/templates.json';
      

      clonedAssistant = await ta.clone(url);

      schema = path.join(clonedAssistant, 'schema.json');

    }
    spinner.start('Creating assistant...');
    let fullPath = `${path.resolve()}/${schema}`

    const assistant = await ta.createAssistantFully(fullPath,profile)

    spinner.stop()   

    console.log(`Assistant "${assistant.uniqueName}" was created`);
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}