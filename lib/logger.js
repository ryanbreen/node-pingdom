var log4js = require('log4js');
var sprintf = require('sprintf').sprintf;

exports.getLogger = function(categoryName, config_file) {
	if (config_file !== undefined) {
		log4js.clearAppenders();
		log4js.configure(config_file);
	}
	
	var _logger = log4js.getLogger(categoryName || '[default]');
	
	return {		
		trace: function() {
			if(_logger.isTraceEnabled()) _logger.trace(sprintf.apply(this, arguments));
		},
		
		debug: function() {
			if(_logger.isDebugEnabled()) _logger.debug(sprintf.apply(this, arguments));
		},
		
		info: function() {
			if(_logger.isInfoEnabled()) _logger.info(sprintf.apply(this, arguments));
		},
		
		warn: function() {
			if(_logger.isWarnEnabled()) _logger.warn(sprintf.apply(this, arguments));
		},
		
		error: function() {
			if(_logger.isErrorEnabled()) _logger.error(sprintf.apply(this, arguments));
		},
		
		fatal: function() {
			if(_logger.isFatalEnabled()) _logger.fatal(sprintf.apply(this, arguments));
		}
	};
}
