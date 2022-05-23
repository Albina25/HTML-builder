const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');

const dirProject = path.join(__dirname, 'project-dist');

fsPromises.mkdir(dirProject, { recursive: true }, (err) => {
  if (err) throw err;
});

const fileProjectStyle = fs.createWriteStream(path.join(dirProject, 'style.css'));

function callback(err) {
  if (err) {
    console.log('error');
    throw err;
  }
}

styleBundle();
async function styleBundle() {
  fs.readdir(dirStyles, { withFileTypes: true }, (err, files) => {
    if (err) {
      if (err) throw err;
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.stat(path.join(dirStyles, file.name), (err, stats) => {
            if (path.extname(file.name) == '.css') {
              const stream = fs.createReadStream(path.join(dirStyles, file.name), 'utf-8');
              let data = '';
              stream.on('data', chunk => data += chunk);
              stream.on('end', () => fs.appendFile(fileProjectStyle.path, data, callback));
              stream.on('error', error => console.log('Error', error.message));
            } 
          });
        }
      });
    }
  });
}


copyFolder(dirAssets, path.join(dirProject, 'asssts'));
async function copyFolder(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(src, { withFileTypes: true }, (err, items) => {
    if (err) {
      throw err;
    } else {
      items.forEach(item => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        if (item.isFile()) {
          fs.copyFile(srcPath, destPath, callback);
        } else {
          copyFolder(srcPath, destPath);
        }
      });
    }
  });
}