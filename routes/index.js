const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

const isAuthorized = (req, res, next) => {
  if (req.session.isAuthorized) {
    return next();
  }

  res.redirect('/login');
};

router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);

router.get('/login', ctrlLogin.get);
router.post('/login', ctrlLogin.post);

router.get('/admin', isAuthorized, ctrlAdmin.get);
router.post('/admin/skills', ctrlAdmin.post_skills);
router.post('/admin/upload', ctrlAdmin.post_upload);

module.exports = router;
