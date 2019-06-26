const formidable = require('formidable');
const db = require('../models/db')();
const path = require('path');
const fs = require('fs');

module.exports.get = function (req, res) {
  res.render('pages/admin', { title: 'Admin', 
    msgskill: req.flash('msgSkill'),
    msgfile: req.flash('msgFile')
  });
};

module.exports.post_skills = function (req, res, next) {
  try {
    db.set('skills', {
      age: req.body.age,
      concerts: req.body.concerts,
      cities: req.body.cities,
      years: req.body.years
    });
    db.save();
  } catch(e) {
    req.flash('msgSkill', 'Error!');
    res.redirect('/admin');
  }
  
  req.flash('msgSkill', 'Success!');
  res.redirect('/admin');
};

module.exports.post_upload = function (req, res, next) {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  console.log(`dirname: ${__dirname}`);
  console.log(`cwd: ${process.cwd()}`);

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validation(fields, files);

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(303, '/admin');
    }

    const fileName = path.join(upload, files.photo.name)

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message);
        res.redirect(303, '/admin');
      }

      let dir = fileName.substr(fileName.indexOf('\\'));

      try {
        const products = db.get('products') 
          ? db.get('products')
          : [];
  
        products.push(
          {
            name: fields.name, 
            price: fields.price,
            src: dir
          }
        );

        db.set('products', products);
        db.save();
      } catch(e) {
        req.flash('msgFile', 'Error!');
        res.redirect('/admin');
      }
    
      req.flash('msgFile', 'Success!');
      res.redirect('/admin');
    });
  });
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка товара!', err: true };
  }

  if (!fields.name) {
    return { status: 'Не указано название товара!', err: true };
  }

  if (!fields.price) {
    return { status: 'Не указана цена товара!', err: true };
  }
  return { status: 'Ok', err: false };
};
