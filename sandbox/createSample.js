const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function createSample(assistantIdentifier, intentIdentifier, sampleParams) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .samples
    .create(sampleParams);
}

const params = { language: 'en-US', taggedText: 'hello world' };

createSample('dabble-assistant', 'hello-world', params)
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err.message);
  })
  .done();