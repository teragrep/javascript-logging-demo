var http = require('http');
const SyslogMessage = require('@teragrep/rlo_08/src/main/js/SyslogMessage')
const Facility = require('@teragrep/rlo_08/src/main/js/Facility')
const Severity = require('@teragrep/rlo_08/src/main/js/Severity')
const SDElement = require('@teragrep/rlo_08/src/main/js/SDElement')
const SDParam = require('@teragrep/rlo_08/src/main/js/SDParam')
const UserAgent = require('user-agents')

var server = http.createServer(function (req, res){
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
      const userAgent = new UserAgent().toString();
      console.log(userAgent.toString());

      // Set response header
      res.writeHead(200, { 'Content-Type': 'text/html' }); 

      const dateTimestamp = '2014-07-24T17:57:36+03:00';
      const timestamp = (new Date(dateTimestamp)).getTime();

      let message = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted') //valid
        .withTimestamp(timestamp) // In case if the timestamp disabled, it will go with system timestamp.
        .withHostname('iris.teragrep.com') //valid
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740') //validatied for the PRINTUSASCII format
        .withMsgId('ID47')
        .withMsg(userAgent) // Fixed
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
        .build()

        console.log(message)
    

      let rfc5424message;
         rfc5424message = await message.toRfc5424SyslogMessage();
         res.writeHead(200, { 'Content-Type': 'text/html' });
         res.write(rfc5424message.toString(), 'utf-8', () => {
           console.log('Writing ', rfc5424message.toString());
         });
         res.end(); //end the response
      }
      load();        
    }
    else
        res.end('Invalid Request!'); //end the response   
// Server object listens on port 8081
}).listen(3000, ()=>console.log('Server running on port 3000'));