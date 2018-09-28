const ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  try {
    const profile = args.profile || "default";
    const assistants = ta.listAssistants(profile)


  } catch (err) {
    //spinner.stop()
    
    console.error(err)
  }
}