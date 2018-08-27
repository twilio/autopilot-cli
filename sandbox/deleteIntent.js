const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function deleteIntent(assistantIdentifier, intentIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .remove();
}

deleteIntent('dabble-assistant', 'hello-world')
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });