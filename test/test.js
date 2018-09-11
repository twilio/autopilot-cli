const assert = require('assert');
const tag = require("../lib/tag.js");
const expect = require('chai').expect;

describe('#fileExists()', function() {
  it('default assistant schema exists', function() {
    return tag.fileExists('./sample_assistant.json')
    .then(function (result) {
      //assert.equal(result,true,'default assistant schema file not found');
      expect(result,'the file').to.equal(true,'default assistant schema not found');
    });
  });
});