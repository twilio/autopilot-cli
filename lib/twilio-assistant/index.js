const createAssistantFully = require('./createAssistantFully'),
deleteAssistantFully = require('./deleteAssistantFully'),
  exportAssistant = require('./exportAssistant'),
  initConfig = require('./initConfig'),
  listAssistants = require('./listAssistants'),
  resetAssistant = require('./resetAssistant'),
  updateAssistant = require('./updateAssistant'),
  importAssistant = require('./importAssistant'),
  gitTemplates = require('./get-templates'),
  customChannel = require('./customChannel');

module.exports = Object.assign({},
  createAssistantFully,
  deleteAssistantFully,
  exportAssistant,
  initConfig,
  listAssistants,
  resetAssistant,
  updateAssistant,
  importAssistant,
  gitTemplates,
  customChannel
);