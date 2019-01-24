

const package = require('./package.json')

const current_version = `${process.version.substr(1,process.version.length)}`,
    expected_version = `${package.engines.node.substr(2,package.engines.node.length)}`;

if(!compare(current_version,expected_version)){
    console.error(`Node 8.10.0 or later is required.`);
    process.exit(1);
}

// comparing node version
function compare(a, b) {
    if (a === b) {
       return true;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return true;
        }

        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return false;
        }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length >= b_components.length) {
        return true;
    }

    if (a_components.length < b_components.length) {
        return false;
    }

    // Otherwise they are the same.
    return true;
}
    

