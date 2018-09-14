const ora = require('ora')
const tag = require('../lib/tag');

module.exports = async (args) => {

  if (!args.hasOwnProperty('account') && !args.hasOwnProperty('token')) {
    console.log(`The '--account' and '--token' arguments are required`)
    return
  }

  const spinner = ora().start()

  try {

    const sid = args.account,
          token = args.token,
          profile = args.profile

    spinner.stop()

    //TODO: implement init command

    console.log(`This command is not implemented yet.`)

  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}