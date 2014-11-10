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
	happy = (creds !== undefined && creds.username !== undefined && creds.password !== undefined && creds.app_key !== undefined);
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
	return function (err, response) {
		assert.notEqual(null, response);
		assert.notEqual(undefined, response[collectionName]);
		assert[(equals ? 'equal' : 'notEqual')](length, response[collectionName].length);
	};
}

function assertValidResponseObject(name, parameter, value) {
	logger.trace('%s', sys.inspect(value));

	return function (err, response) {
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
			var arguments = [ creds.username, creds.password, creds.app_key ];
			if (args !== undefined) arguments.push(args);
			if (params != undefined) arguments.push(params);
			arguments.push(this.callback);
			
			logger.trace('Arguments:\n%s', sys.inspect(arguments));
			
            pingdom[command].apply(this, arguments);
        };
    }
};

vows.describe('pingdom API').addBatch({
	
	'Actions --' : {
		'getActions' : {
			topic: api.call('getActions', {'limit' : 4 }),
			'returns a valid response': function(err, response) {
				assert.equal(null, err);
				assert.notEqual(null, response);
				assert.notEqual(undefined, response.actions);
				assert.notEqual(undefined, response.actions.alerts);
				assert.ok(response.actions.alerts.length <= 4);
			}
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
			'which contains valid entries': function(err, response) {
				assert.notEqual(undefined, response.probes[9]);
				assert.equal(true, response.probes[9].active);
			}
		}
	},
	
	'Instant Tests --' : {
		'makeOneShotTest HTTP' : {
			topic: api.call('makeOneShotTest', { 'host' : 'www.google.com', 'type' : 'http' }),
			'returns valid data' : function(err, response) {
				assert.notEqual(undefined, response.result);
				assert.notEqual(undefined, response.result.status);
				assert.notEqual(undefined, response.result.probeid);
				assert.notEqual(undefined, response.result.probedesc);
			}
		},
		
		'makeOneShotTraceroute' : {
			topic: api.call('makeOneShotTraceroute', { 'host' : 'www.google.com' }),
			'returns valid data' : function(err, response) {
				assert.notEqual(undefined, response.traceroute);
				assert.notEqual(undefined, response.traceroute.result);
				assert.notEqual(undefined, response.traceroute.probeid);
				assert.notEqual(undefined, response.traceroute.probedescription);
			}
		}
	},
	
	'Checks --' : {
		
		'getChecks' : {
	 		topic: api.call('getChecks', {'limit' : 10}),		
			'returns a valid response' : assertValidResponseCollection('checks', false, undefined),
		
			'-> getCheckDetails' : {	
				topic: function(err, getChecksResponse) {
					var parent = this;
					pingdom.getCheckDetails(creds.username, creds.password, creds.app_key, getChecksResponse.checks[0].id, function(err, response) {
						parent.callback(err, getChecksResponse, response);
					});
				},
							
				'returns a valid response' : function(err, getChecksResponse, response) {
					assert.equal(getChecksResponse.checks[0].id, response['check']['id']);
				}
			}
			/**
		},
		
		'createCheck' : {
	 		topic: api.call('createCheck', {'name' : 'new_test', 'host' : 'www.google.com', 'type' : 'http', 'url' : '/'}),
			'returns a valid response' : function(err, response) {
				assert.equal(null, err);
				assert.notEqual(undefined, response.check);
				assert.notEqual(undefined, response.check.id);
				assert.notEqual(0, response.check.id);
			},
		
			'-> modifyCheck' : {
							
				topic: function(err, createCheck) {
					pingdom.modifyCheck(creds.username, creds.password, creds.app_key, createCheck.check.id, { 'name' : 'newer_check' }, this.callback);
				},
			
				'returns a valid response' : function(err, response) {
					assert.notEqual(undefined, response.message);
					assert.equal("Modification of check was successful!", response.message);
				},
				
				'-> deleteCheck' : {
							
					topic: function(err1, modifyCheck, err2, createCheck) {
						pingdom.deleteCheck(creds.username, creds.password, creds.app_key, createCheck.check.id, this.callback);
					},
			
					'returns a valid response' : function(err, response) {
						assert.notEqual(undefined, response.message);
						assert.equal("Deletion of check was successful!", response.message);
					}
				}
			}
			**/
		}
	}
}).export(module, {error: false});





