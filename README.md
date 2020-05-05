# Node Event Reminder
Just a small node app running a cron to trigger SMS and email event reminders for birthdays, MOTs etc.

### Sends reminders via any/all of the below:
- Email (Nodemailer)
- SMS (Twilio)
- WhatsApp (Twilio Beta)

### Data sources:
- Local .json file
- Google Calendar API

## Notes
This was created largely for my use case so hasn't been developed as a configurable package, however I think it should be fairly easy to adapt to your own purposes due to its modular build and easily swapped out account variables.

### Cron
- The app runs a cron to trigger the reminder functionality at specific times, using the [node-cron](https://github.com/node-cron/node-cron "See node-cron on GitHub") package.
- The cron schedule is easily configurable via the `crons.js` file.
- Each successful cron event is logged to a txt file.

### Google Calendar
- The [Google Calendar](https://developers.google.com/calendar "Google Calendar API docs") integration requires a Service Account signed up to the Calendar API via the Google Developer Console.
- The Service Account needs to have access to your private calendar - share your calendar with the Service Account via the calendar itself.
- A 'credentials.json' file is needed to authenticate with the Google Auth library used. You can find an example of what this should look like [here](https://github.com/googleapis/google-auth-library-nodejs#json-web-tokens "Google auth documentation - JWT"). You could also use ENV variables for this. Obviously remember to gitignore!
- The Google documentation around auth isn't great, particularly when trying to authenticate server to server :/
- Currently set up to only pull events from the calendar that include the string 'notifyme' somewhere. This can be easily changed!

### Local Data
- As well as pulling from Google Calendar, the app can also pull from a local .json file. An example of the structure it requires is provided in `data-example.json`.
- When the app is running, any changes to the a file within the `data` folder will trigger a backup to be taken in a separate folder to prevent accidental loss of data. 30 backups are kept.

### Twilio
- You'll need an account with [Twilio](https://www.twilio.com/sms "Twilio SMS products"), but if usage is low then the trial tier is fine.
- ENV variables for the Twilio SID and Auth Token are needed plus private variables for your phone number and the Twilio sender numbers. Twilio have some pretty good [guides](https://www.twilio.com/console/sms/getting-started/developer-docs "Twilio SMS docs") available.
- A log file is used to log the status of message requests.

### Nodemailer
- [Nodemailer](https://nodemailer.com/about/ "Nodemailer") needs to have an SMTP transporter object created. This could be something like Mailgun, SendGrid etc. but I am using [Gmail](https://support.google.com/a/answer/176600?hl=en "Using Gmail SMTP server"). For higher usage you would need a dedicated SMTP solution.

### Environment variables
- These are required for the 3rd party integrations and also to determine which combination of data source and services are used.
- Please see `.env.example` for a list of the fields used.

---

### TODO?
- Deploy node app to a DO droplet
- Add sentry to the node app for error tracking?
- Add a basic auth-locked settings page to allow add/edit/delete of events. Nuxt?
