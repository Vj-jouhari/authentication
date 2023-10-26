const winston = require('winston');

// Define custom log levels
const customLevels = {
  custom: 0,
  info: 1,
  error: 2,
};

// Create a logger with custom levels
const logger = winston.createLogger({
  levels: customLevels,
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'Logs.log', level: 'error' }),
  ],
});
// Log messages with custom log levels
module.exports = logger;
