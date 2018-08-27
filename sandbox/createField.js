const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function createField(assistantIdentifier, intentIdentifier, fieldParams) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents(intentIdentifier)
    .fields
    .create(fieldParams);
}

const params = { fieldType: 'Twilio.FIRST_NAME', uniqueName: 'FirstName' };

createField('dabble-assistant', 'hello-world', params)
  .then((result) => {
    console.log(result);

  }).catch((err) => {
    console.log(err);
  })
  .done();