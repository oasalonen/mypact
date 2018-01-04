const express = require('express');

function start() {
    const app = express();
    app.get('/ping', (req, res) => {
        res.json({ pong: true });
    });
    
    return app;
}

module.exports = {
    start: start
}