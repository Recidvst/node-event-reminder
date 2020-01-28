// log file function
const fs = require("fs");

const createFile = (filename, content) => {
  fs.open(filename,'r',function(err, fd){
    if (err) {
      fs.writeFile(filename, content, function(err) {
          if(err) {
            console.log(err);
          }
      });
    } else {
      fs.appendFile( filename, content, function(err) {
        fs.close(fd, function(){
          if(err) {
            console.log(err);
          }
        });
      });
    }
  });
}

module.exports = createFile;
