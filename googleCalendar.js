// google calendar integration
// uses 'Service Account' for authentication
var { google } = require('googleapis');
var key = require('./credentials.json');

const getCalendarEvents = function(opts) {

  const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

  var auth = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    SCOPES,
  );

  const api = google.calendar({version : "v3", auth : auth});
  const calendarId = key.calendar_id;

  // Make an authorized request to list Calendar events.
  return new Promise(function(resolve, reject) {
    api.events.list({
      calendarId: calendarId,
      q: 'nodenotify',
      timeMin: new Date().toISOString()
    }, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.data.items);
      }
    });
  });
}

module.exports = {
  getCalendarEvents
};
