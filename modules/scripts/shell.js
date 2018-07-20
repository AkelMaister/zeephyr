let start = (script, callback) => {
	let spawn = require('child_process').spawn,
	    cmd = spawn(script.cmd),
		stddata = '',
		issuccess = true,
		markedAs='success',
		reason=''
	
	
	cmd.stdout.on('data', (data) => {
	  stddata += data
	})

	cmd.stderr.on('data', (data) => {
	  stddata += data
	})

	cmd.on('close', (code) => {
		if (script.expectedCode == 'undefined') script.expectedCode = "0"
		if (script.expectedCode != code) {
			markedAs='error'
			reason = 'Script exit with code ' + code + '<br>Expected code: ' + script.expectedCode
			issuccess = false
		}
		if (issuccess && typeof script.findText != 'undefined' && script.findText != '') {
			if (!stddata.includes(script.findText)) {
				issuccess = false
				markedAs = 'warning'
				reason = 'String pattern does not find in stdout or stderr'
			}
		}
		return callback({'name':script.name,'data':script.cmd,'status':issuccess,'msg':reason,'markedAs':markedAs})
    })
}
	
var exports = module.exports = {
  start: start
}