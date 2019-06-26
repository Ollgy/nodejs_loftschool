const db = require('../models/db')();

module.exports.get = function (req, res) {
  res.render('pages/index', { 
    title: 'Home', 
    skills_data: db.get('skills') || [],
    products: db.get('products') || []
  });
};

module.exports.post = function (req, res, next) {
  const { name, email, message } = req.body;
  const msgs = db.get('home') 
    ? db.get('home')
    : [];

  msgs.push(
    {
      name,
      email,
      message
    }
  );

  db.set('home', msgs);
  db.save();
  res.redirect(303, '/');
  
  console.log(`name ${name}`);
  console.log(`email ${email}`);
  console.log(`message ${message}`);
};

