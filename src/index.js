const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const filepath = "user";

const watcher = chokidar.watch(filepath, {
  persistent: true
});

function processFile(filePath) {
  const sourcePath = filePath;

  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;


    let formattedData = data;
    // Create the directory if it doesn't exist, delete "user/" from the path
    const destinationDir = path.join(__dirname, '../static', path.dirname(filePath.replace(/^user\//, '')));
    let destinationFile = path.join(destinationDir, path.basename(filePath));

    if (path.extname(filePath) === '.md') {
      formattedData = formatFile(data);
      destinationFile = destinationFile.replace(/\.md$/, '.html');
    }


    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.writeFile(destinationFile, formattedData, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${destinationFile} created successfully.`);
    });
  });
}

function formatFile(data) {
  return data.split('\n').map(line => {
    if (line.startsWith('# ')) {
      return `<h1>${line.slice(2)}</h1>`;
    }
    return line;
  }).join('\n');
}

function deleteFile(filePath) {
  let destinationFile = path.join(__dirname, '../static', filePath.replace(/^user\//, ''));
  
  if (path.extname(filePath) === '.md') {
    destinationFile = destinationFile.replace(/\.md$/, '.html');
  }

  fs.unlink(destinationFile, (err) => {
    if (err) throw err;
    console.log(`${destinationFile} deleted successfully.`);
  });
}

watcher.on('change', processFile);
watcher.on('add', processFile);
watcher.on('unlink', deleteFile);
