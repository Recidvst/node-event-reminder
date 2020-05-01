const { format } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');

// build messaging wording
const buildWording = (opts) => {

  if (opts === undefined || Object.keys(opts).length < 1) return false; // empty options obj

  const type = opts.type || 'standard';
  const eventName = opts.summary || opts.name || '';
  const eventDescription = opts.description || '';
  const passedEmoji = opts.emoji || false;
  let eventDate = opts.date || false;
  if (eventDate) {
    eventDate = new Date(eventDate);
  }
  const distanceType = opts.distanceType || 'week';

  let subject = ''
  let bodyEmoji = '';
  let eventWording = '';

  if (type === 'birthday') {
    subject = `🗓️🎁 A reminder for ${eventName}`;
    bodyEmoji = passedEmoji || `⏰`;
  } else {
    subject = `🗓️ A reminder for ${eventName}`;
    bodyEmoji = passedEmoji || `⏰`;
  }

  // build up wording based on distance to event
  if (distanceType === 'today') {
    eventWording = `${bodyEmoji} Don't forget that today is "${eventDescription}"`;
  }
  else if (distanceType === 'tomorrow') {
    eventWording = `${bodyEmoji} Don't forget that tomorrow is "${eventDescription}"`;
  }
  else if (distanceType === 'week' && eventDate) {
    eventWording = `${bodyEmoji} Don't forget that "${eventDescription}" is happening on ${format(eventDate, 'E do MMMM', { locale })} (${format(eventDate, 'dd/MM/yyy', { locale })})`;
  }
  else if (distanceType === 'month' && eventDate) {
    eventWording = `${bodyEmoji} Don't forget that "${eventDescription}" is happening on ${format(eventDate, 'E do MMMM', { locale })} (${format(eventDate, 'dd/MM/yyy', { locale })})`;
  }

  return {
    eventWording,
    subject,
    bodyEmoji,
  };

}

module.exports = buildWording;
