
const _ = require('underscore');

const FieldTypeValues = async (entityValue) => {

    let values = [];
    if(entityValue.length){
        try {
            for(let i = 0 ; i < entityValue.length ; i ++){

                const value = entityValue[i].value.replace(/\/|"/g,'').trim();
                
                values.push({
                    "language": "en-US",
                    "value": value,
                    "synonymOf": null
                });

                if(entityValue[i].synonyms.length){

                    if(entityValue[i].synonyms.length === 1){
                        const synonym = entityValue[i].synonyms[0].replace(/\/|"/g,'').trim();
                        if(!(value == synonym)){

                            values.push({
                                "language": "en-US",
                                "value": synonym,
                                "synonymOf": value
                            });
                        }
                        
                    }else{

                        const fieldValues = entityValue[i];

                        for(let j = 0 ; j < fieldValues.synonyms.length ; j ++){

                            const index = _.findIndex(values,{value : fieldValues.synonyms[j]});

                            if(index < 0){
                                const synonym = fieldValues.synonyms[j].replace(/\/|"/g,'').trim();
                                values.push({
                                    "language": "en-US",
                                    "value": synonym,
                                    "synonymOf": value
                                });
                            }
                        }
                    }
                }
            }
        }catch(err){

            throw err;
        }

    }   
    return values;
}

module.exports = {FieldTypeValues};