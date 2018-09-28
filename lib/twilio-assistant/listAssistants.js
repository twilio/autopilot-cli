const ora = require('ora');


const listAssistants = async (profile) => {
  const client = await require('./client')(profile);

  const spinner = await ora().start('Getting assistants...')

  await client.preview.understand
    .assistants
    .each( (assistant) => {
        spinner.stop();
        console.log(`${assistant.sid} ${assistant.uniqueName}`)
    })
}

module.exports = {listAssistants};