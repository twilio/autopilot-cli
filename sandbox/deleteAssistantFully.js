
const config = require('../config.js');
const twilio = require('twilio');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function deleteAssistantFully(assistantIdentifier) {

  return Promise.resolve()
    .then(_ => {
      // get the assistant
      return client.preview.understand
        .assistants(assistantIdentifier);
    })
    .then(assistant => {
      assistant.intents.each((intent) => {
        //remove samples
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(intent.sid)
          .samples
          .each((sample) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(intent.sid)
              .samples(sample.sid)
              .remove();
          })

        //remove fields
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(intent.sid)
          .fields
          .each((field) => {
            client.preview.understand
              .assistants(assistantIdentifier)
              .intents(intent.sid)
              .fields(field.sid)
              .remove();
          })
      });

      return assistant;
    })
    .then(async (assistant) => {

      //remove custom field type values
      await assistant.fieldTypes.each(fieldType => {
        client.preview.understand
          .assistants(assistant.sid)
          .fieldTypes(fieldType.sid)
          .fieldValues
          .each(async fieldValues => {
            //console.log(fieldValues.sid)
            await client.preview.understand
              .assistants(assistant.sid)
              .fieldTypes(fieldType.sid)
              .fieldValues(fieldValues.sid)
              .remove()
              .catch((err) => {
                //deleteAssistantFully(assistantIdentifier);
              });
          });
      });

      //remove custom field types
      await assistant.fieldTypes.each(async (fieldType) => {
        await client.preview.understand
          .assistants(assistant.sid)
          .fieldTypes(fieldType.sid)
          .remove()
          .catch((err) => {
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      return assistant;
    })
    .then(assistant => {
      //remove intents
      assistant.intents.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .remove()
          .catch((err) => {
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      //remove models
      assistant.modelBuilds.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .modelBuilds(result.sid)
          .remove()
          .catch((err) => {
            //deleteAssistantFully(assistantIdentifier);
          });
      });

      return assistant;
    })
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })
    .catch(err => {
      //console.log(err.message);
      deleteAssistantFully(assistantIdentifier);
    })
}

deleteAssistantFully('UA4000740588ecdbf6d1143d012844376e')
  .then((results) => {
    console.log("done!");
  }).catch((err) => {
    console.log(err.message);
  });