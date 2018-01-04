const pact = require('@pact-foundation/pact-node');
const path = require('path');

let opts = {
    pactFilesOrDirs: [path.resolve(process.cwd() + '/pacts')],
    pactBroker: 'http://localhost:2340',
    consumerVersion: "1.0.0"
};
 
pact.publishPacts(opts).then(function () {
    console.log('Pacts successfully published');
});