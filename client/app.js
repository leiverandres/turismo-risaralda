const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const partials = require('express-partials');
const methodOverride = require('method-override');

const channels = require('./routes/channels');
const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(partials());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.db = require('./models/db');

app.use('/', index);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/channels', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
