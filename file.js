const fs = require('fs');
const path = require('path');

let [base = './test', result = './result', srcDelete = false] = process.argv.slice(2);

srcDelete = srcDelete === 'yes';

const readDir = (base, level) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(base);

    files.forEach(item => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);

      if (state.isDirectory()) {
        console.log(' '.repeat(level) + 'DIR: ' + item);
        readDir(localBase, level + 1);
      } else {
        const letterBase = path.join(result, item.charAt(0).toUpperCase());

        if (!fs.existsSync(letterBase)) {
          fs.mkdirSync(letterBase);
        }

        fs.createReadStream(localBase)
          .on('error', (err) => {
            console.log(err);
            reject(err);
          })
          .pipe(fs.createWriteStream(path.join(letterBase, item)))
          .on('error', (err) => {
            console.log(err);
            reject(err);
          })
          .on('close', () => resolve());

        console.log(' '.repeat(level) + 'File: ' + item);
      }
    });
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

const main = async () => {
  if (fs.existsSync(base)) {
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result);
    }

    await readDir(base, 0);

    if (srcDelete) {
      deleteDir(base);
    }
  } else {
    console.log('Dir is not exist');
  }
};

main();
