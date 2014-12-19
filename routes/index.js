var express = require('express');
var bc = require('bcryptjs');
var router = express.Router();
var adda_records = require('../lib/adda_records').init('./data/adda.db');
var _ = require('lodash');
var winston = require('winston');

var loadUserFromSession = function(req,res,next){
  var user = req.session.userEmail;
  if(user){
    req.user = user;    
    res.locals.user = user;
  }else{
    delete req.session.userEmail;
  }
  next();
};

var requireLogin = function(req,res,next){
  req.user? next(): res.redirect('/login');
};

router.use(loadUserFromSession);

router.get('/',function(req,res){
  adda_records.getFiveLastCommentedTopics(function(err,topics){
    res.render('index',{topics:topics});    
  });
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
    error ? res.render('register',result) :
    adda_records.getNewUser(function(err,user){
       res.redirect('/dashboard/'+user.id);      
    });
  });  
});

router.get('/login',function(req,res){
  res.render('login');
});

router.post('/login', function(req, res) {
  adda_records.getEmailAndPassword(function(err,users){
    var user = _.find(users,{email:req.body.email});
    if(user && bc.compareSync(req.body.password,user.password)){
      req.session.userEmail = user.email;
      res.redirect('/dashboard/'+user.id);  
    }else
    res.render('login',{error:'invalid email or password'});
  });
});

router.get('/dashboard/:id', function(req, res) {
  adda_records.getAllMyTopics(req.params.id,function(err,relatedTopics){
    res.render('dashboard',{user_id:req.params.id,topics:relatedTopics}); 
  });
});

router.get('/topics/:id', function(req, res) {
  res.render('topics',{user_id:req.params.id}); 
});

router.post('/topics', function(req,res){
    var new_topic = {topic_name:req.body.topicName,
                      topic_desc:req.body.topicDesc,
                      owner_id:req.body.user_id
                    };
    new_topic.start_time = new Date().toString().split('GMT')[0];
    adda_records.addNewTopic(new_topic,function(err){
    res.redirect('/topics/'+req.body.user_id);
    });
});

router.get('/topic/:id',function(req,res){
  res.render('topic');
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;