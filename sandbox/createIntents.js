const config = require('../config.js');
const twilio = require('twilio');
const schema = require('../assistant.json');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function createIntents(assistantIdentifier, intentsArray) {
  for (const item of intentsArray) {
    await client.preview.understand
      .assistants(assistantIdentifier)
      .intents
      .create(item)
  }
}
const intents = [
  {
    uniqueName: "first-intent"
  },
  {
    uniqueName: "second-intent"
  },
  {
    uniqueName: "third-intent"
  },
  {
    uniqueName: "fourth-intent"
  },
  {
    uniqueName: "hello-world"
  }  
];


createIntents('dabble-assistant', intents)
  .then((result) => {
    console.log("done!")
  }).catch((err) => {
    console.log(err.message);
  });