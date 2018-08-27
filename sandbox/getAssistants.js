const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getAssistants() {
  return client.preview.understand
  .assistants;
}

getAssistants()
  .each(assistants => {
    console.log(`${assistants.sid}, ${assistants.uniqueName}`)
  });