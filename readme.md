Twilio Autopilot CLI (Experimental)
===
A command line interface for managing Twilio Autopilot.

After installing you'll be able to:

* Create an assistant
* Export an existing assistant to a json file
* Update an existing assistant with a json file
* Delete an assistant

## Installation

  `npm install -g @twilio/autopilot-cli`
  
## Usage

```
Usage:
  ta init [--profile <name>]
  ta list [--profile <name>]
  ta create [--schema <file>] [--profile <profile-name>]
  ta export [--profile <name>]
  ta update --schema <file> [--profile <name>]
  ta delete --assistant <assistant-sid> [--profile <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --account             Twilio Account SID
  --token               Twilio Auth Token
  --schema              Autopilot Schema File
  --assistant           Twilio Autopilot Assistant SID
```

## Configuration
To use the Twilio Autopilot CLI, you first need to configure your Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--profile` option to associate an Account SID and Auth Token with a profile name. 

To configure the CLI with your Twilio credentials run the following command: `$ ta init`. Credentials will be saved in a local JSON file in `~/.twilio/config.json`.

The first set of credentials you provide will become your 'default' profile. You can add additional profiles or update an existing profile by running the following command: `$ ta init --profile test-profile` (where 'test-profile' the the profile name you'd like to add/update).

## Schema Files
A schema file is a JSON document that's used to define an Autopilot assistant. They tell the CLI what to create or update. When exporting an Assistant will be saved
