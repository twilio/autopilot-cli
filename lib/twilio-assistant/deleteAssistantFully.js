//const client = require('./client');
const ora = require('ora');

const deleteAssistantFully = async (assistantIdentifier,profile) => {

  const client = await require('./client')(profile);
  const spinner = await ora().start('Deleting assistant...')

  return await Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier);
    })

    //remove samples
    .then(assistant => {
      assistant.intents.each((task) => {

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
                //console.log(err.message);
              });
          })
      });

      return assistant;
    })

    //remove fields
    .then(assistant => {
      assistant.intents.each((task) => {
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

      return assistant;
    })

    //remove custom field type values
    .then(async (assistant) => {

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
                //console.log(err.message, 'fieldValues');
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
            //console.log(err.message, 'fieldTypes');
          });
      });

      return assistant;
    })

    //remove tasks
    .then(assistant => {

      assistant.intents.each((result) => {
        client.preview.understand
          .assistants(assistantIdentifier)
          .intents(result.sid)
          .remove()
          .catch((err) => {
            //console.log(err.message);
          });
      });

      //remove models
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

      return assistant;
    })

    //remove assistant
    .then((assistant) => {
      spinner.stop();
      return client.preview.understand
        .assistants(assistantIdentifier)
        .remove();
    })

    // retry on error
    .catch(err => {
      //console.log(err.message);
      spinner.stop();
        deleteAssistantFully(assistantIdentifier,profile);
    })

}

module.exports = { deleteAssistantFully };