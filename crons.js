// cron tasks
const cron = require("node-cron");
const triggerFn = require('./trigger');

// require log function
const createFile = require('./files');

// check cron schedule validity
const validator = (schedule) => {
  return new Promise ((resolve, reject) => {
    if (typeof schedule === undefined) reject('Must pass a cron schedule');
    const valid = cron.validate(schedule);
    if (valid) {
      resolve();
    }
    else {
      reject('Invalid cron schedule (' + schedule + ')');
    }
  });
}

// schedule tasks to be run on the server
const dailyCron = () => {
  const sched = "0 2 * * *";
  validator(sched)
  .then( () => { // if cron valid
    cron.schedule(sched, function() {
      triggerFn();
      createFile('logs/cron-log.txt', `Cron 'dailyCron' ran at: ${new Date().toISOString()}\r\n`); // update log file
    });
  })
  .catch( (err) => {
    console.log(`Process terminated. Reason: ${err}`);
    // kill process
    process.exit(9);
  })
}

const tenSecCron = () => {
  const sched = "*/10 * * * * *";
  validator(sched)
  .then( () => { // if cron valid
    cron.schedule(sched, function() {
      triggerFn();
      createFile('logs/cron-log.txt', `Cron 'tenSecCron' ran at: ${new Date().toISOString()}\r\n`); // update log file
    });
  })
  .catch( (err) => {
    console.log(`Process terminated. Reason: ${err}`);
    // kill process
    process.exit(9);
  })
}

const testErrorCron = () => { // schedule validation tester
  const sched = "*/10 * asds* '* *//1 *";
  validator(sched)
  .then( () => { // if cron valid
    cron.schedule(sched, function() {
      createFile('logs/cron-log.txt', `Cron 'testErrorCron' ran at: ${new Date().toISOString()}\r\n`); // update log file
    });
  })
  .catch( (err) => {
    console.log(`Process terminated. Reason: ${err}`);
    // kill process
    process.exit(9);
  })
}

module.exports = {
  dailyCron,
  tenSecCron,
  testErrorCron
};
