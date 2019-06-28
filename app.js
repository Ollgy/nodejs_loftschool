const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const static = require('koa-static');
const koaBody = require('koa-body');
const session = require('koa-session');
const flash = require('koa-flash-simple');

const db = require('./models/db')();
global.db = db;

const app = new Koa();

const pug = new Pug({
  viewPath: path.join(__dirname + path.normalize('/views')),
  basedir: path.join(__dirname + path.normalize('/views')),
  pretty: true,
  noCache: true,
  app: app
});

app.use(static('./public', { index: false }));

app.use(session({
  key: 'keyboard cat',
  maxAge: 600000,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false
}, app));

app.use(flash());

app.use(koaBody({
  formidable: {
    uploadDir: './public/upload/'
  },
  multipart: true
}));

const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods())

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});