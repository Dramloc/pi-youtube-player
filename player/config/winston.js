const winston = require('winston');

module.exports = {
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
};
