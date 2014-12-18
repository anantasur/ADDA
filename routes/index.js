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

router.post('/register', function(req, res) {
  var salt = bc.genSaltSync(10);
  var hash = bc.hashSync(req.body.password,salt);
  var result = {
    name:req.body.name,
    email:req.body.email,
    password:hash
  };
  adda_records.addNewUser(result,function(error){
    adda_records.get
    error ? res.render('register',result) : res.redirect('/dashboard');
    });  
});

router.get('/login',function(req,res){
  res.render('login');
});

router.post('/login', function(req, res) {
  adda_records.getEmailAndPassword(function(err,users){
    var user = _.find(users,{email:req.body.email});
    user && bc.compareSync(req.body.password,user.password)?
    res.redirect('/dashboard/'+user.id):res.render('login',{error:'invalid email or password'});
  });
});

router.get('/dashboard/:id', function(req, res) {
  res.render('dashboard',{user_id:req.params.id}); 
});

router.get('/topics/:id', function(req, res) {
  res.render('topics',{user_id:req.params.id}); 
});

router.post('/topics', function(req,res){
    var new_topic = {topic_name:req.body.topicName,topic_desc:req.body.topicDesc,owner_id:req.body.user_id};
    new_topic.start_time = new Date().toString().split('GMT')[0];
    adda_records.addNewTopic(new_topic,function(err){
      res.render('topics');
    });
});

router.get('/topic',function(req,res){
  res.render('topic');
});

module.exports = router;