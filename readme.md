# Twilio Assistant CLI

A command line interface for creating Twilio Assistants from a json schema. 

## General Steps
1. Create an assistant
2. Create one or more tasks/intents
3. Create one or more samples for each intent
4. Create one or more fields for each intent
5. Add field values and synonyms
6. Add samples that map to intents/tasks and fields
7. Build model
8. Test and update model
9. Rebuild model

```json
{
  friendlyName : "example-assistant",
  logQueries : true,
  uniqueName : "example-assistant"
  intents : [
    {
      intentName : "general-greeting",
      fields : [
        {
          fieldName : "first-name",
          fieldType : "Twilio.FIRST_NAME"
        },
        {
          fieldName : "last-name",
          fieldType : "Twilio.LAST_NAME"
        },
        {
          fieldName : "email",
          fieldType : "Twilio.EMAIL"
        },
        {
          fieldName : "confirmationNumber",
          fieldType : "Twilio.NUMBER"
        }        
      ],
      samples : [
        {
          language : "en-US",
          taggedText : [
            "my first name is {first-name}",
            "my name is {first-name} {last-name}",
            "my email is {email}"
            ]
        }               
      ]
    }
  ]
}
```

## What the CLI should do

1. Create a new assistant. Example: `$ twilio new --assistant assistant.json`
 - use the twilio api to create the assistant from the .json file
 - create a local .js file with starter code for the Twilio function