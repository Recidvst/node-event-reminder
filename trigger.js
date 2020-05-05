// imports
const fs = require("fs");
const { format, isSameDay, addDays, addMonths } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');
// require log function
const createFile = require('./files');
// env vars
// source
const DATASOURCE = process.env.DATASOURCE || false;
// methods
const NOTIFYBYTEXT = process.env.NOTIFYBYTEXT || false;
const NOTIFYBYWHATSAPP = process.env.NOTIFYBYWHATSAPP || false;
const NOTIFYBYEMAIL = process.env.NOTIFYBYEMAIL || false;
// intervals
const CHECKTODAY = process.env.CHECKTODAY || false;
const CHECKTOMORROW = process.env.CHECKTOMORROW || false;
const CHECKWEEK = process.env.CHECKWEEK || false;
const CHECKMONTH = process.env.CHECKMONTH || false;
// actions
const twilio = require('./twilio');
const mailer = require('./mailer');
// get data
const dataSource = require('./dataSource');
async function getData() {
  let dataArr = [];
  let calendarData = await dataSource.calendar();
  // choose whether to use local data or google calendar data or both
  if (DATASOURCE === 'google') {
    dataArr = calendarData;
  }
  if (DATASOURCE === 'local') {
    dataArr = dataSource.local.events;
  }
  if (DATASOURCE === 'both') {
    dataArr = calendarData.concat(dataSource.local.events);
  }

  return dataArr;
}

// fired on cron run
const triggerFn = async () => {
  try {
    // grabbing data
    const data = await getData();

    // loop over dates source file / filter it by date provided by cron
    if (data && data.length > 0) {
      data.forEach((event) => {
        let eventDate = false;
        if (event.start) {
          eventDate = event.start.date || event.start.dateTime;
        }
        else {
          eventDate = event.date || false;
        }
        if (eventDate) {
          let eventDateWithYear = eventDate;
          if (eventDate.indexOf('/') > -1) {
            const eventDateSplit = eventDate.split('/');
            eventDateWithYear = `2020/${eventDateSplit[1]}/${eventDateSplit[0]}`;
          }

          let sendProto = {
            type: event.type || 'standard',
            name: event.summary || event.name || '',
            description: event.description || '',
            emoji: event.emoji || '',
            date: eventDate,
            distanceType: 'month',
          }

          // compare to cron times - if match found then trigger mail and message functionality for that date
          // same day
          if (CHECKTODAY && isSameDay(new Date(eventDateWithYear), new Date(Date.now()))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'today';
            // send mail
            if (NOTIFYBYEMAIL && mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (NOTIFYBYTEXT && twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
            if (NOTIFYBYWHATSAPP && twilio && typeof twilio === 'object') {
              twilio.twilioSendWhatsApp(sendOpts);
            }
          }
          // next day
          if (CHECKTOMORROW && isSameDay(new Date(eventDateWithYear), addDays(Date.now(), 1))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'tomorrow';
            // send mail
            if (NOTIFYBYEMAIL && mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (NOTIFYBYTEXT && twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
            if (NOTIFYBYWHATSAPP && twilio && typeof twilio === 'object') {
              twilio.twilioSendWhatsApp(sendOpts);
            }
          }
          // one week
          if (CHECKWEEK && isSameDay(new Date(eventDateWithYear), addDays(Date.now(), 7))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'week';
            sendOpts.date = eventDateWithYear;
            // send mail
            if (NOTIFYBYEMAIL && mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (NOTIFYBYTEXT && twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
            if (NOTIFYBYWHATSAPP && twilio && typeof twilio === 'object') {
              twilio.twilioSendWhatsApp(sendOpts);
            }
          }
          // one month
          if (CHECKMONTH && isSameDay(new Date(eventDateWithYear), addMonths(Date.now(), 1))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'month';
            sendOpts.date = eventDateWithYear;
            // send mail
            if (NOTIFYBYEMAIL && mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (NOTIFYBYTEXT && twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
            if (NOTIFYBYWHATSAPP && twilio && typeof twilio === 'object') {
              twilio.twilioSendWhatsApp(sendOpts);
            }
          }
        }
      });
    }
  }
  catch(err) {
    createFile('logs/error-log.txt', `Crons trigger fn failsd. Reason: ${err} at: ${new Date().toISOString()}\r\n`); // update error log file
  }
}

module.exports = triggerFn;
