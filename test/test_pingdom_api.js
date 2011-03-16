var sys = require('sys');
var fs = require('fs');
var vows = require('vows');
var assert = require('assert');
var logger = require('../lib/logger.js').getLogger('pingdom_test', './test/vows_log4js.json');

var pingdom = require('../lib/pingdom.js');

var happy = false;
try {
	var credsJSON = fs.readFileSync('credentials.json', 'utf-8');
	var creds = JSON.parse(credsJSON);
	happy = (creds !== undefined && creds.username !== undefined && creds.password !== undefined);
} catch(e) {
	sys.puts(e.stack);
}

if (!happy) {
	sys.puts('To run vows, you must have a file called "credentials.json" in your working directory.');
	sys.puts('That file must contain a JSON object like this { "username" : "ryan@ryanbreen.com", "password" : "12345678"}');
	process.exit(1);
}

/**
 * Macro to validate that an array of results was properly composed.
 */
function assertValidResponseCollection(collectionName, equals, length) {
	return function (response) {
		assert.notEqual(null, response);
		assert.notEqual(undefined, response[collectionName]);
		assert[(equals ? 'equal' : 'notEqual')](length, response[collectionName].length);
	};
}

function assertValidResponseObject(name, parameter, value) {
	logger.trace('%s', sys.inspect(value));
	
	return function (response) {
		logger.trace('%s', sys.inspect(response));
		logger.trace('%s', response[name][parameter]);
		logger.trace('%s', value);
		assert.notEqual(null, response);
		assert.notEqual(undefined, response[name]);
		assert.equal(value, response[name][parameter]);
	};
}

var api = {
    call: function (command, params, args) {
        return function () {
			var arguments = [ creds.username, creds.password ];
			if (args !== undefined) arguments.push(args);
			if (params != undefined) arguments.push(params);
			arguments.push(this.callback);
            pingdom[command].apply(this, arguments);
        };
    }
};

vows.describe('pingdom API').addBatch({
	'Actions --' : {
		'getActions' : {
			topic: api.call('getActions', {'limit' : 4 }),
			'returns a valid response': assertValidResponseCollection('actions', true, 4)
		}
	},
	
	'Reference --' : {
		'getReference' : {
			topic: api.call('getReference'),
			'returns region data': assertValidResponseCollection('regions', false, 0),
			'returns timezone data': assertValidResponseCollection('timezones', false, 0),
			'returns datetime formats': assertValidResponseCollection('datetimeformats', false, 0),
			'returns number formats': assertValidResponseCollection('numberformats', false, 0)
		}
	},
	
	'Probes --' : {
		'getProbes' : {
			topic: api.call('getProbes', {'limit' : 10, 'onlyactive' : true}),
			'returns probe server list': assertValidResponseCollection('probes', true, 10),
			'which contains valid entries': function(response) {
				assert.notEqual(undefined, response.probes[9]);
				assert.equal(true, response.probes[9].active);
			}
		}
	},
	
	'Instant Tests --' : {
		'makeOneShotTest HTTP' : {
			topic: api.call('makeOneShotTest', { 'host' : 'www.google.com', 'type' : 'http' }),
			'returns valid data' : function(response) {
				assert.notEqual(undefined, response.result);
				assert.notEqual(undefined, response.result.status);
				assert.notEqual(undefined, response.result.probeid);
				assert.notEqual(undefined, response.result.probedesc);
			}
		},
		
		'makeOneShotTraceroute' : {
			topic: api.call('makeOneShotTraceroute', { 'host' : 'www.google.com' }),
			'returns valid data' : function(response) {
				assert.notEqual(undefined, response.traceroute);
				assert.notEqual(undefined, response.traceroute.result);
				assert.notEqual(undefined, response.traceroute.probeid);
				assert.notEqual(undefined, response.traceroute.probedescription);
			}
		}
	},
	
	'Checks --' : {
		'getChecks' : {
	 		topic: api.call('getChecks', {}, this.callback),		
			'returns a valid response' : assertValidResponseCollection('checks', false, 0),
		
			'-> getCheckDetails' : {
							
				topic: function(getChecksResponse) {
					logger.trace('this:\n%s', sys.inspect(this));
					this.id = getChecksResponse.checks[0].id;
					pingdom.getCheckDetails(creds.username, creds.password, this.id, this.callback);
				},
			
				'returns a valid response' : function(response) {
					assert.equal(this.id, response['check']['id']);
				}
			}
			/**
		},
		'createCheck' : {
	 		topic: api.call('createCheck', {'name' : 'new_test', 'host' : 'www3.crowdfore.com', 'type' : 'http', 'url' : '/'}),
			
			'returns a valid response' : assertValidResponseObject('checks', false, 0),
		
			'-> getCheckDetails' : {
							
				topic: function(getChecksResponse) {
					this.id = getChecksResponse.checks[0].id;
					pingdom.getCheckDetails(creds.username, creds.password, getChecksResponse.checks[0].id, this.callback);
				},
			
				'returns a valid response' : function(response) {
					logger.trace('%s', sys.inspect(response));
					assert.equal(this.id, response['check']['id']);
				},
			
				'returns a valid response2' : assertValidResponseObject('check', 'id', this.id)
			}
			**/
		}
	}
}).export(module, {error: false});





