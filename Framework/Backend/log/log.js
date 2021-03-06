const fs = require('fs');
const Winston = require('./winston.js');
const InfoLoggerSender = require('./infologger-sender.js');

let winston = null;
let infologger = null;

exports.configure = function(config) {
  if (config && config.winston) {
    winston = new Winston(config.winston);
  }
  if (!infologger && config && config.infologger && fs.existsSync(config.infologger.execPath)) {
    infologger = new InfoLoggerSender(winston, config.infologger.execPath);
  }
};

exports.debug = function(log) {
  if (!winston) {
    winston = new Winston();
    winston.instance.log('warn', 'Created default instance of logger');
  }
  winston.instance.log('debug', log);

  if (infologger) {
    const logObj = {
      severity: 'D',
      message: log
    };
    infologger.send(logObj);
  }
};

exports.warn = function(log) {
  if (!winston) {
    winston = new Winston();
    winston.instance.log('warn', 'Created default instance of logger');
  }
  winston.instance.log('warn', log);

  if (infologger) {
    const logObj = {
      severity: 'W',
      message: log
    };
    infologger.send(logObj);
  }
};

exports.info = function(log) {
  if (!winston) {
    winston = new Winston();
    winston.instance.log('warn', 'Created default instance of logger');
  }
  winston.instance.log('info', log);

  if (infologger) {
    const logObj = {
      severity: 'I',
      message: log
    };
    infologger.send(logObj);
  }
};

exports.error = function(log) {
  if (!winston) {
    winston = new Winston();
    winston.instance.log('warn', 'Created default instance of logger');
  }
  winston.instance.log('error', log);

  if (infologger) {
    const logObj = {
      severity: 'E',
      message: log
    };
    infologger.send(logObj);
  }
};
