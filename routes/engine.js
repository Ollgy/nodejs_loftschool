const path = require('path');
const fs = require('fs');

const EventEmitter = require('events').EventEmitter;
const engine = new EventEmitter;

const utils = require('./utils');


engine.on('get/index', async (ctx, resolve, reject) => {
  try {
    const [skills_data, products] = await Promise.all([
        db.get('skills') || [],
        db.get('products') || []
    ]);

    return resolve({ skills_data, products });
  }
  catch(err) {
    console.error('err', err);
    return reject(err);
  }
});

engine.on('post/index', async ({ name, email, message }, resolve, reject) => {
  try {
    const msgs = await db.get('home') || [];

    msgs.push(
      {
        name, 
        email, 
        message
      }
    );

    await db.set('home', msgs),
    await db.save()

    console.log(`name ${name}`);
    console.log(`email ${email}`);
    console.log(`message ${message}`);

    return resolve();
  }
  catch(err) {
    console.error('err', err);
    return reject(err);
  }
});

engine.on('post/login', ({ email, password }, resolve, reject) => {
  utils.setField('authorize', { email, password }, resolve, reject);
});

engine.on('post_skills/admin', ({ age, concerts, cities, years }, resolve, reject) => {
  utils.setField('skills', { age, concerts, cities, years }, resolve, reject);
});

engine.on('post_upload/admin', async (ctx, resolve, reject) => {
  const { name: photoName, size, path: tempPath } = ctx.request.files.photo;
  const { name, price } = ctx.request.body;

  const uploadDir = path.join(process.cwd(), '/public', 'upload');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const valid = utils.validationPhoto(photoName, size, name, price);

  if (valid.err) {
    fs.unlinkSync(tempPath);
    ctx.flash.set({ msgFile: valid.status });
    reject(valid.status);
  }

  const fileName = path.join(uploadDir, photoName);
  fs.renameSync(tempPath, fileName);

  const dir = fileName.substr(fileName.indexOf('\\upload'));
  const products = await db.get('products') || [];

  products.push(
    {
      name, 
      price,
      src: dir
    }
  );

  await db.set('products', products);
  await db.save();

  resolve(true);
});

module.exports = engine; 