const Router = require('koa-router');
const router = new Router();

const ctrlHome = require('../controllers/home');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

const isAdmin = (ctx, next) => {
  if (ctx.session.isAuthorized) {
    return next();
  } else {
    ctx.redirect('/login');
  }
}

router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);

router.get('/login', ctrlLogin.get);
router.post('/login', ctrlLogin.post);

router.get('/admin', isAdmin, ctrlAdmin.get);
router.post('/admin/skills', isAdmin, ctrlAdmin.post_skills);
router.post('/admin/upload', isAdmin, ctrlAdmin.post_upload);

module.exports = router;
