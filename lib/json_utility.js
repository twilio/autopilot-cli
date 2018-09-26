
const os   = require('os'),
      path = require('path'),
      fs   = require('fs'),
      prettyJSONStringify = require('pretty-json-stringify')
      _    = require('lodash');

const twilioDir = path.resolve(os.homedir(),'.twilio');
const filePath = path.resolve(os.homedir(),'.twilio','config.json');

const addProfile = async (profileName,valid_credential_object) => {
    const n_profile = {
        profileName : profileName,
        accountSID : valid_credential_object.account_sid,
        authToken : valid_credential_object.auth_token
    };

    if(fs.existsSync(filePath)){
        const profiles = await read(filePath);
        if(profiles.length){
            const p_index = _.findIndex(profiles,{profileName : profileName});
            if(p_index>=0){
                profiles[p_index] = n_profile;
            }else{
                profiles.push(n_profile);
            }
        }else{
            profiles.push(n_profile);
        }
        write(profiles);
    }
    else{
        let profiles = [];
        profiles.push(n_profile);
        write(profiles);
    }
}

const read = ()=>{
    try {
        let content = require(filePath);
        return content;
    } catch (e) {
        return [];
    }
}

function write(jsonObject) {
    if(directoryExists(twilioDir)){
        try{
            fs.writeFileSync(filePath, prettyJSONStringify(jsonObject));
        }
        catch(err){
            console.error('Invalid file, cannot write to: ' + filePath);
            process.exit(1);
        }
    }else{
        console.error('Invalid directory : ' + twilioDir);
        process.exit(1);
    }
}

function directoryExists(){
    if(fs.statSync(twilioDir).isDirectory()){
        return true;
    }else{
        try{
            fs.mkdirSync(twilioDir);
            return true
        }catch(e){
            return false;
        }
    }
}
module.exports = {
    addProfile,
    read
}