const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (args.hasOwnProperty('credentials') && args.credentials === true) {
    console.log(`The '--credentials <credentials>' arguments are required`)
    return
  }

  try {
    
    ta.initConfig(args);

  } catch (err) {
    
    console.error(err)
  }
}