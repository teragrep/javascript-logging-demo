const { exec } = require('child_process')
/**
 * @toddo This is not an ideal approach, for an experimental purpose
 */
exec('java -jar ../../src/java-relp-server-demo/java-relp-server-demo-jar-with-dependencies.jar', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if(error !== null) {
        console.log(`exec error: ${error}`)
    }
})