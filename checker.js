let init = (config, callback) => {
  let serviceDone = false,
      buildsDone = false,
      scriptsDone = false,
      json = {}

  json["Services"] = {}
  json["Builds"] = {}
  json["Scripts"] = {}
	if (typeof config.services != 'undefined')
	  services(config.services, (r) => {
		serviceDone = true
		json["Services"] = r
		if (serviceDone && buildsDone && scriptsDone)
			return callback(json)
	  })
	else {
		serviceDone = true
		if (serviceDone && buildsDone && scriptsDone)
			return callback(json)
	}
	if (typeof config.buildProviders != 'undefined')
	  builds(config.buildProviders, (r) => {
		buildsDone = true
		json["Builds"] = r
		if (serviceDone && buildsDone && scriptsDone)
		  return callback(json)
	  })
	else {
		buildsDone = true
		if (serviceDone && buildsDone && scriptsDone)
			return callback(json)

	}

	if (typeof config.scripts != 'undefined')
	  scripts(config.scripts, (r) => {
		scriptsDone = true
		json["Scripts"] = r
		if (serviceDone && buildsDone && scriptsDone)
		  return callback(json)
	  })
	else {
		scriptsDone = true
		if (serviceDone && buildsDone && scriptsDone)
			return callback(json)

	}
},
scripts = (scriptsData, callback) => {
	let scripts = {},
		scriptscompleted = 0

	for (let num in scriptsData) {
		let script = scriptsData[num]
		const module = require('./modules/scripts/' + script.type + '.js')
		module.start(script, (r) => {
			scripts[num] = r
			scriptscompleted++
			if (scriptscompleted == scriptsData.length)
				return callback(scripts)
		})
	}
},
services = (servicesData, callback) => {
	let srvs = {},
		srvscompleted = 0

	for (let num in servicesData) {
		let service = servicesData[num]
		const module = require('./modules/services/' + service.type + '.js')
		module.start(service, (r) => {
			srvs[num] = r
			srvscompleted++
			if (srvscompleted == servicesData.length)
				return callback(srvs)
		})
	}
},
builds = (buildProvidersData, callback) => {
	let builds = [],
		tmp = [],
		buildProviderCount = 0

	for (let buildProvider in buildProvidersData) {
		let provider = buildProvidersData[buildProvider]
		const module = require('./modules/buildProviders/' + provider.type + '.js')
		module.start(provider, (r) => {
			builds = builds.concat(r)
			buildProviderCount++
			if (buildProviderCount == buildProvider.length)
				return callback(builds)
		})
    }
}

var exports = module.exports = {
  init: init
}
