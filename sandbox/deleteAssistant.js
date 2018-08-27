const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function deleteAssistant(assistantIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .remove()
    .then(result => {
      return result;
    });
}

deleteAssistant('dabble-assistant')
  .then(results => {
    console.log(results);
  })
  .catch(error => {
    console.log(error.message);
  })
  .done();