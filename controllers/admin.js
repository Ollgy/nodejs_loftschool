
const engine = require('../routes/engine');

module.exports.get = async (ctx) => {
  try {
    ctx.render('pages/admin', { title: 'Admin', 
      msgskill: ctx.flash && ctx.flash.get() ? ctx.flash.get().msgSkill : null,
      msgfile: ctx.flash && ctx.flash.get() ? ctx.flash.get().msgFile : null
    });
  }
  catch(err) {
    console.error('err', err);
    ctx.status = 404;
    ctx.render('error');
  }
};

module.exports.post_skills = async (ctx) => {
  const { age, concerts, cities, years } = ctx.request.body;

  try {
    await new Promise((resolve, reject) => {
      engine.emit('post_skills/admin', ctx.request.body, resolve, reject);
    });

    ctx.flash.set({ msgSkill: 'Success!' });
    ctx.redirect('/admin');
  } catch(e) {
    ctx.flash.set({ msgSkill: 'Error!' });
    ctx.redirect('/admin');
  }
};

module.exports.post_upload = async (ctx) => {
  try {
    await new Promise(async (resolve, reject) => {
      engine.emit('post_upload/admin', ctx, resolve, reject);
    });

    ctx.flash.set({ msgFile: 'Success!'});
    ctx.redirect('/admin');
  }
  catch(err) {
    ctx.flash.set({ msgFile: err });
    ctx.redirect('/admin');
  }
};

