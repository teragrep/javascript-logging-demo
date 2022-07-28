const http = require('http');
const SyslogMessage = require('@teragrep/rlo_08/src/main/js/SyslogMessage')
const Facility = require('@teragrep/rlo_08/src/main/js/Facility')
const Severity = require('@teragrep/rlo_08/src/main/js/Severity')
const SDElement = require('@teragrep/rlo_08/src/main/js/SDElement')
const SDParam = require('@teragrep/rlo_08/src/main/js/SDParam')
//const {RelpBatch, RelpConnection, RelpRequest, RelpWindow} = require("@teragrep/rlp_02");
const RelpConnection = require('@teragrep/rlp_02/src/main/js/RelpConnection')
const RelpBatch = require('@teragrep/rlp_02/src/main/js/RelpBatch')
const async = require('async')




const requestListener = function (req, res) {
    if (req.url == '/') {
        // Set response content    
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
       
    }else if (req.url == "/javademo") {
           
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
          <html><body style="text-align:center;">
            <h1 style="color:green;">Welcome to Syslog Server</h1>
            <a href="https://github.com/teragrep/java-relp-server-demo/">
             Java Relp Server Logging Demo
            </a>
          </body></html>`);
        res.end();//end the response
       
    }
    else if (req.url == "/ua") {

      async function load() {
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
          .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
          .withDebug(true)
          .build()

    

        let rfc5424message;
        rfc5424message = await message.toRfc5424SyslogMessage();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(rfc5424message.toString(), 'utf-8', () => {
       // console.log('Writing ', rfc5424message.toString());
        sendMessage(rfc5424message)
       });
        res.end(); //end the response
      }
      load();        
    }
    else
        res.end('Invalid Request!'); //end the response   
};
module.exports = requestListener;

function sendMessage(msg){

  let relpConnection = new RelpConnection();
  let host = '127.0.0.1'; 
  let rlp_03_Port = 1601; // Tested with Docker CFE
  
  
  async.waterfall(
    [
		function init(setConnect) {
            setConnect(null, rlp_03_Port, host)
        },
		connect,
    commit,
    disconnect
    ],
  
    function (err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log('No Error')
        }
    }
  );
  async function connect() {
    let conn = await relpConnection.connect(rlp_03_Port, host);	
    console.log('Connectig...',host,' at PORT ', rlp_03_Port)
    return conn;
  }
  async function disconnect(state) {
    if(state){
      await relpConnection.disconnect();
      }
    else {
    console.log('Check the connection...')
    }
  }
  
  async function commit(){
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
}