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
    import ............. import Dialogflow Agent Backup Zip File
    version ............ get package version
    help ............... get help menu for a command`,

  list: `  Usage:
    ta list <options>
  Options:
    --credentials, -c ...... [optional] credentials name`,

  create: `  Usage:
    ta create <options>
  Options:
    --schema, -s ........... Autopilot Schema File
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
    ta import <options>
  Options:
    --dfbackup ........... Dialogflow Agent Backup Zip File,
    --dfagent ........ Dialogflow Agent Name
    --credentials, -c ...... [optional] credentials name`,

  version: `  Usage:
    ta version `,
}

module.exports = (args) => {
  
  clear()

  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

    console.log(
      chalk.red(
        figlet.textSync('Twilio Autopilot', { horizontalLayout: 'full' })
      )
    )

    console.log(menus[subCmd] || menus.main)
}