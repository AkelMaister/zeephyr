const ping = require ('net-ping')

let start = (service, callback) => {
    var session = ping.createSession({
        packetSize: 16,
        retries: 1,
        timeout: 500,
    });

    session.pingHost(service.url, function (error, target) {
        if (error) {
            return callback({'name':service.name,'data':service.url,'status':false,'msg':error.toString(),'markedAs':'error'})
        }
        else
            return callback({'name':service.name,'data':service.url,'status':true,'msg':'','markedAs':'success'})
    });
}
	
var exports = module.exports = {
  start: start
}