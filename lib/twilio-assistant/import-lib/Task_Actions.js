
const Task_Actions = async (messages) => {

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
}

module.exports = { Task_Actions };
