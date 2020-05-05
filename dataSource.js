// data builder
// get data from local json file or from google calendar

// get local
const localData = require('./data/events.json');

// get google
let calendarData = [];
const googleCalendar = require('./googleCalendar');
if (googleCalendar && typeof googleCalendar === 'object') {
  calendarData = googleCalendar.getCalendarEvents;
}

module.exports = {
  local: localData,
  calendar: calendarData,
};
