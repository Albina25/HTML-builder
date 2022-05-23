const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');
const dirComponents = path.join(__dirname, 'components');
const mainFolderindex = path.join(__dirname, 'project-dist', 'index.html');

const dirProject = path.join(__dirname, 'project-dist');

fsPromises.mkdir(dirProject, { recursive: true }, (err) => {
  if (err) throw err;
});

const fileProjectStyle = fs.createWriteStream(path.join(dirProject, 'style.css'));
const fileProjectIndex = fs.createWriteStream(path.join(dirProject, 'index.html'));

function callback(err) {
  if (err) {
    throw err;
  }
}

styleBundle();
copyFolder(dirAssets, path.join(dirProject, 'assets'));
readHTML();

async function readHTML() {
  let template = '';
  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, fileContent) => {
    if (err) throw err;
    template = fileContent;
    const tags = template.match(/(?<=\{{).+?(?=\}})/gm);
    tags.forEach(async (tag) => {
      const component = path.join(dirComponents, `${tag}.html`);
      const newHtml = await fsPromises.readFile(component, 'utf-8');
      // fsPromises.readFile(component, 'utf-8').then((res) => {
      //   template = template.replace(tag, res);
      //   console.log(template);
      // });
      template = template.replace(tag, newHtml);
    });
    fileProjectIndex.write(template);
  });
}


function styleBundle() {
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