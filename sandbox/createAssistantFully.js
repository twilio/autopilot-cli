const schema = require('./owl-health-assistant.json');

const twilio = require('twilio');
const config = require('../config');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function createAssistantFully() {

  return Promise.resolve()
    .then(() => {
      //create new assistant
      return client.preview.understand
        .assistants
        .create({
          friendlyName: schema.uniqueName,
          uniqueName: schema.uniqueName,
          logQueries: true
        });
    })
    .catch((err) => {
      if (err.message.includes("UniqueName already in use")) {
        return client.preview.understand
          .assistants
          .create({
            friendlyName: `${schema.uniqueName}-${Date.now()}`,
            uniqueName: `${schema.uniqueName}-${Date.now()}`,
            logQueries: true
          });
      }
    })
    .then((assistant) => {
      //add intents to assistant
      console.log(`created assistant: ${assistant.uniqueName}`);

      for (let intent of schema.intents) {
        client.preview.understand
          .assistants(assistant.uniqueName)
          .intents
          .create({ uniqueName: intent.uniqueName });

        console.log(`Added intent: ${intent.uniqueName}`);
      }

      return assistant;
    })
    .then(async (assistant) => {
      //add custom fields to assistant
      for (let fieldType of schema.fieldTypes) {
        await client.preview.understand
          .assistants(assistant.uniqueName)
          .fieldTypes
          .create({ uniqueName: fieldType.uniqueName });

        for (let value of fieldType.values) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .fieldTypes(fieldType.uniqueName)
            .fieldValues
            .create({ language: value.language, value: value.value, synonymOf: value.synonymOf });
        }
      }

      return assistant;
    })
    .then(async (assistant) => {
      //add fields to intents
      for (let intent of schema.intents) {
        for (let field of intent.fields) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .fields
            .create({ fieldType: field.fieldType, uniqueName: field.uniqueName });

          console.log(`Added field: ${field.uniqueName} to ${intent.uniqueName} intent`);
        }
      }

      return assistant;
    })
    .then((assistant) => {
      //add samples
      for (let intent of schema.intents) {
        for (let sample of intent.samples) {
          await client.preview.understand
            .assistants(assistant.uniqueName)
            .intents(intent.uniqueName)
            .samples
            .create({ language: sample.language, taggedText: sample.taggedText });

          console.log(`Added sample: ${sample.taggedText} to ${intent.uniqueName} intent`);
        }
      }
      return assistant;
    })
    .then((assistant) => {
      //remove 'hello-world' intent and initial modelBuild
      return deleteHelloWorldIntent(assistant);
    })
    .then((assistant) => {
      //start model build 
      return client.preview.understand
      .assistants(assistant.uniqueName)
      .modelBuilds
      .create({uniqueName:assistant.uniqueName});
    })
    .catch(err => {
      throw err;
    })
}

function deleteHelloWorldIntent(assistant){
  return Promise.resolve()
    .then(()=>{
      return client.preview.understand
      .assistants(assistant.uniqueName)
      .intents('hello-world');
    })
    .then(async (intent)=>{
      await intent.samples
        .each(async (sample)=>{
          await client.preview.understand
              .assistants(assistant._solution.sid)
              .intents(intent._solution.sid)
              .samples(sample.sid)
              .remove()
              .catch((err)=>{
                //console.log(err.message,'sample remove');
              });
      });
      return intent;
    })
    .then(async (intent)=>{
      await client.preview.understand
          .assistants(assistant._solution.sid)
          .intents(intent._solution.sid)
          .fields
          .each(async(field) => {
            await client.preview.understand
              .assistants(assistant._solution.sid)
              .intents(intent._solution.sid)
              .fields(field.sid)
              .remove()
              .catch((err)=>{
                //console.log(err.message,'field remove');
              });
          })
          return intent;
    })
    .then(async (intent)=>{

      client.preview.understand
      .assistants(assistant.uniqueName)
      .modelBuilds('hello-world')
      .remove();

      client.preview.understand
          .assistants(assistant._solution.sid)
          .intents(intent._solution.sid)
          .remove();
      return assistant;
    })
    .then((assistant)=>{
      return assistant;
    })
    .catch(err=>{
      deleteHelloWorldIntent(assistant);
    })
}

createAssistantFully()
  .then(result => {
    console.log("done!");
  })
  .catch(err => {
    console.log(err);
  });