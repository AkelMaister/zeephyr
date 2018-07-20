'use strict';

const checker = require('./checker.js'),
      express = require('express'),
      fs = require('fs'),
      web = express(),
      configfile = process.argv["2"] ? process.argv["2"] : 'config.json'

let confprepare = (rawconfig, callback) => {
		let preparedconfig = {}
		preparedconfig.name = typeof rawconfig.name != 'undefined' ? rawconfig.name : '',
		preparedconfig.port = typeof rawconfig.name != 'undefined' ? rawconfig.port : '8543',
		preparedconfig.logo = typeof rawconfig.logo != 'undefined' ? rawconfig.logo : '',
		preparedconfig.theme = typeof rawconfig.theme != 'undefined' ? rawconfig.theme : 'darkly',
		preparedconfig.webinterval = typeof rawconfig.webinterval != 'undefined' ? rawconfig.webinterval : '60000',
                preparedconfig.checkinterval = typeof rawconfig.checkinterval != 'undefined' ? rawconfig.checkinterval : '60000',
		preparedconfig.showHeader = typeof rawconfig.showHeader != 'undefined' ? rawconfig.showHeader : false,
		preparedconfig.themeClass = {}

		if (typeof rawconfig.services != 'undefined')
			preparedconfig.services = rawconfig.services
		if (typeof rawconfig.buildProviders != 'undefined')
			preparedconfig.buildProviders = rawconfig.buildProviders
		if (typeof rawconfig.scripts != 'undefined')
			preparedconfig.scripts = rawconfig.scripts

		if (typeof rawconfig.themeClass != 'undefined' && typeof rawconfig.themeClass.success != 'undefined')
			preparedconfig.themeClass.success = rawconfig.themeClass.success
		else
			preparedconfig.themeClass.success = 'bg-success'

		if (typeof rawconfig.themeClass != 'undefined' && typeof rawconfig.themeClass.warning != 'undefined')
			preparedconfig.themeClass.warning = rawconfig.themeClass.warning
		else
			preparedconfig.themeClass.warning = 'bg-warning'

		if (typeof rawconfig.themeClass != 'undefined' && typeof rawconfig.themeClass.error != 'undefined')
			preparedconfig.themeClass.error = rawconfig.themeClass.error
		else
			preparedconfig.themeClass.error = 'bg-danger'

		return callback(preparedconfig)
	},
    result = {},
	config = confprepare(JSON.parse(fs.readFileSync(configfile)), (r) => {
		// Usage ejs module for view template engine
		web.set('view engine', 'ejs')
		// Set directory 'public' for public usage
		web.use(express.static('public'));

		// Return main page
		web.get('/', (err, res, body) => {
		  res.render('index', { name: r.name, logo: r.logo, theme: r.theme, themeClass: JSON.stringify(r.themeClass), interval: r.webinterval, showHeader: r.showHeader })
		})

		// Return json with statuses
		web.get('/status', (err, res, body) => {
		  res.send(result)
		})

		// Start serve
		web.listen(r.port, () => {
		  console.log("Zeephyr listen on port: " + r.port)
		})
		return r
	}),
	successCount = (arr) => {
		let successCount = 0,
		    errorCount = 0
		for (let i in arr) {
			if (arr[i].status === true)
				successCount++
			else
				errorCount++
		}
		return "Success: " + successCount + ". Error: " + errorCount
	},
    getinfo = () => {
      checker.init(config, (r) => {
		console.log("----------------------------")
		console.log("INFO: Recieved information")
		console.log("INFO: Services: " + Object.keys(r.Services).length + ". " + successCount(r.Services))
		console.log("INFO: Builds: " + Object.keys(r.Builds).length + ". " + successCount(r.Builds))
		console.log("INFO: Scripts: " + Object.keys(r.Scripts).length + ". " + successCount(r.Scripts))
        result = r
      })
    }

// Request data to store on result variable
getinfo()
setInterval(getinfo, config.checkinterval)

// Reread config file every 60s
setInterval(() => {
  config = confprepare(JSON.parse(fs.readFileSync(configfile)), (r) => {return r})
}, config.checkinterval)
