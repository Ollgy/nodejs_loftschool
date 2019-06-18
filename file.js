const fs = require('fs');
const path = require('path');

let unreadFiles = 0;
let [base = './test', result = './result', srcDelete = false] = process.argv.slice(2);

srcDelete = srcDelete === 'yes';

function countUnreadFiles (base) {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);

    if (state.isFile()) {
      unreadFiles++;
    } else {
      countUnreadFiles(localBase);
    }
  });
}

countUnreadFiles(base);

const readDir = (base, level, cb) => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);

    if (state.isDirectory()) {
      if (!fs.readdirSync(localBase).length) {
        fs.rmdirSync(localBase);
      }
      console.log(' '.repeat(level) + 'DIR: ' + item);
      readDir(localBase, level + 1, cb);
    } else {
      const letterBase = path.join(result, item.charAt(0).toUpperCase());

      if (!fs.existsSync(letterBase)) {
        fs.mkdirSync(letterBase);
      }

      fs.createReadStream(localBase)
        .on('error', (err) => {
          console.log(err);
        })
        .pipe(fs.createWriteStream(path.join(letterBase, item)))
        .on('error', (err) => {
          console.log(err);
        })
        .on('close', () => {
          unreadFiles--;

          if (!unreadFiles) {
            cb();
          }
        });
      console.log(' '.repeat(level) + 'File: ' + item);
    }
  });
};

const deleteDir = base => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);

    if (state.isDirectory()) {
      deleteDir(localBase);
    } else {
      fs.unlinkSync(localBase);
    }
  });

  fs.rmdirSync(base);
};

if (fs.existsSync(base)) {
  if (!fs.existsSync(result)) {
    fs.mkdirSync(result);
  }

  readDir(base, 0, () => {
    if (srcDelete) {
      deleteDir(base);
    }
  });
} else {
  console.log('Dir is not exist');
}
