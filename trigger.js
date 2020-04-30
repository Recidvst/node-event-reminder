// imports
const fs = require("fs");
const { format, isSameDay, addDays, addMonths } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');
// env vars
const DATASOURCE = process.env.DATASOURCE || false;
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
        console.log('event');
        console.log(event);
        const eventDate = event.date || false;
        if (eventDate) {
          const eventDateSplit = eventDate.split('/');
          const eventDateWithYear = `2020/${eventDateSplit[1]}/${eventDateSplit[0]}`;

          let sendProto = {
            type: event.type || 'birthday',
            name: event.name || '',
            blurb: event.blurb || '',
            useBlurb: (event.blurb && event.blurb !== '') ? true : false,
            date: eventDate,
            distanceType: 'month',
          }

          // compare to cron times - if match found then trigger mail and message functionality for that date
          // same day
          if (isSameDay(new Date(eventDateWithYear), new Date(Date.now()))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'today'
            // send mail
            if (mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
          }
          // next day
          if (isSameDay(new Date(eventDateWithYear), addDays(Date.now(), 1))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'tomorrow'
            // send mail
            if (mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
          }
          // one week
          if (isSameDay(new Date(eventDateWithYear), addDays(Date.now(), 7))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'week'
            // send mail
            if (mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
          }
          // one month
          if (isSameDay(new Date(eventDateWithYear), addMonths(Date.now(), 1))) {
            let sendOpts = sendProto || {};
            sendOpts.distanceType = 'month'
            // send mail
            if (mailer && typeof mailer === 'object') {
              mailer.sendMail(sendOpts);
            }
            // twilio messaging integration
            if (twilio && typeof twilio === 'object') {
              twilio.twilioSendSMS(sendOpts);
            }
          }
        }
      });
    }
  }
  catch(err) {
    console.log(err);
  }
}

triggerFn();

module.exports = triggerFn;
