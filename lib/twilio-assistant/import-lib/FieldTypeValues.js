
const _ = require('underscore');

const FieldTypeValues = async (entityValue) => {

    let values = [];
    if(entityValue.length){

        for(let i = 0 ; i < entityValue.length ; i ++){

            values.push({
                "language": "en-US",
                "value": entityValue[i].value,
                "synonymOf": null
              });

            if(entityValue[i].synonyms.length){

                if(entityValue[i].synonyms.length === 1){
                    if(!entityValue[i].value == entityValue[i].synonyms[0]){

                        values.push({
                            "language": "en-US",
                            "value": entityValue[i].synonyms[0],
                            "synonymOf": entityValue[i].value
                          });
                    }
                       
                }else{

                    const fieldValues = entityValue[i];

                    for(let j = 0 ; j < fieldValues.synonyms.length ; j ++){

                        const index = _.findIndex(values,{value : fieldValues.synonyms[j]});

                        if(index < 0){
                            values.push({
                                "language": "en-US",
                                "value": fieldValues.synonyms[j],
                                "synonymOf": fieldValues.value
                              });
                        }
                    }
                }
            }
        }

    }   
    return values;
}

module.exports = {FieldTypeValues};