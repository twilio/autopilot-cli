const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function updateAssistant(assistantIdentifier, assistantParams) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .update(assistantParams)
    .then(assistant => {
      return assistant;
    });
}

const params = {
  friendlyName: 'dabble-assistant',
  uniqueName: 'dabble-assistant',
  logQueries: true
}

updateAssistant('dabble-assistant', params)
  .then(result => {
    console.log(result.toJSON())
  })
  .catch(error => {
    console.log(error.message);
  })
  .done();