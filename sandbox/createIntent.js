const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function createIntent(assistantIdentifier, assistantParams) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents
    .create(assistantParams);
}

const params = {
  uniqueName: 'another-new-intent'
};

createIntent('dabble-assistant', params)
  .then(result => {
    console.log(result.toJSON());
  })
  .catch(error => {
    console.log(error.message);
  })