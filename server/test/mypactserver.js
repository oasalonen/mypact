const {expect} = require('chai');
const path = require('path');
const pact = require('pact');
const app = require('../server.js');

const PORT = 2349;

describe('mypactserver', () => {
    before((done) => {
        const server = app.start();
        
        server.post('/setup', (req, res) => {
            console.log(req.body);

            switch (req.body.state) {
                case 'all is well':
                    server.hasPongs = true;
                    break;
                case 'server is out of pongs':
                    console.log('Setting pongs to false');
                    server.hasPongs = false;
                break;
            }

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
            //pactUrls: [path.resolve(process.cwd() + '/../client/pacts/mypactclient-mypactserver.json')],
            pactBrokerUrl: 'http://localhost:2340',
            providerVersion: '1.0.0',
            publishVerificationResult: true
        };
        
        return pact.Verifier.verifyProvider(opts)
            .then(output => {
                //console.log(output);
            });
    });
});