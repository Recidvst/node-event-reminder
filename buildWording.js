const { format } = require('date-fns');
const { locale } = require( 'date-fns/locale/en-GB');

// build messaging wording
const buildWording = (opts) => {

  if (opts === undefined || Object.keys(opts).length < 1) return false; // empty options obj

  const type = opts.type || 'birthday';
  const useBlurb = opts.useBlurb || false;
  const itemName = opts.name || '';
  const eventBlurb = opts.blurb || '';
  const eventDate = new Date(opts.date) || false;
  const distanceType = opts.distanceType || 'month';

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
  if (distanceType === 'today') {
    eventWording = `Don't forget that it's ${eventInnerWording} today! ${emoji}`;
  }
  else if (distanceType === 'tomorrow') {
    eventWording = `Don't forget ${eventInnerWording} tomorrow! ${emoji}`;
  }
  else if (distanceType === 'week' && eventDate) {
    eventWording = `Don't forget ${eventInnerWording} on ${format(eventDate, 'E do MMMM', { locale })} (${format(eventDate, 'dd/MM/yyy', { locale })})${emoji}`;
  }
  else if (distanceType === 'month') {
    eventWording = `Don't forget ${eventInnerWording} is coming soon! ${emoji}`;
  }

  return {
    eventWording,
    subject,
    emoji,
  };

}

module.exports = buildWording;
