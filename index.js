// basics
const express = require("express");
const pretty = require('express-prettify');
// config/env
require('dotenv').config();

// import action fns
const crons = require('./crons');
const twilio = require('./twilio');
const mailer = require('./mailer');

// twilio whatsapp and sms integration
if (twilio && typeof twilio === 'object') {
  // twilio.twilioSendWhatsApp('whatsapp test'); // whatsapp test
  // twilio.twilioSendSMS('sms test'); // SMS test
}

// send mail
if (mailer && typeof mailer === 'object') {
  // mailer.sendMail('birthday', 'John Doe', 'John\'s birthday', Date.now());
}

// register app and server
app = express();
var server = app.listen(3000, () => console.log('Server listening'));

// middleware
app.use(pretty({ always: true, spaces: 2 }));

// call crons
if (crons && typeof crons === 'object') {
  // TODO: cron times to change from test times - move to once a day?
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
