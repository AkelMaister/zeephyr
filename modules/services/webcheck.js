const request = require('request')

let start = (service, callback) => {
	let start = new Date()
	request.get(service.url, (error, res, body) => {
		let issuccess,
			reason,
			markedAs = 'success',
			responseTime = new Date() - start
		if (res.statusCode == service.code) {
			issuccess = true
		} else {
			issuccess = false
			markedAs = 'error'
			reason = 'Status code: ' + res.statusCode + '<br/>Expected code: ' + service.code
		}
		if (issuccess && typeof service.findText != 'undefined' && service.findText != '') {
			if (!body.includes(service.findText)) {
				issuccess = false
				markedAs = 'warining'
				reason = 'String pattern does not find on page'
			}
		}
		return callback({'name':service.name,'data':service.url,'status':issuccess,'msg':reason,'responseTime':responseTime,'markedAs':markedAs})
	})
}
	
var exports = module.exports = {
  start: start
}