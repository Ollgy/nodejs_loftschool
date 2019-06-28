const path = require('path');
const fs = require('fs');

const schema = {
  authorize: {},
  skills: {},
  products: [],
  home: []
}

const readFile = (path) => new Promise(async (resolve, reject) => {
  try {
    let json, data;

    fs.readFile(path, 'utf8', (err, data) => {
      if(data) {
        json = JSON.parse(data);
      } else {
        console.log('File is empty');
        json = {};
      }

      return resolve(json);
    });
  } catch (e) {
    console.log(e);

    return reject(e);
  }
});

const writeFile = (path, str) => new Promise(async (resolve, reject) => {
  if (!path) {
    console.log('Set filepath in constructor of DB-object');

    return reject();
  }

  try {
    await fs.writeFile(path, str, err => {
      if (err) {
        console.log(err)
      }
    });

    return resolve();
  } catch (e) {
    console.log(e);

    return reject(e);
  }
}); 

const stringify = (obj) => {
  try {
    return JSON.stringify(obj, null, 4);
  } catch(e) {
    console.log(e);
    return ''
  }
}

class DB {
  constructor(filePath) {
    this.filePath = filePath;
    this.jsonData = '{}';

    if(!fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, stringify(schema));
    }
  }

  async get(field) {
    const { filePath } = this;
    const json = await readFile(filePath);

    return !field ? json : json[field];
  }

  async set(field, value) {
    const { filePath } = this;
    
    if(!field) {
      console.log('Field is necessary for set-method');
      return;
    }

    const json = await readFile(filePath);

    json[field] = value;
    
    this.jsonData = stringify(json);

    return json;
  }

  async delete(field) {
    const { filePath, jsonData } = this;
    let json;
    
    if(!field) {
      json = schema
    } else {
      json = await readFile(filePath);
      if (json.hasOwnProperty(field)) {
        delete json[field];
      }
    }
    
    this.jsonData = stringify(json);

    return json;
  }

  async save() {
    const { filePath, jsonData } = this;
    await writeFile(filePath, jsonData);
  }
}

module.exports = function () {
  return new DB(path.join(__dirname, 'db.json'));
};
