const assert = require('assert');
const expect = require('chai').expect;
const path = require('path');
const files = require('../lib/files');

const ta = require("../lib/twilio-assistant");

describe('TAG Module Tests', function () {
  let assistant = {}, profile = 'default';
  before(() => {
    
  })
  after(() => {
    files.removeFile(path.join(process.cwd(),`${assistant.uniqueName}.json`));
  })
  describe('#createAssistant()', function () {
    it('create assistant', async function () {
      let fullPath = `${path.resolve('test/test_assistant.json')}`
      assistant = await ta.createAssistantFully(fullPath,profile);
      expect(assistant).to.have.property('sid');
    });
  });

  describe('#getAssistants()', function () {
    it('list assistants', async function () {
      const assistants = await ta.listAssistants(profile);
      expect(assistants.length).to.be.greaterThan(0, 'no assistants found');
    });
  });

  describe('#exportAssistant()', function () {
    it('export assistant', async function () {
      const export_assistant = await ta.exportAssistant(assistant.sid, profile);
      expect(export_assistant).to.have.property('sid');
    });
  });

  describe('#updateAssistant()', function () {
    it('update assistant', async function () {

      const schemaPath = path.join(process.cwd(),`${assistant.uniqueName}.json`);
      const update_assistant = await ta.updateAssistant(schemaPath, profile);
      expect(update_assistant).to.have.property('sid');
    });
  });

  describe('#deleteAssistant()', function () {
    it('delete assistant', async function () {

      const delete_assistant = await ta.deleteAssistantFully(assistant.sid, profile);
      expect(delete_assistant).to.be.true;
    });
  });


});