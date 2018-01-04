
const fetch = require('node-fetch');

function ping() {
    return fetch("http://127.0.0.1:2341/ping", {
        method: 'GET',
        headers: { 
            'Accept': 'application/json'
        }
    }).then(response => response.json());
}

module.exports = {
    ping: ping
};