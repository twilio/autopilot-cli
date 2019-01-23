
const exec = require('child_process').exec;

exec("npm install semver",(error,stdout, stderr) => {
    if(error){
        console.log(error);
    }else{

        const package = require('./package.json')
        semver = require('semver');

        const current_version = `${process.version.substr(1,process.version.length)}`,
            expected_version = `${package.engines.node.substr(2,package.engines.node.length)}`;

        if(!semver.gte(current_version,expected_version)){
            console.error(`Node 8.10.0 or later is required.`);
            process.exit(1);
        }
    }
});
