const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');
fsPromises.mkdir(targetDir, { recursive: true }, (err) => {
  if (err) throw err;
});

function callback(err) {
  if (err) throw err;
}

fs.readdir(srcDir, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      fs.copyFile(path.join(srcDir, file), path.join(targetDir, file), callback);
    })
  }
})
