const path = require('path'),
      fs = require('fs');

const Tasks = async (intents, dirPath) => {

    const {Task_Fields} = require('./Task_Fields'),
          {Task_Samples} = require('./Task_Samples'),
          {Task_Actions} = require('./Task_Actions');

    let obj = {
        "assistant_initiation" : "",
        "fallback" : "",
        "tasks" : []
    };

    if(intents.length){

        try{
            let tasks = [];
            for(let i = 0 ; i < intents.length ; i++){

                if(intents[i].indexOf('_usersays_en') < 0){

                    const intentPath = path.resolve(dirPath,intents[i]);

                    const intentSamplePath = path.resolve(dirPath,intents[i].substr(0,intents[i].length-5)+'_usersays_en' + intents[i].substr(intents[i].length-5));

                    if(fs.existsSync(intentPath)){

                        const intent = require(intentPath);
                        const taskName = intent.name.replace(/\'|-|\s|,/g," ").replace(/\s+/g,' ').trim().replace(/\s/g,"-");


                        if(intent.responses[0].action && intent.responses[0].action == "input.unknown")
                        {
                            obj.fallback = taskName;
                            let message = ``;
                            try{

                                message = intent.responses[0].messages[0].speech[0];
                            }catch(e){

                                message = "I missed what you said. What was that?";
                            }
                            

                            tasks.push({
                                "uniqueName": taskName,
                                "actions": {
                                    "actions" : [
                                        {
                                            "say": {
                                                "speech": message
                                            }
                                        },
                                        {
                                            "listen" : true
                                        } 
                                    ]
                                },
                                "fields": [],
                                "samples": []
                            })
                            
                        }
                        else{

                            if(intent.responses[0].action && intent.responses[0].action == "input.welcome")
                                obj.assistant_initiation = taskName;

                            
                            const fields = await Task_Fields(intent.responses[0].parameters);
                            const actions = await Task_Actions(intent.responses[0].messages[0]);
                            
                            let samples = [];
                            if(fs.existsSync(intentSamplePath)){

                                const intentSamples = require(intentSamplePath);
                                samples = await Task_Samples(intentSamples);
                            }
                            

                            tasks.push({
                                "uniqueName": taskName,
                                "actions": {
                                    "actions" : actions
                                },
                                "fields": fields,
                                "samples": samples
                            })
                        }
                    }
                    
                    

                }
                if( i === intents.length - 1){
                    obj.tasks = tasks;
                }
            }
        }catch(err){

            throw err;
        }
        

    }
    return obj;
}

module.exports = {Tasks};