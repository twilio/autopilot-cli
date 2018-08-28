const config = require('../config.js');
const twilio = require('twilio');
const schema = require('../assistant.json');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function createSamples(samplesArray) {
  for (const item of samplesArray) {
    await client.preview.understand
      .assistants('dabble-assistant')
      .intents('hello-world')
      .samples
      .create(item)
  }
}
const samples = [
  { language: 'en-US', taggedText: 'hi' },
  { language: 'en-US', taggedText: 'hey' },
  { language: 'en-US', taggedText: 'whats up' },
  { language: 'en-US', taggedText: 'how is it going' },
  { language: 'en-US', taggedText: 'what are you up to' }
];

createSamples(samples)
  .then((result) => {
    console.log("done!")
  }).catch((err) => {
    console.log(err.message);
  });