
const Task_Actions = async (messages) => {

    try{
        let action = [];
        if(typeof messages.speech == "object" && messages.speech.length){

            action.push({
                "say": {
                        "speech": messages.speech[0]
                    }
                },
                {
                    "listen" : true
                } 
            ); 
        }else if(typeof messages.speech == "string")
        {

            action.push({
                "say": {
                        "speech": messages.speech
                    }
                },
                {
                    "listen" : true
                } 
            );
        }
        return action;
    }catch(err){

        throw err;
    }
}

module.exports = { Task_Actions };
