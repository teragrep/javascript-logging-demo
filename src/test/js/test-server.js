const requestListener = require('../../node-server/MockServer');
const http = require('http');
const MockServer = require('../../node-server/MockServer');
/**
 * Lets disable this server and integrated with the client call instead
 */

/*
const host = 'localhost';
const port = 1601;

const server = http.createServer(MockServer);;
server.setupConnection(port, host)


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
*/