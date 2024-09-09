const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const filepath = "user";

const watcher = chokidar.watch(filepath, {
  persistent: true
});

function processFile(filePath) {
  const sourcePath = filePath;
  const destinationPath = path.join(__dirname, '../static', path.basename(filePath));

  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;

    const formattedData = formatFile(data);

    // Create the directory if it doesn't exist, delete "user/" from the path
    const destinationDir = path.join(__dirname, '../static', path.dirname(filePath.replace(/^user\//, '')));

    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    const destinationFile = path.join(destinationDir, path.basename(filePath));

    fs.writeFile(destinationFile, formattedData, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${destinationFile} created successfully.`);
    });
  });
}

function formatFile(data) {
  return data;
}

function processDirectory(dirPath) {
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        processDirectory(filePath);
      } else {
        processFile(filePath);
      }
    });
  });
}


watcher.on('change', processFile);
watcher.on('add', processFile);
watcher.on('unlink', processFile);