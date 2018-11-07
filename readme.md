Twilio Autopilot CLI (Experimental)
====================================
A command line interface for creating and managing Twilio Autopilot.

This software is in pre-release status and not currently supported. We are looking for community feedback on what type of CLI tool would be the most useful for Twilio users.

## About Twilio Autopilot
Twilio Autopilot is a conversational AI platform to build bots and virtual assistants that can be deployed across messaging channels such as SMS, Whatsapp, FB Messeger or Slack, telephony IVRs (Interactive Voice Response), or Home assistants such as Alexa and Google Assistant.

You can learn more about Twilio Autopilot here:

[Twilio Autopilot documentation](https://www.twilio.com/docs/autopilot)

[Twilio Autopilot website](https://www.twilio.com/autopilot)

[Twilio Autopilot Quest mission (Hands on learning)](https://www.twilio.com/quest/mission/30)

## General Usage

```
Usage:
  ta init --account <account-sid> --token <auth-token> [--profile <name>]
  ta list [--profile <name>]
  ta create [--schema <file>] [--profile <profile-name>]
  ta update --schema <file> [--profile <name>]
  ta delete --assistant <assistant-sid> [--profile <name>]
  ta export --assistant <assistant-sid> [--profile <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --account             Twilio Account SID
  --token               Twilio Auth Token
  --schema              Assistant Schema File
  --assistant           Twilio Assistant SID
```
## Installation
The Twilio Autopilot CLI will eventually be available publicly via NPM. However, while it's in development, the installation process is:

 1. Clone this git repo
 2. `cd` into the project root directory
 3. Run `$ sudo npm link`

NOTE: To uninstall/unlink, run `$ sudo npm unlink`

## Configuration
To use the Twilio Autopilot CLI, you first need to configure your Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--profile` option to associate an Account SID and Auth Token with a profile name. 

To configure the CLI with your Twilio credentials run the following command: `$ ta init`. Credentials will be saved in a local JSON file in `~/.twilio/config.json`.

The first set of credentials you provide will become your 'default' profile. You can add additional profiles or update an existing profile by running the following command: `$ ta init --profile test-profile` (where 'test-profile' the the profile name you'd like to add/update).

## Templates 
Templates are used as a simple starting point for creating new assistants. If the `--template` option is provided with the `create` command, you'll be prompted to select a template. If the `create` command is used without any options, the default 'hello-world' template is used.

## Schema Files
A schema file is a JSON document that's used to define an assistant. They tell the CLI what to create or update. Templates are pre-defined schema files. So, templates can be used as a starting point for creating a new schema or to create custom templates.