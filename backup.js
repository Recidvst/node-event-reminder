// backup json source files
const fs = require("fs");
const chokidar = require('chokidar');

// require log function
const createFile = require('./files');

// watch data folder
const watchBackupFolder = (folderPath) => {

  // init chokidar watcher
  chokidar.watch(folderPath).on('change', filepath => {
    // if change seen
    if (filepath) {

      fs.stat(`${filepath}`, (err, stats) => {
        if (err) throw err;
        // create a timestamp to append to file
        const timestamp = new Date(stats.mtime).toISOString();
        const timestampStripped = timestamp.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '');
        let backupFilepath = `${filepath.split('.json').slice(0, -1).join('.')}-${timestampStripped}.json`;

        // check backup data folder exists
        fs.accessSync('./backups/data', (err) => {
          if (err) {
            fs.mkdirSync('./backups/data');
          }
        });

        // read file contents
        const fileContents = fs.readFileSync(filepath, (err, data) => {
          if (err) {
            return false;
          };
          return data;
        });

        if (fileContents !== '' && fileContents !== false) {

          // write new backup file
          fs.writeFile(`./backups/${backupFilepath}`, fileContents, function(err) {
            if(err) {
              createFile('logs/error-log.txt', `Backup write task failed. Reason: ${err} at: ${new Date().toISOString()}\r\n`); // update error log file
            }

            // check dir for max size
            fs.readdir('./backups/data', (err, files) => {
              // if too long (30+), remove oldest items
              if (files.length >= 30) {
                files.forEach(function(file, index) {
                  if (index < files.length - 30) {
                    fs.unlinkSync(`./backups/data/${file}`, (err) => {
                      if (err) {
                        createFile('logs/error-log.txt', `Backup cull task failed. Reason: ${err} at: ${new Date().toISOString()}\r\n`); // update error log file
                      }
                    });
                  }
                });
              }
            });
          });
        }

      });

    }
  });
}

module.exports = watchBackupFolder;
