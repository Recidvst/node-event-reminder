// env vars
const MAILUSR = process.env.GMAILACCOUNT || false;
const MAILPWD = process.env.GMAILPASSWORD || false;

let nodemailer = require("nodemailer");
 
const sendMail = function(type, title, blurb, date) { // TODO use options object
  // TODO the message logic handled by a detached fn
  const eventTitle = title || '';
  const eventBlurb = blurb || '';
  const eventDate = date || false;
  const tomorrowDate = Date.now(); // TODO with date-fns
  let eventWording = '';
  
  switch(type) {
    // TODO add msg for non birthdays
    // case 'anniversary': // non-standard types
    //   break;
    default: // birthday
      if (eventDate === tomorrowDate) { // TODO with date-fns
        eventWording = `Don't forget ${eventTitle}'s birthday tomorrow!`;
      }
      else if (eventDate) {
        eventWording = `Don't forget ${eventTitle}'s birthday on ${eventDate}`;        
      }
      else {
        eventWording = `Don't forget ${eventTitle}'s birthday is coming soon!`;        
      }
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
  from: 'Event Reminder<event-reminder.`${MAILUSR}>`',
  to: `<${MAILUSR}>`,
  subject: `A reminder for ${eventBlurb}`,
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