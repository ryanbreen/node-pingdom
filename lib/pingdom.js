var sys = require('sys');
var http = require('http');
var https = require('https');
var url = require('url');
var querystring = require('querystring');
var Buffer = require('buffer').Buffer;
var sprintf = require('sprintf').sprintf;
var logger = require('./logger.js').getLogger('pingdom');

var DEFAULT_API_VERSION = '2.0';
var current_api_version = DEFAULT_API_VERSION;

exports.setAPIVersion = function(ver) {
	current_api_version = ver;
};

/**
 * Returns a list of actions (alerts) that has been generated for your account.
 */
exports.getActions = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/actions', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of the latest error analysis results for a specified check.
 */
exports.getAnalysis = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/analysis/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns the raw result for a specified error analysis. This data is primarily intended for internal use, 
 * however, there is no real documentation for this data at the moment. In the future, we may add a new API
 * method that provides a more user-friendly format.
 */
exports.getRawAnalysis = function(username, password, checkid, analysisid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 6);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/analysis/%s/%s', current_api_version, checkid, analysisid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list overview of all checks.
 */
exports.getChecks = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/checks', current_api_version);	
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a detailed description of a specified check.
 */
exports.getCheckDetails = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/checks/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Creates a new check with settings specified by provided parameters.
 */
exports.createCheck = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/checks', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'POST', paramsToQueryString(args.params), args.callback);
};

/**
 * Modify settings for a check. The provided settings will overwrite previous values. Settings not provided
 * will stay the same as before the update. To clear an existing value, provide an empty value. Please note
 * that you cannot change the type of a check once it has been created.
 */
exports.modifyCheck = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/checks/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'PUT', paramsToQueryString(args.params), args.callback);
};

/**
 * Deletes a check. THIS METHOD IS IRREVERSIBLE! You will lose all collected data. Be careful!
 */
exports.deleteCheck = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/checks/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'DELETE', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of all contacts.
 */
exports.getContacts = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/contacts', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Create a new contact.
 */
exports.createContact = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/contacts', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'POST', paramsToQueryString(args.params), args.callback);
};

/**
 * Modify a contact.
 */
exports.modifyContact = function(username, password, contactid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/contacts/%s', current_api_version, contactid);
	sendMessage(args.username, args.password, parameterized_url, 'PUT', paramsToQueryString(args.params), args.callback);
};

/**
 * Deletes a contact.
 */
exports.deleteContact = function(username, password, contactid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/contacts/%s', current_api_version, contactid);
	sendMessage(args.username, args.password, parameterized_url, 'DELETE', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of all Pingdom probe servers.
 */
exports.getProbes = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/probes', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Get a reference of regions, timezones and date/time/number formats and their identifiers.
 */
exports.getReference = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reference', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of email report subscriptions.
 */
exports.getEmailReportList = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.email', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Creates a new email report.
 */
exports.createEmailReport = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.email', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'POST', paramsToQueryString(args.params), args.callback);
};

/**
 * Modify an email report.
 */
exports.modifyEmailReport = function(username, password, reportid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.email/%s', current_api_version, reportid);
	sendMessage(args.username, args.password, parameterized_url, 'PUT', paramsToQueryString(args.params), args.callback);
};

/**
 * Delete an email report.
 */
exports.deleteEmailReport = function(username, password, reportid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.email/%s', current_api_version, reportid);
	sendMessage(args.username, args.password, parameterized_url, 'DELETE', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of public (web-based) reports.
 */
exports.getPublicReportList = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.public', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Activate public report for a specified check.
 */
exports.publishPublicReport = function(username, password, reportid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.public/%s', current_api_version, reportid);
	sendMessage(args.username, args.password, parameterized_url, 'PUT', paramsToQueryString(args.params), args.callback);
};

/**
 * Deactivate public report for a specified check.
 */
exports.withdrawPublicReport = function(username, password, reportid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.public/%s', current_api_version, reportid);
	sendMessage(args.username, args.password, parameterized_url, 'DELETE', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns a list of shared reports (banners).
 */
exports.getSharedReportList = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.shared', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Create a shared report (banner).
 */
exports.createSharedReport = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.shared', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'POST', paramsToQueryString(args.params), args.callback);
};

/**
 * Delete a shared report (banner).
 */
exports.deleteSharedReport = function(username, password, reportid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/reports.shared/%s', current_api_version, reportid);
	sendMessage(args.username, args.password, parameterized_url, 'DELETE', paramsToQueryString(args.params), args.callback);
};

/**
 * Get the current time of the API server.
 */
exports.getCurrentServerTime = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/servertime', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Returns all account-specific settings.
 */
exports.getSettings = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/settings', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Modify account-specific settings.
 */
exports.modifySettings = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('https://api.pingdom.com/api/%s/settings', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'PUT', paramsToQueryString(args.params), args.callback);
};

/**
 * Return a list of raw test results for a specified check
 */
exports.getRawCheckResults = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/results/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Get a summarized response time / uptime value for a specified check and time period.
 */
exports.getSummaryAverage = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/summary.average/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Get a list of status changes for a specified check and time period.
 */
exports.getSummaryOutage = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/summary.outage/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Get a list of intervals of average response time and uptime. Useful for generating graphs.
 */
exports.getSummaryPerformance = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/summary.performance/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * RGet a list of probes that performed tests for a specified check during a specified period.
 */
exports.getSummaryProbes = function(username, password, checkid, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 5);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/summary.probes/%s', current_api_version, checkid);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Performs a single test using a specified Pingdom probe against a specified target.
 */
exports.makeOneShotTest = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/single', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Perform a traceroute to a specified target from a specified Pingdom probe.
 */
exports.makeOneShotTraceroute = function(username, password, params, callback) {
	var args = reconcileArgs(Array.prototype.slice.call(arguments), 4);
	var parameterized_url = sprintf('http://api.pingdom.com/api/%s/traceroute', current_api_version);
	sendMessage(args.username, args.password, parameterized_url, 'GET', paramsToQueryString(args.params), args.callback);
};

/**
 * Call the JSON API with the provided method and query parameters.  Call the callback function once the
 * request is completed, passing in the JSON object returned from the server or null in case of error.
 */
function sendMessage(username, password, api, method, query, callback) {
	
	logger.trace('api:\n%s %s', api, query);
	
	var parsedUrl = url.parse(api);
	var host = parsedUrl.host;
	var port = parsedUrl.port === undefined ? 443 : parsedUrl.port;
	var path =  (parsedUrl.pathname + ((query === undefined) ? '' : ('?' + query)));
		
	// For basic auth
	var b = new Buffer([username, password].join(':'));
	var request = https.request({ 'host': host, 'port': port,
		'path': path,
		'method': method,
		'headers': {
			'Host': host,
			'Connection': 'keep-alive',
			'Authorization': "Basic " + b.toString('base64')
		}
	}, function(response) {
		logger.trace('STATUS: %s', response.statusCode);
		
		if (response.statusCode > 399) {
			logger.error('Got error response code %s, request failed.', response.statusCode);
			callback.apply(this, [ null ]);
		}
		
		response.setEncoding('utf8');
		var responseBody = '';
		response.on('data', function (chunk) {
			responseBody += chunk;
		});
		response.on('end', function () {
			try {
				var response = JSON.parse(responseBody);
				callback.apply(this, [ response ]);
			} catch(e) {
				logger.error('Failed to parse JSON response:\n%s', e.stack);
				callback.apply(this, [ null ]);
			}
		});
	});
	
	request.on('error', function(err) {
		logger.error('Failed to send pingdom request:\n%s', sys.inspect(err));
		callback.apply(this, [ null ]);
	});
	
	request.end();
}

/**
 * Turn a hash of parameters into a query string
 */ 
function paramsToQueryString(params, post_style) {
	if (params === null) return '';
	return querystring.stringify(params);
}

/*
 * Given an arguments array with an expected length, build a hash of arguments which provides all the
 * information needed for each method.
 */
function reconcileArgs(argsArr, expected) {
	return {
		'username' : argsArr[0],
		'password' : argsArr[1],
		'params' : ( argsArr.length === expected ? argsArr[argsArr.length-2] : null),
		'callback' : argsArr[argsArr.length-1]
	};
}
