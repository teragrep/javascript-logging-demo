const requestListener = require('../../node-server/NodeServer');
const http = require('http')

const host = 'localhost';
const port = 3000;

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


