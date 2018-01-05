const {expect} = require('chai');
const pact = require('pact');
const client1 = require('../client1');
const {term} = pact.Matchers;

describe('mypact1', () => {
    const provider = pact({
        consumer: 'MyPactClient1',
        provider: 'MyPactServer',
        port: 2341,
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
                return client1.ping()
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
    });

    describe('when server is out of pongs', () => {
        before(() => {
            provider.addInteraction({
                state: 'server is out of pongs',
                uponReceiving: 'a ping',
                withRequest: {
                    method: 'GET',
                    path: '/ping',
                },
                willRespondWith: {
                    status: 200,
                    body: { pong: false}
                }
            })
        });

        describe('and we ping', () => {
            it('should not pong', () => {
                return client1.ping()
                    .then((pong) => {
                        expect(pong).to.have.property('pong', false);
                    });
            });
        });
        
        describe('when interacting with server', () => {
            it('should validate interactions', () => {
                return provider.verify();
            });
        });
    });
    
    after(() => {
        provider.finalize();
    });
});