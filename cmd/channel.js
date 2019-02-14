const path = require('path'),
      ora = require('ora'),
      prettyJSONStringify = require('pretty-json-stringify'),
      ta = require('../lib/twilio-assistant');

module.exports = async (args) => {

  if (!args.hasOwnProperty('assistant')) {
    console.log(`The '--assistant' argument is required`)
    return
  }
  if (!args.hasOwnProperty('text')) {
    console.log(`The '--text' argument is required`)
    return
  }
  if (!args.hasOwnProperty('channel')) {
    console.log(`The '--channel' argument is required`)
    return
  }

  const assistantSid = args.assistant,
        text = args.text,
        channel = args.channel,
        profile = args.credentials || "default";
 
  const spinner = ora().start('Sending text to channel...')

  try {

    const channelResponse = await ta.customChannel(assistantSid, channel, text, profile);


    spinner.stop()   

    console.log(`Channel response\n`)
    console.log(prettyJSONStringify(channelResponse))
    
  } catch (err) {
    spinner.stop()

    console.error(`ERROR: ${err}`)
  }
}