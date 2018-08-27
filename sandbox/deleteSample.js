const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function deleteSample(assistantIdentifier, intentIdentifier, sampleSid) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .samples(sampleSid)
    .remove();
}

deleteSample('dabble-assistant', 'hello-world', 'UF04b6bef5c3dd07558796b98d7fe33eeb')
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });