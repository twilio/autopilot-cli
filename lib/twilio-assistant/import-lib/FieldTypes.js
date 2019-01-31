const path = require('path'),
      fs = require('fs');

const FieldTypes = async (entities, dirPath) => {

    const {FieldTypeValues} = require('./FieldTypeValues');

    let fieldTypes = [];

    if(entities.length){
        try{
            for(let i = 0 ; i < entities.length ; i++){

                if(entities[i].indexOf('_entries_en') < 0){
    
                    const entityPath = path.resolve(dirPath,entities[i]);
    
                    const entityValuePath = path.resolve(dirPath,entities[i].substr(0,entities[i].length-5)+'_entries_en' + entities[i].substr(entities[i].length-5));
    
                    if(fs.existsSync(entityPath)){
                        const entity = require(entityPath);
    
                        let entityValue = [];
                        if(fs.existsSync(entityValuePath))
                            entityValue = require(entityValuePath);
                        
                        const values = await FieldTypeValues(entityValue);
    
                        fieldTypes.push({
                            "uniqueName": entity.name.replace(/[^\w\s.]/g," ").replace(/\s+/g,' ').trim().replace(/\s/g,"-"),
                            "values": values
                        });
                    }
                    
                }
            }
        }catch(err){

            throw err;
        }

    }
    return fieldTypes;
}

module.exports = {FieldTypes};