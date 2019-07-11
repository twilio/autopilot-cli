const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

//TODO: finish the help screen
const menus = {
  main: `Twilio Autopilot CLI
  Usage:
    ta [command] <options>
    init ............... configure auth setting
    list ............... list existing assistants
    create ............. create a new assistant
    update ............. update an assistant
    delete ............. delete an assistant
    export ............. export assistant schema 
    import ............. import Dialogflow Agent Backup Zip/Alexa Interaction Model File
    simulate ........... sending a message to the custom channel endpoint
    field .............. bulk uploading field values
    version ............ get package version
    help ............... get help menu for a command`,

  list: `  Usage:
    ta list <options>
  Options:
    --credentials, -c ...... [optional] credentials name`,

  create: `  Usage:
    ta create <options>
  Options:
    --schema, -s ........... [option] Autopilot Schema File,
    --credentials, -c ...... [optional] credentials name`,

  update: `  Usage:
    ta update <options>
  Options:
    --schema, -s ........... Autopilot Schema File
    --credentials, -c ...... [optional] credentials name`,

  delete: `  Usage:
    ta delete <options>
  Options:
    --assistant, -a ........ Twilio Autopilot Assistant SID
    --credentials, -c ...... [optional] credentials name`,

  export: `  Usage:
    ta export <options>
  Options:
    --credentials, -c ...... [optional] credentials name`,

  import: `  Usage:
    ta import [command] <options>
  Options: 
    --help ................ output usage information
  Commands:
    alexa <options> ........ import alexa interaction model,
    dialogFlow <options> ... import dialogFlow agent backup zip`,

  dialogflow : ` Usage:
    ta import dialogflow <options>
  Options : 
      --dfbackup ............. Dialogflow Agent Backup Zip File,
      --dfagent .............. Dialogflow Agent Name,
      --credentials, -c ...... [optional] credentials name`,

  alexa : ` Usage:
    ta import alexa <options>
  Options : 
      --model ............. Alexa Interaction Model File,
      --redirectURL ....... [optional] Back-End Handler URL
      --credentials, -c ...... [optional] credentials name`,

  channel: `  Usage:
    ta simulate <options>
  Options:
    --assistant ............ Twilio Autopilot Assistant SID,
    --text ................. User text input, 
    --credentials, -c ...... [optional] credentials name`,

  field: `  Usage:
    ta channel <options>
  Options:
    --assistant ............ Twilio Autopilot Assistant SID,
    --field ................ field type SID,
    --csv .................. CSV file, 
    --credentials, -c ...... [optional] credentials name`,

  version: `  Usage:
    ta version `,
}

module.exports = (args) => {
  
  clear()

  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._.length === 2 ? args._[1] : args._[0]

    console.log(
      chalk.red(
        figlet.textSync('Twilio Autopilot', { horizontalLayout: 'full' })
      )
    )

    console.log(menus[subCmd] || menus.main)
}