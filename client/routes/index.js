var express = require('express');
var router = express.Router();
const request = require('superagent');

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Bienvenido al eje cafetero'});
});

router.get('/login', function(req, res, next) {
  res.render('forms/login', {title: 'Iniciar sesion'});
});

router.get('/signup', function(req, res, next) {
  res.render('forms/signup', {title: 'Resgistrarse'});
});

module.exports = router;
