const schema = require('./assistant.json');
const twilio = require('twilio');
const config = require('./config.js');

const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

function getAssistant(assistantIdentifier) {
  return client.preview.understand
    .assistants(assistantIdentifier)
    .fetch();
}

async function createAssistant() {

  
  await client.preview.understand
  .assistants
  .create(params)
  .then((assistant) => {
    //create intents

  });
 

  const params = {
    friendlyName: schema.uniqueName,
    uniqueName: schema.uniqueName,
    logQueries: true
  }

  return 

  await client.preview.understand
    .assistants(schema.uniqueName)
    .fetch()
    .then(async (assistant) => {


      console.log('All done!');
    })
    .catch((error) => {
      console.log(error.message)
    })
    .done();
}

// add intents to assistant
async function addIntents(params) {
  let assistantSid = assistant.sid;
  await schema.intents.forEach(function (element) {
    console.log(`${assistantSid}, ${element.intentName}`);
  });
}

// add fields to intent
async function addFields(params) {

}

// add samples to intent
async function addSamples(params) {

}

// build model
async function buildModel(params) {
  client.preview.understand
    .assistants(schema.uniqueName)
    .modelBuilds
    .create()
    .then(model_build => console.log(model_build.sid))
    .done();
}

// scaffold function
async function scaffoldFunction(params) {

}

function getIntents() {
  // get the assistant
  return client.preview.understand
    .assistants(schema.uniqueName)
    .fetch()
    .then(assistant => {
      return client.preview.understand
        .assistants(assistant.sid)
        .intents;
    })
    .then(intents => {
      return intents
    })
    .catch();
};

getIntents()
  .then(result => {
    result.each(intent => {
      console.log(`${result._solution.assistantSid}, ${intent.uniqueName}`);
    });
  });
