const Tasks = require('./Tasks'),
      Task_Fields = require('./Task_Fields'),
      Task_Samples = require('./Task_Samples'),
      FieldTypes = require('./FieldTypes'),
      FieldTypeValues = require('./FieldTypeValues');

module.exports = Object.assign({},
    Tasks,
    Task_Fields,
    Task_Samples,
    FieldTypes,
    FieldTypeValues
);