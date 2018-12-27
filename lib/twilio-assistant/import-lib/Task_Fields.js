
const Task_Fields = async (parameters) => {

    let fields = [];
    const data_types = require('./DataTypes.json');
    
    if(parameters.length){

        for(let i = 0 ; i < parameters.length ; i ++){

            let fieldType = '';
            if(parameters[i].hasOwnProperty('dataType')){
                if(parameters[i].dataType.substring(0,4) == '@sys')
                {
                    if(data_types[parameters[i].dataType])
                        fieldType = data_types[parameters[i].dataType];
                    else
                        fieldType = 'Twilio.FIRST_NAME';
                }else{

                    fieldType = parameters[i].dataType.substring(1);
                }

                fields.push({
                    "uniqueName" : parameters[i].name,
                    "fieldType" : fieldType
                });
            }
            
        }
    }
    return fields;
    
}

module.exports = {Task_Fields};
