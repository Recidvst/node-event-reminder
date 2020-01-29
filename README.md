# Node Event Reminder
Just a small node app running a cron to trigger event reminders for birthdays etc.

- SMS & WhatsApp via Twilio (part done)
- Email via nodemailer (todo)

### TODO
- Add events source (json)
- Finalise Twilio sms/whatsapp functionality
- Add mail send support with nodemailer
- Add a basic auth-locked settings page to allow add/edit/delete of events. Nuxt?
- Add backup functionality for events when new ones added. Delete old backups with a cron
- Add sentry to the node app for error tracking?
