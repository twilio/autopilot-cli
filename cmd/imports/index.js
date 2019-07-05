const minimist = require('minimist')
const error = require('../../lib/error')

module.exports = () => {

  //TODO: check to see if CLI is configured
  
  const args = minimist(process.argv.slice(2))

  let cmd = args._[1] || 'dialogFlow'

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {

    case 'dialogFlow':
      require('./dialogFlow')(args)
      break

    case 'alexa':
      require('./alexa')(args)
      break

    case 'help':
      require('./cmd/help')(args)
      break

    default:
      error(`"${cmd}" is not a valid command!`, true)
      break
  }
}