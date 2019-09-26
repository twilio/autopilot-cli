const AutopilotCore = require('@dabblelab/autopilot-core'),
      inquirer = require('inquirer'),
      ora = require('ora');

module.exports = async (args) => {

  const spinner = await ora();
  let seletedAssistant = '';

  try {

    const profile = args.credentials || "default",
          assistantSid = args.assistant || '', 
          twilioClient = await require('../lib/twilio-assistant/client')(profile);

    if(assistantSid){

      seletedAssistant = assistantSid;
    }else{

      spinner.start(`Getting assistant List...\n`);

      const fullData = await AutopilotCore.listAssistant(twilioClient);
      spinner.stop();

      if(fullData.length){

        const choices = await fullData.map(x => {return x.uniqueName});

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'assistantName',
            message: 'Choose your assistant: ',
            choices: choices
          }
        ]);

        seletedAssistant = answer.assistantName;
      }else{

        console.log('no assistants.');
        return;
      }
    }

    spinner.start(`Exporting assistant...`);

    const assistant = await AutopilotCore.exportAssistant(seletedAssistant, twilioClient);

    spinner.stop();
    console.log(`\nAssistant exported in ${assistant.filename}`);
  } catch (err) {

    spinner.stop();
    console.error(`ERROR: ${err}`);
  }
}