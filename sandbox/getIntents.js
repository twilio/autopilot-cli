const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getIntents(assistantIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .intents;
}

getIntents('dabble-assistant')
  .each(intent => console.log(`${intent.sid}, ${intent.uniqueName}`));