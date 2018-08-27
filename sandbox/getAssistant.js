const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getAssistant(assistantIdentifier) {
  return client.preview.understand
    .assistants(assistantId)
    .fetch()
    .then(assistant => {
      return assistant;
    });
}

getAssistant('sandbox-assistant')
  .then(result => {
    console.log(result.toJSON())
  })
  .done();
