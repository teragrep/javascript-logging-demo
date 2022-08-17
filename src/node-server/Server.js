const http = require('http')
const { RelpConnection } = require('@teragrep/rlp_02')


class Server extends http.Server {

    constructor(){
        super()
    }

    start(port, host){
        return this.start
    }

    setDebugMode(mode){
        if(mode == false){
            return console.log = () => {};
        }
        else if(mode == true)  {
            return (...args) => {
            console.log(...args)
          }     

        }
    }

}
module.exports = Server;
