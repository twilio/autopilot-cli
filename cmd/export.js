
const ta = require('../lib/twilio-assistant');
const files = require('../lib/files');
const _ = require('lodash');
const inquirer = require('inquirer');
const ora = require('ora');



module.exports = async (args) => {

  const spinner = await ora().start(`Getting assistant List...\n`)

  try {

    //const sid = args.assistant
    //console.log(sid);
    //const assistant = await ta.exportAssistant(sid);
    //const filename = await files.createAssistantJSONFile(sid);
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
  
              //const f_index = await _.findIndex(assistants, { uniqueName: seletedAssistant }),
                //sel_assistant = assistants[f_index];
              
                const assistant = await ta.exportAssistant(seletedAssistant,profile);
                console.log(`File exported in ${assistant.filename}`);
            })
          }
        }
      }else{
        console.log('no assistants.');
        spinner.stop()
      }
      
    })

    //console.log(`File exported in ${filename}`);

    //TODO: finish the export command
    //console.log(assistant);

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}