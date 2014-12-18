var express = require('express');
var bc = require('bcryptjs');
var router = express.Router();
var adda_records = require('../lib/adda_records').init('./data/adda.db');
var _ = require('lodash');
var winston = require('winston');

router.get('/',function(req,res){
  res.render('index');
});

router.get('/register',function(req,res){
  res.render('register');
});

router.get('/login',function(req,res){
  res.render('login');
});

router.post('/register', function(req, res) {
  var salt = bc.genSaltSync(10);
  var hash = bc.hashSync(req.body.password,salt);
  var result = {
    name:req.body.name,
    email:req.body.email,
    password:hash
  };
  adda_records.addNewUser(result,function(error){
    error ? res.render('register',result) : res.redirect('/dashboard');
    });  
});

router.post('/login', function(req, res) {
  adda_records.getEmailAndPassword(function(err,users){
    var userPassword = _.find(users,{email:req.body.email})
    _.some(users,{email:req.body.email}) && bc.compareSync(req.body.password,userPassword.password)?
    res.redirect('/dashboard'):res.render('login',{error:'invalid email or password'});
  });
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard'); 
});


module.exports = router;