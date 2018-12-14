
const ta = require('../lib/twilio-assistant');
const files = require('../lib/files');
const _ = require('lodash');
const inquirer = require('inquirer');
const ora = require('ora');



module.exports = async (args) => {

  let spinner = await ora().start(`Getting assistant List...\n`)

  try {

    const profile = args.credentials || "default"

    const client = await require('../lib/twilio-assistant/client')(profile),
          resource = await require('../lib/twilio-assistant/resource');


    await client.autopilot
    .assistants
    .list({ limit : resource.limit }).then((assistants) => {

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

                spinner = ora().start(`Exporting assistant...`);
                const assistant = await ta.exportAssistant(seletedAssistant,profile);
                await spinner.stop();
                console.log(`\nFile exported in ${assistant.filename}`);
                
            })
          }
        }
      }else{
        spinner.stop()
        console.log('no assistants.');
      }
      
    })

  } catch (err) {
    spinner.stop()
    
    console.error(`ERROR: ${err}`)
  }
}