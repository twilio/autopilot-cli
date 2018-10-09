
const ta = require('../lib/twilio-assistant');
const files = require('../lib/files');
const _ = require('lodash');
const inquirer = require('inquirer');
const ora = require('ora');



module.exports = async (args) => {

  const spinner = await ora().start(`Getting assistant List...\n`)

  try {

    const profile = args.profile || "default"

    const client = await require('../lib/twilio-assistant/client')(profile);


    await client.preview.understand
    .assistants
    .list().then((assistants) => {

      let choices = [];
      if(assistants.length){
        for (let i = 0; i < assistants.length; i++) {
          choices.push(assistants[i].uniqueName);
          if (i === assistants.length - 1) {
            spinner.stop();
            inquirer.prompt([
              {
                type: 'list',
                name: 'assistantName',
                message: 'Choose your assistant: ',
                choices: choices
              }
            ]).then(async (answer) => {
              let seletedAssistant = answer.assistantName
              
                spinner.text = `Exporting assistant...`;
                const assistant = await ta.exportAssistant(seletedAssistant,profile);
                console.log(`File exported in ${assistant.filename}`);
                await spinner.stop();
            })
          }
        }
      }else{
        console.log('no assistants.');
        spinner.stop()
      }
      
    })

  } catch (err) {
    spinner.stop()
    
    console.error(`ERROR: ${err}`)
  }
}