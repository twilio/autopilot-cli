Twilio Autopilot CLI (Experimental)
===
A command line interface for managing Twilio Autopilot.

After installing you'll be able to:

* Create an assistant
* Export an existing assistant to a json file
* Update an existing assistant with a json file
* Delete an assistant

## Installation

  `sudo npm install -g @twilio/autopilot-cli`
  
## Usage

```
Usage:
  ta init --account <account-sid> --token <auth-token> [--credentials <name>]
  ta list [--credentials <name>]
  ta create [--schema <file>] [--credentials <profile-name>]
  ta update --schema <file> [--credentials <name>]
  ta delete --assistant <assistant-sid> [--credentials <name>]
  ta export --assistant <assistant-sid> [--credentials <name>]
  ta import --dfbackup <dialogflow-backup-zip-file> --dfagent <dialogflow-agent-name> [--credentials <name>]
  ta channel --assistant <assistant-sid> --text <user-text-input> --channel <custom-channel-name> [--credentials <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --account             Twilio Account SID
  --token               Twilio Auth Token
  --schema              Autopilot Schema File/DialogFlow Schema Zip File 
  --assistant           Twilio Autopilot Assistant SID/Name The DialogFlow Schema
  --dfagent             Dialogflow Agent Name
  --dfbackup            Dialogflow Agent Backup Zip File
  --text                The user text input
  --channel             The name of your custom channel
```

## Configuration
To use the Twilio Autopilot CLI, you first need to configure your Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--credentials` option to associate an Account SID and Auth Token with a profile name. 

To configure the CLI with your Twilio credentials run the following command: `$ ta init`. Credentials will be saved in a local JSON file in `~/.twilio/config.json`.

The first set of credentials you provide will become your 'default' profile. You can add additional profiles or update an existing profile by running the following command: `$ ta init --credentials test-profile` (where 'test-profile' the the profile name you'd like to add/update).

## Schema Files
A schema file is a JSON document that's used to define an Autopilot assistant. They tell the CLI what to create or update. When exporting an Assistant will be saved
