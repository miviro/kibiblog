const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const filepath = "user";

const watcher = chokidar.watch(filepath, {
  persistent: true
});

const staticWatcher = chokidar.watch('../static', {
  persistent: true
});

watcher.on('change', processFile);
watcher.on('add', processFile);
watcher.on('unlink', processFile);

staticWatcher.on('all', () => processFile('user/index.md'));

function processFile(filePath) {
  // TODO: ACtualizae lsitado en index.html

  console.log(`Processing ${filePath}...`);
  const sourcePath = filePath;

  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;

    let formattedData = data;
    // Create the directory if it doesn't exist, delete "user/" from the path
    const destinationDir = path.join(__dirname, '../static', path.dirname(filePath.replace(/^user\//, '')));
    let destinationFile = path.join(destinationDir, path.basename(filePath));

    if (path.extname(filePath) === '.md') {
      if (path.basename(filePath) === 'index.md') {
        formattedData = formatFile(data) + generateDirectoryListing('static');
      } else {
        formattedData = formatFile(data);
      }
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

function generateDirectoryListing(dir) {
  return '<h2>Article listing</h2><ul>' + generateIndex(dir);
}

function generateIndex(dir) {
  let listing = '';
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // no añadir index.html al listado
    if (file === 'index.html') {
      return;
    }
    
    if (stat.isDirectory()) {
      listing += `<li><strong>${file}/</strong><ul>`;
      listing += generateIndex(filePath); // Recursively generate listing for subdirectories
      listing += `</ul></li>`;
    } else if (file.endsWith('.html')) { // solo mostrar archivos html
      const relativePath = path.relative('static', filePath).replace(/\\/g, '/');
      listing += `<li onclick="goto('/${relativePath}')">${file.slice(0, -5)}</li>`;
    }
  });
  
  listing += '</ul>';
  console.log(listing);
  return listing;
}