const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function createAssistant(assistantParams) {
  return client.preview.understand
    .assistants
    .create(params)
    .then(assistant => {
      return assistant;
    });
}

// set params for assistant here
const params = {
  friendlyName: 'dabble-assistant',
  uniqueName: 'dabble-assistant',
  logQueries: true
}

createAssistant(params)
  .then(result => {
    console.log(result.toJSON())
  })
  .catch(error => {
    console.log(error.message);
  })