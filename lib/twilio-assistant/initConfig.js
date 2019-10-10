const inquirer = require('inquirer'),
      json_utility = require('../json_utility');

const initConfig = function (args) {
    const option = args.hasOwnProperty('credentials') ? 'profile' : args.hasOwnProperty('list') ? 'list' : 'setup';

    switch (option) {
        case 'setup':
            twilioInitSetUp();
            break;

        case 'profile':
            twilioInitProfile(args.credentials);
            break;

        case 'list':
            twilioInitProfileList();
            break;
    }
};

// create new profile
const twilioInitSetUp = () => {
    if (json_utility.read().length) {
        inquirer.prompt([{
            message: 'Please type in your new credentials name:\n',
            type: 'input',
            name: 'profile',
            default: 'default'
        }]).then((answer) => {
            let newProfileName = answer.profile.trim();

            if (!/^[a-zA-Z0-9-_]+$/i.test(newProfileName)) {
                console.error(`[Error]: Invalid credentials name. The credentials name '${profileName.trim()}' contains characters that are not allowed.`);
            }
            _askCredential(newProfileName);
        });
    }
    else {
        _askCredential('default');
    }
};

// update existing profile
const twilioInitProfile = (profileName) => {

    if (!/^[a-zA-Z0-9-_]+$/i.test(profileName.trim())) {
        console.error(`[Error]: Invalid credentials name. The credentials name '${profileName.trim()}' contains characters that are not allowed.`);
    } else {
        const p_index = _.findIndex(json_utility.read(), { profileName: profileName.trim() });
        if (p_index >= 0) {
            _confirmOverwritingProfile(profileName, (confirm) => {
                if (confirm) {
                    _askCredential(profileName.trim());
                }
            })
        }
        else {
            // console.error('[Error]: The credentials name [' + profileName + '] does not exists.');
            // process.exit(1);
            _askCredential(profileName.trim());
        }
    }

};

// list all associated profiles
const twilioInitProfileList = () => {
    console.log(`\n credentials`.padEnd(30)+` | Associated Twilio credentials`);
    console.log('------------------------------------------------------------------------');
    json_utility.read().forEach(element => {
        console.log(` [${element.profileName}]`.padEnd(30)+`|  "${element.profileName}"`);
    });
};

// get account_sid and auth_token
const _askCredential = async (profileName) => {
    console.log('\nPlease visit https://www.twilio.com/console' +
        '\nFill in the Twilio ACCOUNT SID and Twilio AUTH TOKEN below to save/modify your Twilio credentials.');

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
        const valid_credential_object = {
            "account_sid": answer.accountSID.trim(),
            "auth_token": answer.authToken.trim()
        };
        return await json_utility.addProfile(profileName, valid_credential_object);
    });
};

// confirming profile overwriting
function _confirmOverwritingProfile(profileName, callback) {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'overwrite',
            default: true,
            message: 'The credentials name [' + profileName + '] exists, do you want to overwrite it?'
        }
    ]).then((answer) => {
        callback(answer.overwrite);
    });
}

module.exports = { initConfig, _askCredential };
