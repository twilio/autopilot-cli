const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function deleteField(assistantIdentifier, intentIdentifier, fieldIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .fields(fieldIdentifier)
    .remove();
}

deleteField('dabble-assistant', 'another-new-intent', 'FirstName')
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });