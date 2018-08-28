const config = require('../config.js');
const twilio = require('twilio');
const schema = require('../assistant.json');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function deleteSamples(assistantIdentifier, intentIdentifier) {
  const samples = await client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .samples;

  return samples.each(async (result) => {
    await client.preview.understand
      .assistants(assistantIdentifier)
      .intents(intentIdentifier)
      .samples(result.sid)
      .remove();
  });
}

deleteSamples('dabble-assistant', 'hello-world')
  .then((result) => {
    console.log("done!");
  }).catch((err) => {
    console.log(err);

  });;