const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const menus = {
  main: `Twilio Assistant Generator (TAG)
  Usage:
    tag [command] <options>
    init ............... configure auth setting
    list ............... list existing assistants
    create ............. create a new assistant
    update ............. update an assistant
    delete ............. delete an assistant
    export ............. export assistant schema 
    version ............ get package version
    help ............... get help menu for a command`,

  list: `  Usage:
    tag list <options>
  Options:
    --profile, -p ...... [optional] profile name`,

  create: `  Usage:
    tag create <options>
  Options:
    --template, -t ..... [optional] use a template
    --url, -u .......... [optional] template list url
    --profile, -p ...... [optional] profile name`,
}

module.exports = (args) => {
  
  clear()

  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

    console.log(
      chalk.red(
        figlet.textSync('TAG', { horizontalLayout: 'full' })
      )
    )

    console.log(menus[subCmd] || menus.main)
}