const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');
fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log('\n file:');
    files.forEach(file => {
      if (file.isFile()) {
        const index = file.name.indexOf('.');

        const filename = file.name.slice(0, index);
        const extension = path.extname(file.name).slice(1);

        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          const size = stats.size;
          const sizeKB = (size / 1024).toFixed(3);
          console.log(`${filename} - ${extension} - ${sizeKB}kb`);
        });
      }
    });
  }
});