const fs = require('fs');
const path = require('path');

let [base = './test', result = './result', srcDelete = false] = process.argv.slice(2);

srcDelete = srcDelete === 'yes';

const writeFile = (readPath, writePath, item) => new Promise((resolve, reject) => {
  fs.createReadStream(readPath)
  .on('error', (err) => {
    return reject(err);
    console.log(err);
  })
  .pipe(fs.createWriteStream(path.join(writePath, item)))
  .on('error', (err) => {
    return reject(err);
    console.log(err);
  })
  .on('close', () => resolve());
});

const deleteFile = (path) => new Promise((resolve, reject) => {
  fs.unlink(path, (err) => {
    if (err) {
      return reject(err)
    }
    return resolve();
  });
});

const deleteDir = (path) => new Promise((resolve, reject) => {
  fs.rmdir(path, (err) => {
    if (err) {
      return reject(err)
    }
    return resolve();
  });
});

let readDir = (base) => new Promise((resolve, reject) => {
  fs.readdir(base, (err, list) => {
    if (err) return reject(err);

    let i = 0;
    (async function next() {
      let item = list[i++];

      if (!item) {
        console.log(base);
        if (srcDelete) {
          await deleteDir(base); 
        }
        return resolve();
      }

      localBase = path.join(base, item);
      fs.stat(localBase, async (err, stat) => {
        if (stat && stat.isDirectory()) {
          await readDir(localBase);
          next();
        } else {
          const letterBase = path.join(result, item.charAt(0).toUpperCase());
          
          if (!fs.existsSync(letterBase)) {
            fs.mkdirSync(letterBase);
          }

          await writeFile(localBase, letterBase, item);

          if (srcDelete) {
            await deleteFile(localBase); 
          }
          next();
        }
      });
    })();
  });
});

if (fs.existsSync(base)) {
  if (!fs.existsSync(result)) {
    fs.mkdirSync(result);
  }

  readDir(base);
} else {
  console.log('Dir is not exist');
}

