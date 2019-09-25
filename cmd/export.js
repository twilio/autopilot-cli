const AutopilotCore = require('@dabblelab/autopilot-core'),
      inquirer = require('inquirer'),
      ora = require('ora');

module.exports = async (args) => {

  let spinner = await ora().start(`Getting assistant List...\n`);

  try {

    const profile = args.credentials || "default",
          twilioClient = await require('../lib/twilio-assistant/client')(profile);


    const fullData = await AutopilotCore.listAssistant(twilioClient);
    if(fullData.length){

      const choices = await fullData.map(x => {return x.uniqueName});
      spinner.stop();

      inquirer.prompt([
        {
          type: 'list',
          name: 'assistantName',
          message: 'Choose your assistant: ',
          choices: choices
        }
      ]).then(async (answer) => {
        
        let seletedAssistant = answer.assistantName;

        spinner = ora().start(`Exporting assistant1...`);

        const assistant = await AutopilotCore.exportAssistant(seletedAssistant, twilioClient);

        spinner.stop();
        console.log(`\nFile exported in ${assistant.filename}`);
          
      })
    }else{

      spinner.stop();
      console.log('no assistants.');
    }

  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}