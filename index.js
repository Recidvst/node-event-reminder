// basics
const express = require("express");
const pretty = require('express-prettify');
// config/env
require('dotenv').config();

// import action fns
const crons = require('./crons');

// register app and server
app = express();
var server = app.listen(3000, () => console.log('Server listening'));

// middleware
app.use(pretty({ always: true, spaces: 2 }));

// call crons
if (crons && typeof crons === 'object') {
  // crons.dailyCron();
  // crons.tenSecCron();
}
else {
  server.close(() => {
    console.log('Crons not found. Process terminated.');
    process.exit(9);
    // process.kill(process.pid, 'SIGTERM');
  })
}

// handle source file backups
const watchBackupFolder = require('./backup');
watchBackupFolder('./data');

module.exports = app;
