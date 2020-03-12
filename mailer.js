const { format, isSameDay, addDays } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');

// env vars
const MAILUSR = process.env.GMAILACCOUNT || false;
const MAILPWD = process.env.GMAILPASSWORD || false;

let nodemailer = require("nodemailer");

const sendMail = function(opts) {
  if (opts === undefined || Object.keys(opts).length < 1) return false; // empty options obj

  const type = opts.type || 'birthday';
  const useBlurb = opts.useBlurb || false;
  const itemName = opts.name || '';
  const eventBlurb = opts.blurb || '';
  const eventDate = new Date(opts.date) || false;
  const tomorrowDate = addDays(Date.now(), 1);

  let subject = ''
  let emoji = '';
  let eventWording = '';
  let eventInnerWording = '';

  if (useBlurb) {
    eventInnerWording = eventBlurb;
    subject = eventBlurb;
  } else {
    if (type === 'birthday') {
      eventInnerWording = `${itemName}'s birthday`;
      subject = `${itemName}'s birthday 🎉`;
      emoji = `🎂`;
    } else {
      eventInnerWording = `${itemName}`;
      subject = `${itemName} 🍾`;
      emoji = `🎊`;
    }
  }

  // build up wording based on distance to event
  if (isSameDay(eventDate, tomorrowDate)) {
    eventWording = `Don't forget ${eventInnerWording} tomorrow! ${emoji}`;
  }
  else if (eventDate) {
    eventWording = `Don't forget ${eventInnerWording} on ${format(eventDate, 'eee eo MMMM', { locale })} (${format(eventDate, 'dd/MM/yyy', { locale })})${emoji}`;
  }
  else {
    eventWording = `Don't forget ${eventInnerWording} is coming soon! ${emoji}`;
  }

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
  subject: `📅 A reminder for ${subject}`,
  text: eventWording,
  html: `<p>${eventWording}</p>`
 };

 mailer.sendMail(message, (err, info) => {
  if (err) {
    console.log('Error occurred. ' + err.message);
    return process.exit(1);
  }

  console.log('Message sent: %s', info.response);
 });

}

module.exports = {
  sendMail
};
