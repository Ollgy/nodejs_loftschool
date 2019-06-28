const emitter = require('../routes/emitter');

module.exports.get = async (ctx) => {
  try {
    ctx.render('pages/login', {
      title: 'Login', 
      msglogin: ctx.flash && ctx.flash.get() ? ctx.flash.get().msglogin : null
    });
  }
  catch(err) {
    console.error('err', err);
    ctx.status = 404;
    ctx.render('error');
  }
};

module.exports.post = async (ctx) => {
  const { email, password } = ctx.request.body;

  await new Promise((resolve, reject) => {
    emitter.emit('post/login', ctx.request.body, resolve, reject);
  });
   
  if (!email || !password) {
    ctx.flash.set({ msglogin: 'Enter fields!' });
    ctx.redirect('/login');
  } else if (email !== 'test@test' || password !== '123' ) {
    ctx.flash.set({ msglogin: 'Login or password is not correct!' });
    ctx.redirect('/login');
  } else {
    ctx.session.isAuthorized = true;
    ctx.redirect('/admin');
  }

  console.log(`email ${email}`);
  console.log(`password ${password}`);
};