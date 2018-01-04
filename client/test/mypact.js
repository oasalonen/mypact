const chai = require('chai');
const pact = require('pact');
const client = require('../client');
const {term} = pact.Matchers;

const expect = chai.expect;

describe('mypact', () => {
    const provider = pact({
        consumer: 'MyPactClient',
        provider: 'MyPactServer',
        port: 2341,
        logLevel: 'WARN',
        spec: 1
    });

    describe('when all is well', () => {
        before((done) => {
            provider.setup()
                .then(() => {
                    provider.addInteraction({
                        state: 'all is well',
                        uponReceiving: 'a ping',
                        withRequest: {
                            method: 'GET',
                            path: '/ping',
                            headers: { 'Accept': 'application/json' }
                        },
                        willRespondWith: {
                            status: 200,
                            headers: { 
                                'Content-Type': term({
                                    matcher: '^application/json',
                                    generate: 'application/json'
                                }) 
                            },
                            body: { pong: true }
                        }
                    })
                })
                .then(() => done());
        });

        describe('and we ping', () => {
            it('should pong', () => {
                return client.ping()
                    .then((pong) => {
                        expect(pong).to.have.property('pong', true);
                    });
            });
        });
        

        describe('when interacting with server', () => {
            it('should validate interactions', () => {
                return provider.verify();
            });
        });

        after(() => {
            provider.finalize();
        });
    });
});