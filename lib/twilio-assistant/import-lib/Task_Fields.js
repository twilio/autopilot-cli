
const Task_Fields = async (parameters) => {

    try{
        let fields = [];
        const data_types = require('./DataTypes.json');
        
        if(parameters.length){

            for(let i = 0 ; i < parameters.length ; i ++){

                let fieldType = '';
                if(parameters[i].hasOwnProperty('dataType')){
                    if(parameters[i].dataType.substring(0,4) == '@sys')
                    {
                        if(data_types.dialogFlow[parameters[i].dataType])
                            fieldType = data_types.dialogFlow[parameters[i].dataType];
                        else
                            fieldType = 'Twilio.FIRST_NAME';
                    }else{

                        fieldType = parameters[i].dataType.substring(1);
                    }

                    fields.push({
                        "uniqueName" : parameters[i].name.replace(/[^\w\s.]/g," ").replace(/\s+/g,' ').trim().replace(/\s/g,"-"),
                        "fieldType" : fieldType
                    });
                }
                
            }
        }
        return fields;
    }catch(err){

        throw err;
    }
    
}

module.exports = {Task_Fields};
