const client = require('./client');

const listAssistants = function () {
  return client.preview.understand
    .assistants;
}

module.exports = {listAssistants};