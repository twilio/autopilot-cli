
const config = require('../config.js');
const twilio = require('twilio');
const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

async function deleteAssistantFully(assistantIdentifier) {

  return Promise.resolve()
    .then(() => {
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
              .remove()
              .catch((err) =>{
                 //console.log(err.message);
              });
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
              .remove()
              .catch((err) =>{
                //console.log(err.message);
             });
          })
      });

      return assistant;
    })
    .then(async (assistant) => {
      //remove custom field type values
      await assistant.fieldTypes.each(fieldType => {
        client.preview.understand
          .assistants(assistant._solution.sid)
          .fieldTypes(fieldType.sid)
          .fieldValues
          .each(async fieldValues => {
            await client.preview.understand
              .assistants(assistant._solution.sid)
              .fieldTypes(fieldType.sid)
              .fieldValues(fieldValues.sid)
              .remove()
              .catch((err) => {
                //console.log(err.message,'fieldValues');
                //deleteAssistantFully(assistantIdentifier);
              });
          });
      });

      //remove custom field types
      await assistant.fieldTypes.each(async (fieldType) => {
        await client.preview.understand
          .assistants(assistant._solution.sid)
          .fieldTypes(fieldType.sid)
          .remove()
          .catch((err) => {
            //console.log(assistant._solution.sid,fieldType.sid);
            //console.log(err.message,'fieldTypes');
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
            //console.log(err.message);
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
            //console.log(err.message);
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
    .then(() => {
      return "done!";
    })
}

deleteAssistantFully('UA57bc6111d6d159fa9d827cfd5a34bc7d')
  .then((results) => {
    console.log(`result: ${result}`);
  }).catch((err) => {
    console.log(err.message);
  });
