const {expect} = require('chai');
const path = require('path');
const pact = require('pact');
const app = require('../server.js');

const PORT = 2342;

describe('mypactserver', () => {
    before((done) => {
        const server = app.start();

        server.post('/setup', (req, res) => {
            res.end();
        });

        server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
        done();
    });

    it ('does not break the client pact', function () {
        this.timeout(5000);
        
        let opts = {
            providerBaseUrl: `http://localhost:${PORT}`,
            providerStatesSetupUrl: `http://localhost:${PORT}/setup`,
            provider: 'MyPactServer',
            pactUrls: [path.resolve(process.cwd() + '/../client/pacts/mypactclient-mypactserver.json')],
            providerVersion: "1.0.0"
        };
        
        return pact.Verifier.verifyProvider(opts)
            .then(output => {
                //console.log(output);
            });
    });
});