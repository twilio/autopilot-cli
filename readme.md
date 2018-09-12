Twilio Assistant CLI
========
A command line interface for creating and managing Twilio assistants.

## General Usage

```
Usage:
  tag init --account <account-sid> --token <auth-token> [--profile <name>]
  tag list [--profile <name>]
  tag create [--template] [--url <url>] [--profile <name>]
  tag create [--name <assistant-name>] [--schema <file>] [--profile <profile-name>]
  tag update --schema <file> [--profile <name>]
  tag delete --assistant <assistant-sid> [--profile <name>]
  tag export --assistant <assistant-sid> [--profile <name>]

Options:
  -h --help             Help Screen
  -v --version          CLI Version
  --account             Twilio Account SID
  --token               Twilio Auth Token
  --schema              Assistant Schema File
  --template            Default Template(s)
  --assistant           Twilio Assistant SID
```
## Installation
The Twilio Assistant Generator CLI (aka: TAG CLI) will eventually be available publicly via NPM. However, while it's in development, the installation process is:

 1. Clone this git repo
 2. `cd` into the project root directory
 3. Run `$ sudo npm link`

NOTE: To uninstall/unlink, run `$ sudo npm unlink`

## Configuration
Before using the CLI it needs to be configured with with a valid Twilio Account SID and Auth Token. Optionally, multiple accounts can be configured using the `--profile` option to associate an Account SID and Auth Token with a profile name. 

### Manually creating a config.js file
You can manually create a config.js file in the project root directory. Copy and past the following code and set the account SID and token.

```javascript
const config = {};

// twilio config
config.twilio = {};
config.twilio.accountSid = "<replace-with-account-sid>";
config.twilio.authToken = "<replace-with-auth-token>";

module.exports = config;
```

## Templates 
Templates are used as a simple starting point for creating new assistants. If the `--template` option is provided with the `create` command, you'll be prompted to select a template. If the `create` command is used without any options, the default 'hello-world' template is used.

## Schema Files
A schema file is a JSON document that's used to define an assistant. They tell the CLI what to create or update. Templates are pre-defined schema files. So, templates can be used as a starting point for creating a new schema or to create custom templates.