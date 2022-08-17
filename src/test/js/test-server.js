const Server = require('../../node-server/Server')
const { SyslogMessage, Facility, SDElement, SDParam, Severity } = require('@teragrep/rlo_08')
const { RelpConnection, RelpBatch } = require('@teragrep/rlp_02')
const async = require('async');
const http = require('http')

let relpConnection;
const host = 'localhost';
const port = 1601;


var server = new Server(function (req, res){
    
})

server.setDebugMode(false); // This flag will set to disable the all the log 🤠

server.listen(3000, () => {
    //await setupConnection(port, host)
    console.log('Listening port 3000')

});

/*
* This ensures to confirm the connection on the request, setup the relpconnection 
* 
*/
server.on("request", async(req, res) => {
    await setupConnection(port, host) //  setup the relpconnection to the java-relp-demo application
    if(req.url == '/'){
        return getHome(req, res)
    }
    else if(req.url == "/ua"){
        return getUA(req, res)
    }
})

server.on("connection", (socket) =>{
    
    console.log('Connected')
})

 function getHome(req,  res){
    res.write(
        `<html><body style="text-align:center;">
          <h1 style="color:green;">Syslog Node-Server</h1>
          <h2>Logging events Main</h2>
         <br />  <br />
          <a href="https://github.com/teragrep/java-relp-server-demo/">
           Java Relp Server Logging Demo
          </a>  
          </body></html>`);
      res.end();//end the response
}

/*
* Endpoint for access to the generated response with user agent and syslog message 
*/
async function getUA(req, res){

    const userAgent = req.headers['user-agent']
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
  
    // Set response header
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
    const dateTimestamp = '2014-07-24T17:57:36+03:00';
    const timestamp = (new Date(dateTimestamp)).getTime();
          
    let message = new SyslogMessage.Builder()
            .withAppName('bulk-data-sorted') //valid
         // .withTimestamp(timestamp) // In case if the timestamp disabled, it will go with system timestamp.
            .withHostname(ip) //valid
            .withFacility(Facility.LOCAL0)
            .withSeverity(Severity.INFORMATIONAL)
            .withProcId('8740') 
            .withMsgId('ID47')
            .withMsg(userAgent) // Fixed
            .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application")))  
            .withDebug(true)
            .build()
  
    let rfc5424message;
        rfc5424message = await message.toRfc5424SyslogMessage();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(rfc5424message.toString(), 'utf-8', async() => {
            await commit(rfc5424message)
        });
        res.end(); //end the response
}

async function commit(msg){
    return new Promise(async(resolve, reject) => {
      let relpBatch = new RelpBatch();
      relpBatch.insert(msg);
      
      let resWindow = await relpConnection.commit(relpBatch);
      console.log('After Batch-1 Completion....', resWindow)
      
      let notSent = (resWindow === true) ? true : false; //Test purpose 
      while(notSent){                          
        let res = await relpBatch.verifyTransactionAllPromise();                              
        if(res){
            notSent = false;
            console.log('VerifyTransactionAllPromise......', res);
            resolve(true);
            }
        else{
          reject(false);
            }                            
      }    
     return resolve(true);
    }) 
}

async function setupConnection(port, host){
    return new Promise(async (resolve, reject) => {
      relpConnection = new RelpConnection();
      let conn = await relpConnection.connect(port, host);	
      console.log('Connectig...',host,' at PORT ', port)
      resolve(relpConnection)
    })
  }


/**
 *  Act as a client and make the request to the server
 */

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
