const fs = require('fs');
const path = require('path');

let unreadFiles = 0;
let [base = './test', result = './result', srcDelete = false] = process.argv.slice(2);

srcDelete = srcDelete === 'yes';

let readDir = function(base, cb) {
  fs.readdir(base, function(err, list) {
    if (err) return cb(err);

    let i = 0;
    (function next() {
      let item = list[i++];

      if (!item) {
        return cb();
      }

      localBase = path.join(base, item);
      fs.stat(localBase, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readDir(localBase, next);
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
          .on('close', next);
        }
      });
    })();
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

  readDir(base, (err) => {
    if (err) {
      console.log(err);
    }
    if (srcDelete) {
      deleteDir(base);
    }
  });
} else {
  console.log('Dir is not exist');
}
