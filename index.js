// basics
const express = require("express");
// middleware
const Sentry = require('@sentry/node');
const SENTRY_DSN = process.env.SENTRY_DSN || false;
// config/env
require('dotenv').config();

// error tracking
if (process.env.NODE_ENV === 'production' && SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN });
  Sentry.configureScope((scope) => {
    scope.setUser({"username": "event-reminder-droplet"});
  });
}

// import action fns
const crons = require('./crons');

// register app and server
const app = express();

// sentry
if (process.env.NODE_ENV === 'production' && SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}
if (process.env.NODE_ENV === 'production' && SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
  app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });
}

// server
var server = app.listen(3000, () => console.log('Server listening'));

// call crons
if (crons && typeof crons === 'object') {
  crons.dailyCron();
}
else {
  server.close(() => {
    console.log('Crons not found. Process terminated.');
    createFile('logs/error-log.txt', `Crons not found. Process terminated at: ${new Date().toISOString()}\r\n`); // update error log file
    process.exit(9);
  })
}

// handle source file backups
const watchBackupFolder = require('./backup');
watchBackupFolder('./data');

module.exports = app;
