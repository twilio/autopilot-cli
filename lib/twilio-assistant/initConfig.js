const inquirer = require('inquirer');
const os = require('os');

const json_utility = require('../json_utility');

const initConfig = function (args) {
  const option = args.hasOwnProperty('profile')?'profile':args.hasOwnProperty('list')?'list':'setup';

  console.log(option);
  switch (option){

    case 'setup' :
    twillioInitSetUp();
    break;

    case 'profile' :
    twillioInitProfile(args.profile);
    break;

    case 'list' :
    twillioInitProfileList();
    break;
  }
}

// create new profile
const twillioInitSetUp = () => {
    if(json_utility.read().length){
        inquirer.prompt([{
            message: 'Please type in your new profile name:\n',
            type: 'input',
            name: 'profile',
            default: 'default'
        }]).then((answer) => {
            let newProfileName = answer.profile.trim();
      
            if (!/^[a-zA-Z0-9-_]+$/i.test(newProfileName)) {
                console.error('[Error]: Invalid profile name. The profile name has to match with the pattern: /[a-zA-Z0-9-_]/');
            }
            _askCredential(newProfileName);
        });
    }
    else{
        _askCredential('default');
    }
}

// update existing profile
const twillioInitProfile = (profileName) => {

  if (!/^[a-zA-Z0-9-_]+$/i.test(profileName.trim())) {
      console.error('[Error]: Invalid profile name. The profile name has to match with the pattern: /[a-zA-Z0-9-_]/');
  }else{
    const p_index = _.findIndex(json_utility.read(),{profileName : profileName});
    if(p_index>=0){
      _confirmOverwritingProfile(profileName,(confirm)=>{
        if(confirm){
          _askCredential(profileName.trim());
        }
      })
    }
    else{
      console.error('[Error]: The profile name ['+profileName+'] does not exists.');
      process.exit(1);
    }
  }
  
}

// list all associated profiles
const twillioInitProfileList = () => {
  console.log('\n Profile \t\t| Associated Twilio Profile');
  console.log('------------------------------------------------------------------------');
  json_utility.read().forEach(element => {
    console.log('['+element.profileName+']\t\t|'+' "' +element.profileName+ '"');
  });
}


// ask account_sid and auth_token
const _askCredential = async(profileName) => {

    console.log('\nPlease visit https://www.twilio.com/console' +
        '\nFill in the Twilio ACCOUNT SID and Twilio AUTH TOKEN below. CLI will generate/modify the Twilio credential file for you.');

    return await inquirer.prompt([
      {
          type: 'input',
          name: 'accountSID',
          message: 'Twilio ACCOUNT SID:\n',
          validate: function (input) {
              if (!input.trim()) {
                  return '"Twilio ACCOUNT SID" cannot be empty.';
              }
              return true;
          }
      },
      {
          type: 'input',
          name: 'authToken',
          message: 'Twilio AUTH TOKEN:\n',
          validate: function (input) {
              if (!input.trim()) {
                  return '"Twilio AUTH TOKEN" cannot be empty.';
              }
              return true;
          }
      }
  ]).then(async (answer) => {
      let valid_credential_object = {
          "account_sid": answer.accountSID.trim(),
          "auth_token": answer.authToken.trim()
      };
      const cred =  await json_utility.addProfile(profileName,valid_credential_object);
      return cred;
  });
}

// confirming profile overwriting
function _confirmOverwritingProfile(profileName,callback) {
  inquirer.prompt([
      {
          type: 'confirm',
          name: 'overwrite',
          default: true,
          message: 'Input name [' + profileName + '] exists, do you want to overwrite the existing credential?'
      }
  ]).then((answer) => {
      callback(answer.overwrite);
  });
}
 

module.exports = {initConfig,_askCredential};