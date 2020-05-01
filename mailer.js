const { format, isSameDay, addDays } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');

// require log function
const createFile = require('./files');

// env vars
const MAILUSR = process.env.GMAILACCOUNT || false;
const MAILPWD = process.env.GMAILPASSWORD || false;

// message wording
const buildWording = require('./buildWording');

let nodemailer = require("nodemailer");

const sendMail = function(opts) {

  const eventWording = buildWording(opts).eventWording;
  const subject = buildWording(opts).subject || 'an event!';

  if (eventWording) {
    // Create a SMTP transporter object
    let mailer = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: 'Yes',
      auth: {
        user: MAILUSR,
        pass: MAILPWD
      },
      debug: true, // show debug output
    });

    // Message object
    let message = {
      from: `Event Reminder<${MAILUSR}>`,
      to: `<${MAILUSR}>`,
      subject: `${subject}`,
      text: eventWording,
      html: `<p>${eventWording}</p>`
    };

    mailer.sendMail(message, (err, info) => {
      if (err) {
        createFile('logs/error-log.txt', `Nodemailer send failed. Reason: ${err.message} at: ${new Date().toISOString()}\r\n`); // update error log file
        return process.exit(1);
      }

    });
  }

}

module.exports = {
  sendMail
};
