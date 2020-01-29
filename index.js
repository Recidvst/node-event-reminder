// basics
const express = require("express");
const pretty = require('express-prettify');
// config/env
require('dotenv').config();

// cron tasks
const crons = require('./crons');

// twilio whatsapp integration
const twilioFunctions = require('./twilio');
if (twilioFunctions && typeof twilioFunctions === 'object') {
  twilioFunctions.twilioSendWhatsApp('whatsapp test'); // whatsapp test
  twilioFunctions.twilioSendSMS('sms test'); // SMS test
}

// register app and server
app = express();
var server = app.listen(3000, () => console.log('Server listening'));

// middleware
app.use(pretty({ always: true, spaces: 2 }));

// call crons
if (crons && typeof crons === 'object') {
  crons.minuteCron();
  crons.tenSecCron();
}
else {
  server.close(() => {
    console.log('Crons not found. Process terminated.');
    process.exit(9);
    // process.kill(process.pid, 'SIGTERM');
  })
}

module.exports = app;
