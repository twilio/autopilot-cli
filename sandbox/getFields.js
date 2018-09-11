const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getFields(assistantIdentifier, intentIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .fields;
}

getFields('UA8b0cf0e2f502c7ec7a4a20bdfd9c980f', 'make-appointment')
  .each(field => {
    console.log(`${field.sid}, ${field.uniqueName}`);
  })