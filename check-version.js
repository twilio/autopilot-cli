
const package = require('./package.json');
const current_version = `'${process.version.substr(1,process.version.length)}'`,
      expected_version = `'${package.engines.node.substr(2,package.engines.node.length)}'`;


if(!(current_version>=expected_version)){
    console.error(`Node 8.10 or later is required.`);
    process.exit(1);
}

