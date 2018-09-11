Twilio Assistant CLI
========
A command line interface for creating and managing Twilio assistants.

## Using the CLI:

```
Usage:
  tag config --account-sid <account-sid> --auth-token <auth-token> [--profile <name>]
  tag list
  tag create [--template] [--url <url>] [--profile <name>]
  tag create --schema <file> [--profile <name>]
  tag update --schema <file> [--profile <name>]
  tag delete --assistant-sid <assistant-sid> [--profile <name>]
  tag export --assistant-sid <assistant-sid> [--profile <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --account-sid         Twilio Account SID
  --auth-token          Twilio Auth Token
  --schema              Assistant Schema File
  --template            Default Template(s)
  --assistant-sid       Twilio Assistant SID
```
## Installation
The Twilio Assistant CLI (aka: TAG) is installed using the following NPM command.

```bash
$ npm install -g twilio-assistant-cli
```
## Configuration
Before using the CLI it needs to be configured with with a valid Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--profile` option to associate an Account SID and Auth Token with a profile name. 

## Templates 
Templates are used as a simple starting point for creating new assistants. If the `--template` option is provided with the `create` command, you'll be prompted to select a template. If the `create` command is used without any options, the default 'hello-world' template is used.

## Schema Files
A schema file is a JSON document that's used to define an assistant. They tell the CLI what to create or update. Templates are pre-defined schema files. So, templates can be used as a starting point for creating a new schema or to create custom templates.