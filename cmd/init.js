const ora = require('ora');
const inquirer = require('inquirer');

const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (args.hasOwnProperty('credentials') && args.credentials === true) {
    console.log(`The '--credentials <credentials>' arguments are required`)
    return
  }
  const spinner = ora().start()

  try {
    
    ta.initConfig(args);

    spinner.stop()

    //TODO: implement init command


  } catch (err) {
    spinner.stop()
    
    console.error(err)
  }
}