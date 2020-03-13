// env vars
const accountSid = process.env.TWILIOACCOUNT || false;
const authToken = process.env.TWILIOTOKEN || false;
const receiverNumber = process.env.TWILIORECEIVERNUMBER || false;
const whatsappSenderNumber = process.env.TWILIOSENDERWHATSAPP || false;
const smsSenderNumber = process.env.TWILIOSENDERSMS || false;

// twilio pkg
const client = require('twilio')(accountSid, authToken);

// require log function
const createFile = require('./files');

// message wording
const buildWording = require('./buildWording');

// whatsapp
const twilioSendWhatsApp = function(opts) {

  const message = buildWording(opts).eventWording;
  if (message) {
    if (accountSid && authToken && whatsappSenderNumber && receiverNumber) { // all vars present?
      // send msg
      client.messages
        .create({
          body: message,
          from: `whatsapp:${whatsappSenderNumber}`,
          to: `whatsapp:${receiverNumber}`
        })
        .then( (response) => {
          if (response.errorCode) {
            console.error(response.errorMessage);
            createFile('logs/twilio-log.txt', `WhatsApp Message with sid (${response.sid}) FAILED to send to ${masked} at: ${new Date().toISOString()}\r\n`); // update log file
          }
          else {
            let masked = receiverNumber.substr(0, receiverNumber.length - 5) + '*****';
            console.log(`WhatsApp message with sid (${response.sid}) sent to ${masked}`);
            createFile('logs/twilio-log.txt', `WhatsApp Message with sid (${response.sid}) sent to ${masked} at: ${new Date().toISOString()}\r\n`); // update log file
          }
        })
        .done();
    }
  }
}

// SMS
const twilioSendSMS = function(opts) {

  const message = buildWording(opts).eventWording;

  if (message) {
    if (accountSid && authToken && smsSenderNumber && receiverNumber) { // all vars present?
      // send msg
      client.messages
        .create({
          body: message,
          from: `${smsSenderNumber}`,
          to: `${receiverNumber}`
        })
        .then( (response) => {
          if (response.errorCode) {
            console.error(response.errorMessage);
            createFile('logs/twilio-log.txt', `SMS Message with sid (${response.sid}) FAILED to send to ${masked} at: ${new Date().toISOString()}\r\n`); // update log file
          }
          else {
            let masked = receiverNumber.substr(0, receiverNumber.length - 5) + '*****';
            console.log(`SMS message with sid (${response.sid}) sent to ${masked}`);
            createFile('logs/twilio-log.txt', `SMS message with sid (${response.sid}) sent to ${masked} at: ${new Date().toISOString()}\r\n`); // update log file
          }
        })
        .done();
    }
  }
}

module.exports = {
  twilioSendWhatsApp,
  twilioSendSMS
};
