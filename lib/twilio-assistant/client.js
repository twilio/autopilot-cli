
const twilio = require('twilio'),
      os     = require('os'),
      path   = require('path')
      _      = require('lodash');

module.exports = (profileName) => {
    try{
        const twilioDir = path.resolve(os.homedir(),'.twilio/config.json');
        var config = require(twilioDir);
        const f_profile = _.findIndex(config,{profileName:profileName});
        if(f_profile>=0){
           let client = new twilio(config[f_profile].accountSID, config[f_profile].authToken);
           return client;
        }
        else{
            throw new Error(`Oops 1! We did not find the "${profileName}" profile name in the Project Root Directory. Please refer to the README file for more information`)

        }
    } catch(e) {
      if(e.code == 'MODULE_NOT_FOUND')
        throw new Error(`Oops! We did not find the "${profileName}" profile name in the Project Root Directory. Please refer to the README file for more information.`)
      else
        throw new Error(`Oops! Invalid credentials for the "${profileName}" profile name.`)

    }
}
