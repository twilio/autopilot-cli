const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getSamples(assistantIdentifier, intentIdentifier) {
  return client.preview.understand
  .assistants(assistantIdentifier)
  .intents(intentIdentifier)
  .samples;
}

getSamples('dabble-assistant', 'hello-world')
.each(sample => {
  console.log(`${sample.sid}, ${sample.taggedText}`);
})