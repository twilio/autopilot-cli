const files = require('../files');
const _ = require('lodash');
const inquirer = require('inquirer');
const ora = require('ora')

const exportAssistant = async (profile) => {

  const client = await require('./client')(profile);

  const spinner = await ora().start(`Getting assistant List...\n`)

  await client.preview.understand
    .assistants
    .list().then((assistants) => {

      let choices = [];
      for (let i = 0; i < assistants.length; i++) {
        choices.push(assistants[i].uniqueName);
        if (i === assistants.length - 1) {
          spinner.stop();
          inquirer.prompt([
            {
              type: 'list',
              name: 'assistantName',
              message: 'Choose your assistant: ',
              choices: choices
            }
          ]).then(async (answer) => {
            let seletedAssistant = answer.assistantName

            const filename = await files.createAssistantJSONFile(seletedAssistant);
            const f_index = await _.findIndex(assistants, { uniqueName: seletedAssistant }),
              assistant = assistants[f_index];

            let sampleAssistant = {
              "sid": "",
              "friendlyName": "",
              "logQueries": true,
              "uniqueName": "",
              "fallbackActions": {},
              "initiationActions": {},
              "fieldTypes": [],
              "tasks": []
            };

            // get all assistants
            spinner.start('Exporting assistant...');
            return Promise.resolve()
              .then(async () => {

                // get field 
                spinner.text = 'Exporting assistant FieldTypes...'
                await client.preview.understand
                  .assistants(assistant.sid)
                  .fieldTypes
                  .each(async (fieldType) => {
                    sampleAssistant.sid = assistant.sid;
                    sampleAssistant.friendlyName = assistant.friendlyName;
                    sampleAssistant.uniqueName = assistant.uniqueName;
                    sampleAssistant.fieldTypes.push({
                      "sid": fieldType.sid,
                      "uniqueName": fieldType.uniqueName,
                      "values": []
                    });

                    // write json with assistant uniqueName, etc and field types
                    await files.writeAssistantJSONFile(sampleAssistant, filename);

                    spinner.text = 'Exporting assistant FallbackActions...'
                    // get fallback actions
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .assistantFallbackActions
                      .get()
                      .fetch()
                      .then((fallbackActions) => {
                        sampleAssistant.fallbackActions = fallbackActions.data;
                      })

                    // write json with fallback actions
                    await files.writeAssistantJSONFile(sampleAssistant, filename);

                    spinner.text = 'Exporting assistant InitiationkActions...'
                    // get initiation actions
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .assistantInitiationActions
                      .get()
                      .fetch()
                      .then((initiationActions) => {
                        sampleAssistant.initiationActions = initiationActions.data;
                      })

                    // write json with initiation actions
                    await files.writeAssistantJSONFile(sampleAssistant, filename);

                    spinner.text = 'Exporting assistant FieldValues...'
                    // get fieldValues of a field type
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .fieldTypes(fieldType.sid)
                      .fieldValues
                      .each(async (fieldValue) => {
                        const index = await _.findIndex(sampleAssistant.fieldTypes, { uniqueName: fieldType.uniqueName });
                        sampleAssistant.fieldTypes[index].values.push({
                          "sid": fieldValue.sid,
                          "language": fieldValue.language,
                          "value": fieldValue.value,
                          "synonymOf": fieldValue.synonymOf
                        })

                        // write field values of a field type
                        await files.writeAssistantJSONFile(sampleAssistant, filename);
                      });
                  });
                return assistant;
              })

              .then((assistant) => {

                spinner.text = 'Exporting assistant Intents...'
                // get assistant intents
                client.preview.understand
                  .assistants(assistant.sid)
                  .intents
                  .each(async (intent) => {
                    sampleAssistant.tasks.push({
                      "sid": intent.sid,
                      "uniqueName": intent.uniqueName,
                      "actions": {},
                      "fields": [],
                      "samples": []
                    })

                    // write intent
                    await files.writeAssistantJSONFile(sampleAssistant, filename);

                    spinner.text = 'Exporting intent Actions...'
                    // get intent action
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(intent.sid)
                      .intentActions
                      .get()
                      .fetch()
                      .then(async (intentAction) => {

                        const index = await _.findIndex(sampleAssistant.tasks, { uniqueName: intent.uniqueName });
                        sampleAssistant.tasks[index].actions = intentAction.data;
                      })

                    // write intent action
                    await files.writeAssistantJSONFile(sampleAssistant, filename);

                    spinner.text = 'Exporting intent Samples...'
                    // get intent samples
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(intent.sid)
                      .samples
                      .each(async (sample) => {
                        const index = await _.findIndex(sampleAssistant.tasks, { uniqueName: intent.uniqueName });
                        sampleAssistant.tasks[index].samples.push({
                          "sid": sample.sid,
                          "language": sample.language,
                          "taggedText": sample.taggedText
                        });

                        // write intent samples
                        await files.writeAssistantJSONFile(sampleAssistant, filename);
                      });

                    spinner.text = 'Exporting intent FieldTypes...'
                    // get intent fields
                    await client.preview.understand
                      .assistants(assistant.sid)
                      .intents(intent.sid)
                      .fields
                      .each(async (field) => {
                        const index = await _.findIndex(sampleAssistant.tasks, { uniqueName: intent.uniqueName });
                        sampleAssistant.tasks[index].fields.push({
                          "sid": field.sid,
                          "uniqueName": field.uniqueName,
                          "fieldType": field.fieldType
                        })

                        // write intent fields
                        await files.writeAssistantJSONFile(sampleAssistant, filename);
                      });
                  })
                spinner.stop();
                console.log(`Assistant "${assistant.uniqueName}" was exported in "${filename}" file.`);
                return assistant;
              })

              .catch((error) => {
                console.log(error);
              })
          })
        }
      }

    })
    .catch((error) => {
      console.log(`error in list ${error.message}`);
    });
}


module.exports = { exportAssistant };