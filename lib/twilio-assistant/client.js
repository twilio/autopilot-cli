try {
  var config = require('../../config.js');
} catch(e) {
  console.log("Oops! We did not find the config.js file in the Project Root Directory. Please refer to the README file for more information");
  process.exit();
}

const twilio = require('twilio');

module.exports = new twilio(config.twilio.accountSid, config.twilio.authToken);