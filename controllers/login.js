const db = require('../models/db')();

module.exports.get = function (req, res) {
  res.render('pages/login', { title: 'Login', msglogin: req.flash('msgLogin') });
};

module.exports.post = function (req, res, next) {
  const { email, password } = req.body;
  try {
    db.set('authorize', {
      email,
      password
    });
    db.save();
  } catch(e) {
    console.log(e);
  }
  
  if (!email || !password) {
    req.flash('msgLogin', 'Enter fields!');
    res.redirect(303, '/login');
  } else if (email !== 'test@test' || password !== '123' ) {
    req.flash('msgLogin', 'Login or password is not correct!');
    res.redirect(303, '/login');
  } else {
    req.session.isAuthorized = true;
    res.redirect('/admin');
  }

  console.log(`email ${email}`);
  console.log(`password ${password}`);
};