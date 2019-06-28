const emitter = require('../routes/emitter');

module.exports.get = async (ctx) => {
  const data = await new Promise((resolve, reject) => {
    emitter.emit('get/index', ctx, resolve, reject);
  });
  
  try {
    ctx.render('pages/index', { 
      title: 'Home', 
      ...data
    });
  }
  catch(err) {
    console.error('err', err);
    ctx.status = 404;
    ctx.render('error');
  }
};

module.exports.post = async (ctx) => {  
  try {
    await new Promise((resolve, reject) => {
      emitter.emit('post/index', ctx.request.body, resolve, reject);
    });
   
    ctx.redirect('/');
  }
  catch(err) {
    console.error('err', err);
    ctx.status = 404;
    ctx.render('error');
  }
};

