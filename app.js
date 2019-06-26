const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.set('views', path.join(__dirname + path.normalize('/views')));
app.set('view engine', 'pug');

app.use(cookieParser('keyboard cat'));
app.use(session({ 
  cookie: {
    maxAge: 60000 
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname + '/public'), { index: false }));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});
  
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});
