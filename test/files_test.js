const assert = require('assert');
const files = require("../lib/files");
const expect = require('chai').expect;

describe('#fileExists()', function(){
  it('file exists', function(){
    expect(files.fileExists('./sample_assistant.json')).to.equal(true,'default assistant schema not found');
  })
})

// describe('#fileExists()', function() {
//   it('default assistant schema exists', function() {
//     return file.fileExists('./sample_assistant.json')
//     .then(function (result) {
//       //assert.equal(result,true,'default assistant schema file not found');
//       expect(result,'the file').to.equal(true,'default assistant schema not found');
//     });
//   });
// });