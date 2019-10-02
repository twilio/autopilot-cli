Twilio Autopilot CLI
===
A command line interface for managing Twilio Autopilot. After installing you'll be able to:

* Create an assistant from a template
* Export an existing assistant to a json file
* Update an existing assistant with a json file
* Delete an assistant
* Simulate an Assistant
* Import a DialogFlow Agent/Alexa Interaction Model
* Bulk upload field values

The Autopilot CLI enable you to:

* Keep your assistant in a repository with version control
* Integrate with your CI environment
* Share the schema files to collaborate on development

## Installation

  `sudo npm install -g @twilio/autopilot-cli`
  
## Usage

```
Usage:
  ta init [--twilio-setup | --list | --credentials <name>]
  ta list [--credentials <name>]
  ta create [--schema <file>] [--credentials <name>]
  ta update --schema <file> [--credentials <name>]
  ta delete --assistant <assistant-sid> [--credentials <name>]
  ta export --assistant <assistant-sid> [--credentials <name>]
  ta import --dfbackup <dialogflow-backup-zip-file> --dfagent <dialogflow-agent-name> [--credentials <name>]
  OR
  ta import dialogflow --dfbackup <dialogflow-backup-zip-file> --dfagent <dialogflow-agent-name> [--credentials <name>]
  ta import alexa --model <alexa-interaction-model-file> [--redirectURL <alexa-back-end-hanlder-url>] [--credentials <name>]
  ta simulate --assistant <assistant-sid> --text <user-text-input> [--credentials <name>]
  ta field --assistant <assistant-sid> --field <field-type-sid or field-type-unique-name> --csv <csv-file> [--credentials <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --twilio-setup        To setup new credential in autopilot-cli
  --list                Shows list of configured credentials in autopilot-cli
  --schema              Autopilot Schema File/DialogFlow Schema Zip File 
  --assistant           Twilio Autopilot Assistant SID
  --dfagent             Dialogflow Agent Name
  --dfbackup            Dialogflow Agent Backup Zip File
  --text                The user text input
  --field               Twilio Autopilot Field Type SID
  --csv                 CSV File path
  --model               Alexa Interaction Model File
  --redirectURL         Alexa Back-End Hanlder URL to send back the response
```

## Configuration
To use the Twilio Autopilot CLI, you first need to configure your Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--credentials` option to associate an Account SID and Auth Token with a profile name. 

The first time you use Autopilot CLI, you must call the `$ ta init` or `$ ta init --twilio-setup` command to initialize the tool with your Twilio account.

To update an existing autopilot-cli credentail use following command:
`$ ta init --credentials <name>`.

## Schema Files
A schema file is a JSON document that's used to define an Autopilot assistant. They tell the CLI what to create or update. When exporting an Assistant will one will be saved. When creating an Assistant you can choose from one of the following [templates](https://github.com/twilio/autopilot-templates/tree/master/Assistants) so you can get started quickly.