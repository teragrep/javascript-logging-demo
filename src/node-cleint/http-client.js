const http = require('http')

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
