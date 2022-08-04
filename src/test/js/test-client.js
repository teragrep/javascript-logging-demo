const MockServer = require('../../node-server/MockServer');
const http = require('http')

const host = 'localhost';
const port = 3000;

const server = http.createServer(MockServer);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


const options = {
    hostname: 'localhost',
    port: '3000',
    path: '/ua',
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', (data) => {
        process.stdout.write(data)
    });
});

req.setHeader('user-agent', ['type=iris-teragrep', 'language=javascript']);
req.on('error', (err) => {
    console.error(err);
})
req.end();
