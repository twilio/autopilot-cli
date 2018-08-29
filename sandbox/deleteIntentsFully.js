const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function deleteAllIntents(assistantIdentifier) {
  const asst = client.preview.understand
    .assistants(assistantIdentifier);

  asst.intents.each(async (result) => {
    //remove samples
    await client.preview.understand
      .assistants(assistantIdentifier)
      .intents(result.sid)
      .samples
      .each(async (sample) => {
        await client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .samples(sample.sid)
          .remove();
      })

    //remove fields
    await client.preview.understand
      .assistants(assistantIdentifier)
      .intents(result.sid)
      .fields
      .each(async (field) => {
        await client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .fields(field.sid)
          .remove();
      })
  });

  //remove intents
  asst.intents.each(async (result) => {
    await client.preview.understand
      .assistants(assistantIdentifier)
      .intents(result.sid)
      .remove()
      .catch((err) => {
        //return err;
        deleteIntents(assistantIdentifier);
      });
  });

  return asst;
}

deleteAllIntents('dabble-assistant')
  .then((results) => {
    console.log("done!");
  }).catch((err) => {
    console.log(err);

  });