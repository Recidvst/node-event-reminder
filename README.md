# Node Event Reminder
Just a small node app running a cron to trigger event reminders for birthdays etc.

- SMS & WhatsApp via Twilio (part done)
- Email via nodemailer (done)

### TODO
- Connect events source (json) and filter to trigger actions
- Finalise Twilio sms/whatsapp functionality
- Add backup functionality for events when new ones added. Delete old backups with a cron
- Deploy node app to a DO droplet
- Add sentry to the node app for error tracking?
- Add a basic auth-locked settings page to allow add/edit/delete of events. Nuxt?
