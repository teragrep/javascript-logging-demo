const { exec } = require('child_process')

exec('java -jar ../../src/java-relp-server-demo/java-relp-server-demo-jar-with-dependencies.jar', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if(error !== null) {
        console.log(`exec error: ${error}`)
    }
})