const assert = require('assert');
const expect = require('chai').expect;
const path = require('path');
const files = require('../lib/files');

const AutopilotCore = require('@dabblelab/autopilot-core');

describe('Twilio Autopilot CLI Module Tests', () => {
  let assistant = {}, 
      profile = 'default', 
      df_filename = '', 
      alexa_filename = '',
      twilioClient = '';

      

  before(async () => {
    
    twilioClient = await require('../lib/twilio-assistant/client')(profile);
  })
  after(() => {
    files.removeFile(path.join(process.cwd(), `${assistant.uniqueName}.json`));
    files.removeFile(path.join(process.cwd(), df_filename));
    files.removeFile(path.join(process.cwd(), alexa_filename));
  })
  describe('#createAssistant()', () => {
    it('create assistant', async () => {

      
      let fullPath = `${path.resolve('test/test_assistant.json')}`;
      assistant = await AutopilotCore.createAssistant(fullPath, twilioClient);
      expect(assistant).to.have.property('uniqueName');
    });
  });

  describe('#getAssistants()', () => {
    it('list assistants', async () => {

      const assistants = await AutopilotCore.listAssistant(twilioClient);
      expect(assistants.length).to.be.greaterThan(0, 'no assistants found');
    });
  });

  describe('#exportAssistant()', () => {
    it('export assistant', async () => {

      const export_assistant = await AutopilotCore.exportAssistant(assistant.uniqueName, twilioClient);
      expect(export_assistant).to.have.property('uniqueName');
    });
  });

  describe('#updateAssistant()', () => {
    it('update assistant', async () => {

      const schemaPath = path.join(process.cwd(),`${assistant.uniqueName}.json`);
      const update_assistant = await AutopilotCore.updateAssistant(schemaPath, twilioClient);
      expect(update_assistant).to.have.property('uniqueName');
    });
  });

  describe('#customChannel()', () => {
    it('custom channel message', async () => {

      const channelResponse = await AutopilotCore.customChannel(assistant.sid, 'webchat', 'hello', twilioClient);
      expect(channelResponse).to.have.property('says');
    });
  });

  describe('#bulkUploadFieldValues()', () => {
    it('bulk upload field values', async () => {

      const csvFile = `${path.resolve('test/Yes.csv')}`;
      const bulkUploadFieldValues = await AutopilotCore.bulkUploadFieldValues(assistant.uniqueName, 'Yes', csvFile, twilioClient);
      expect(bulkUploadFieldValues).to.have.property('uniqueName');
    });
  });

  describe('#deleteAssistant()', () => {
    it('delete assistant', async () => {

      const delete_assistant = await AutopilotCore.deleteAssistant(assistant.uniqueName, twilioClient);
      expect(delete_assistant).to.be.true;
    });
  });

  describe('#importAssistant()', () => {
    it("import DialogFlow Assistant", async () => {

      let fullPath = `${path.resolve('test/Twilio-Basic-Starter.zip')}`,
          name = `Twilio-Basic-Starter`;

      const filename = await AutopilotCore.importDialogFlowAgent(fullPath, name);
      df_filename = filename;
      expect(path.extname(filename)).to.be.eq('.json');
    })
  })

  describe('#importAlexaAssistant()', () => {
    it("import Alexa Interaction Model Assistant", async () => {

      let fullPath = `${path.resolve('test/alexa_model/model.json')}`,
          redirectURL = `https://inquisitive-stretch-2083.twil.io/generic`;

      const filename = await AutopilotCore.importAlexaModel(fullPath, redirectURL);
      alexa_filename = filename;
      expect(path.extname(filename)).to.be.eq('.json');
    })
  })


});