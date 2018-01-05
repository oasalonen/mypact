const express = require('express');
const bodyParser = require('body-parser');

function start() {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.hasPongs = true;

    app.get('/ping', (req, res) => {
        res.json({ pong: app.hasPongs });
    });
    
    return app;
}

module.exports = {
    start: start
}