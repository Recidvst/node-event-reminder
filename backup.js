// backup json source files
const fs = require("fs");

// watch data folder
const watchBackupFolder = (folderPath) => {
  fs.watch(folderPath, (eventType, filename) => {
    console.log(eventType);
    console.log(filename);

    // if change seen then take a copy and append timestamp
    if (eventType === 'change') {
      // create a timestamp here to append to file
      fs.stat(`${folderPath}/${filename}`, (err, stats) => {
        if (err) throw err;
        const ts = stats.mtime;
        // TODO: inject ts variable into filename (before .json)
        fs.copyFileSync(`${folderPath}/${filename}`, `./backups/${filename}`, (err) => {
          if (err) throw err;
          console.log(`Backup made: ${filename} was moved to backups folder`);
        });

      });
    }
  });
}

// check backup folder space
// if room (e.g. max 30 files or sth) then add file
// else remove oldest file and add new one

module.exports = watchBackupFolder;
