const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getFields(assistantIdentifier, intentIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .fields;
}

getFields('dabble-assistant', 'another-new-intent')
  .each(field => {
    console.log(`${field.sid}, ${field.uniqueName}`);
  })