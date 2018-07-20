const request = require('request')

let start = (provider, callback) => {
  let url = provider.url,
      builds = []

  if (typeof provider.httpAuth != 'undefined' && provider.httpAuth)
    if (provider.asGuest)
        url+='/guestAuth'
    else
        url+='/httpAuth'

  request.get({
    url: url + '/app/rest/buildTypes',
    rejectUnauthorized: false,
    headers: {
      'accept': 'application/json'
    }
  }, (error, resp, body) => {
    if (error) return callback = [{'name': provider.name, 'status': false, 'msg': error, 'markedAs': 'warning', 'data': provider.name}]
    let projectlist = JSON.parse(body),
		projectcount = 0
		
    projectlist.buildType.forEach((project) => {
		teamcityBuild(provider, project, (r) => {
			projectcount++
			if (typeof r != 'undefined')
			    builds.push(r)
			if (projectcount == projectlist.buildType.length) {
				return callback(builds)
			}
		})
    })
  })
},
teamcityBuild = (provider, project, callback) => {
  let url = provider.url,
      builds = []

  if (typeof provider.httpAuth != 'undefined' && provider.httpAuth)
    if (provider.asGuest)
        url+='/guestAuth'
    else
        url+='/httpAuth'

  request.get({
	url: url + '/app/rest/builds?locator=buildType:(id:' + project.id + '),count:1',
	rejectUnauthorized: false,
	headers: {
	  'accept': 'application/json'
	}
  }, (e, r, b) => {
	let projectbody,
	    markedAs = 'success'

	if (typeof b != 'undefined') {
		projectbody = JSON.parse(b)
	} else {
		return callback()
	}

	if (typeof projectbody.build != 'undefined' && projectbody.build.length > 0) {
	  let status
	  if (projectbody.build["0"].status == 'SUCCESS') {
		status = true
	  } else {
		status = false
		markedAs = 'error'
	  }
	  if (!(typeof provider.failsOnly != 'undefined' && provider.failsOnly && projectbody.build["0"].status == 'SUCCESS'))
		return callback({'name': project.projectName + ' / ' + project.name, 'status': status, 'msg': '', 'markedAs': markedAs, 'data': provider.name})
	  else
		return callback()
    } else {
		return callback()
	}
  })
}
	
var exports = module.exports = {
  start: start
}