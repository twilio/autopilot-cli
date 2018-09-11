const assert = require('assert');
const expect = require('chai').expect;

const tag = require("../lib/tag.js");

describe('TAG Module Tests', function () {

  describe('#createAssistants()', function () {
    it('create assistants', function () {

      return tag.createAssistantFully('../test/test_assistant.json')
        .then(function (result) {
          //assert.equal(result,true,'default assistant schema file not found');
          expect(result).haveOwnProperty("sid", "does not contain 'sid' property");
        });

      // const assistant = await tag.createAssistantFully('./test_assistant.json');
      // expect(assistants.sid.length).to.be.greaterThan(0, 'no assistants found');
    });
  });

  describe('#getAssistants()', function () {
    it('list assistants', async function () {
      const assistants = await tag.getAssistants();
      expect(assistants.length).to.be.greaterThan(0, 'no assistants found');
    });
  });

});