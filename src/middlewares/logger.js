const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/request.log");

// Logger Middleware
const logger = (req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}\n`;

  // Append log entry to a file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Error writing log:", err);
  });

  console.log(logEntry);
  next();
};

module.exports = logger;
