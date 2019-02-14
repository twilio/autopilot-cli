

const customChannel = async (assistantSid, channel, text, profile) => {

    const request = require('request-promise');
    const client = await require('./client')(profile);
  
    return await Promise.resolve()
  
      //remove samples and fields
      .then( async () => {
  
        const userpass = `${client.username}:${client.password}`;
        const options = {
            method : "POST",
            uri : `https://channels.autopilot.twilio.com/v1/${client.accountSid}/${assistantSid}/custom/${channel}`,
            headers : {
                authorization : `Basic ${Buffer.from(userpass).toString('base64')}`
            },
            form : {
                text : text,
                user_id : client.accountSid
            },
            json : true
        }

        return request(options)
            .then(response => {
                return response;
            })
            .catch(err => {
                throw err;
            })
      })
      
      .catch(err => {
        throw err;
      })
  
  }
  
  module.exports = { customChannel };