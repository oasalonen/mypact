# mypact
playground for consumer driven contracts with Pact

## Broker
You need to run the broker docker container in broker folder if you wish to use a Pact Broker:
```
docker-compose up
```

## Client
Create a pact and verify the client, run the client unit tests:
```
npm test
```
Publish the resulting pact to the broker:
```
npm run publishPact
```

## Server
Verify the server API:
```
npm test
```