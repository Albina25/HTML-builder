const fs = require('fs');
const path = require('path');

const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const dir = path.join(__dirname, 'styles');

function callback(err) {
  if (err) throw err;
}

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) {
    if (err) throw err;
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(dir, file.name), (err, stats) => {
          if (path.extname(file.name) == '.css') {
            console.log(path.join(dir, file.name));
            const stream = fs.createReadStream(path.join(dir, file.name), 'utf-8');
            let data = '';
            stream.on('data', chunk => data += chunk);
            stream.on('end', () => fs.appendFile(bundle.path, data, callback));
            stream.on('error', error => console.log('Error', error.message));
          } 
        });
      }
    });
  }
});