const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const watcher = chokidar.watch('user', {
  persistent: true
});

watcher.on('change', (filePath) => { // TODO: on change and on add and on delete 
  const fileName = path.basename(filePath);
  /*const destination = path.join('/path/to/destination', fileName);
  fs.copyFile(filePath, destination, (err) => {
    if (err) throw err;
    console.log(`${fileName} was copied to ${destination}`);
  });*/
    console.log(`${fileName} was changed`);
});
