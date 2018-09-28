const ora = require('ora');


const listAssistants = function (profile) {
  const client = require('./client')(profile);

  const spinner = ora().start('Getting assistants...')

  client.preview.understand
    .assistants
    .each( (assistant) => {
        spinner.stop();
        console.log(`${assistant.sid} ${assistant.uniqueName}`)
    })
}

module.exports = {listAssistants};