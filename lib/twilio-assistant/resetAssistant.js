const client = require('./client');

const resetAssistant = function (assistantIdentifier) {
  return Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .fetch()
    })

    //remove assistant actions
    .then(assistant => {
      let params = {
        initiationActions: { actions: [{ "say": { "speech": "Hello World!" } }] },
        fallbackActions: { actions: [{ "say": { "speech": "Hello World!" } }] }
      }

      return client.preview.understand
        .assistants(schema.assistantSid)
        .update(params)
    })

    //remove samples
    .then(assistant => {
      client.preview.understand
        .assistants(assistantIdentifier)
        .intents.each((task) => {

          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .samples
            .each((sample) => {
              client.preview.understand
                .assistants(assistantIdentifier)
                .intents(task.sid)
                .samples(sample.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message)
                })
            })
        });

      return assistant
    })

    //remove fields
    .then(assistant => {
      client.preview.understand
        .assistants(assistantIdentifier)
        .intents.each((task) => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .fields
            .each((field) => {
              client.preview.understand
                .assistants(assistantIdentifier)
                .intents(task.sid)
                .fields(field.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message);
                });
            })
        })

      return assistant
    })

    //remove custom field type values
    .then(async (assistant) => {

      if (assistant.hasOwnProperty('fieldTypes')) {
        await assistant.fieldTypes.each(fieldType => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .fieldTypes(fieldType.sid)
            .fieldValues
            .each(async fieldValues => {
              await client.preview.understand
                .assistants(assistantIdentifier)
                .fieldTypes(fieldType.sid)
                .fieldValues(fieldValues.sid)
                .remove()
                .catch((err) => {
                  //console.log(err.message, 'fieldValues');
                })
            })
        })
      }


      //remove custom field types
      if (assistant.hasOwnProperty('fieldTypes')) {
        await assistant.fieldTypes.each(async (fieldType) => {
          await client.preview.understand
            .assistants(assistant._solution.sid)
            .fieldTypes(fieldType.sid)
            .remove()
            .catch((err) => {
              //console.log(assistant._solution.sid, fieldType.sid);
              //console.log(err.message, 'fieldTypes');
            })
        })
      }

      return assistant;
    })

    //remove tasks
    .then(assistant => {
      if (assistant.hasOwnProperty('intents')) {
        assistant.intents.each((task) => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .intents(task.sid)
            .remove()
            .catch((err) => {
              //console.log(err.message);
            });
        });
      }

      //remove models
      if (assistant.hasOwnProperty('modelBuilds')) {
        assistant.modelBuilds.each((result) => {
          client.preview.understand
            .assistants(assistantIdentifier)
            .modelBuilds(result.sid)
            .remove()
            .catch((err) => {
              console.log(err.message);
              //deleteAssistantFully(assistantIdentifier);
            });
        });
      }

      return assistant;
    })

    // retry on error
    .catch(err => {
      console.log(err.message);
      this.resetAssistant(assistantIdentifier);
    })

}

module.exports = { resetAssistant };