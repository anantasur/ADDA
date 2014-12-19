var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var adda_records = require('./lib/adda_records').init('./data/adda.db');
var _ = require('lodash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'shh dont tell',cookie:{maxAge:600000}}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/topicsList',function(req,res,next){
  var user_id = req.query.user;
  var topicAskedByUser = req.query.topic;
  adda_records.getTopics(function(err,topics){
    var topicNames =  _.map(topics,'name');
    var relatedTopics = topicNames.filter(function(name){
        return name.toLowerCase().indexOf(topicAskedByUser)>=0;
    });
    var getIdAndName = relatedTopics.map(function(obj){
        return _.filter(topics,{'name':obj})[0];
    });
    _.map(getIdAndName,function(obj){
        obj.user_id = user_id;
    });
    relatedTopics && res.render('topicsList',{topicNames:getIdAndName});
    err && next();
  });
});

app.get('/commentsList',function(req,res,next){
    var topicId = req.query.topic_id;
    adda_records.getAllComments(topicId,function(err,comments){
        comments && res.render('commentsList',{comments:comments});
        err && next();
    });
});

app.get('/addComment',function(req,res,next){
    var newComment = req.query.comment;
    var topicId = req.query.topicId;
    var user_id = req.query.userId;
    var newTime = String(new Date()).split('GMT')[0];
    var comment = {'topic_id':topicId, 'comment':req.query.comment,'user_id': user_id,
                             'entered_time': newTime};
    adda_records.addNewComment(comment,function(err){
        adda_records.get
        comment && res.render('newCommentList',comment);
        err && next();
    });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
