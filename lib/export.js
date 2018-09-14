const path = require('path')
const config = require('../config.js')
const twilio = require('twilio')


const client = new twilio(config.twilio.accountSid, config.twilio.authToken)

const tag = function () { }

tag.prototype.exportSchema = function (assistantIdentifier) {

  return Promise.resolve()

    // get the assistant
    .then(() => {
      return client.preview.understand
        .assistants(assistantIdentifier)
        .fetch()
    })

}

module.exports = new tag();