const chai = require('chai');
const pact = require('pact');
const client = require('../client2');
const {term} = pact.Matchers;

const expect = chai.expect;

describe('mypact2', () => {
    const provider = pact({
        consumer: 'MyPactClient2',
        provider: 'MyPactServer',
        port: 2342,
        logLevel: 'WARN'
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
                                'Content-Type': 'application/json; charset=utf-8'
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