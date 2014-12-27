var express = require('express');
var router = express.Router();
var adda_records = require('../lib/adda_records').init('./data/adda.db');
var _ = require('lodash');

/* GET users listing. */
router.get('/topicsList', function(req, res, next) {
    var user_id = req.query.user;
    var topicAskedByUser = req.query.topic;
    var user_id = req.query.user;
    adda_records.getTopics(function(err, topics) {
        var topicNames = _.map(topics, 'name');
        var relatedTopics = topicNames.filter(function(name) {
            return name.toLowerCase().indexOf(topicAskedByUser) >= 0;
        });
        var getIdAndName = relatedTopics.map(function(obj) {
            return _.filter(topics, {
                'name': obj
            })[0];
        });
        _.map(getIdAndName, function(obj) {
            obj.user_id = user_id
        })
        relatedTopics && res.render('topicsList', {
            topicNames: getIdAndName
        });
        err && next();
    });
});

router.post('/commentsList', function(req, res, next) {
    var topicId = req.query.topic_id;
    adda_records.getAllComments(topicId, function(err, comments) {
        comments && res.render('commentsList', {
            comments: comments
        });
        err && next();
    });
});

router.post('/addComment', function(req, res, next) {
    var newComment = unescape(req.query.comment);
    var topicId = req.query.topicId;
    var user_id = req.query.userId;
    var newTime = String(new Date()).split('GMT')[0];
    var comment = {
        'topic_id': topicId,
        'comment': newComment,
        'user_id': user_id,
        'entered_time': newTime
    };
    adda_records.addNewComment(comment, function(err) {
        adda_records.getUserNameById(user_id, function(err, user_name) {
            comment.user_name = user_name.name;
            comment && res.render('newCommentList', comment);
            err && next();
        });
    });
});

router.get('/option', function(req, res, next) {
    var btnFunction = {
        'join': adda_records.insertIntoJoinedUsers,
        'leave': adda_records.deleteFromJoinedUsers,
        'close':adda_records.updateEndTimeIntoTopics
    }
    var button = function(req, res, next) {
        var input = req.query;
        input.end_time = new Date().toString().split('GMT')[0];
        btnFunction[req.query.option](input, function(err) {
            res.redirect('/topic/' + req.query.topic_id + '_' + req.query.user_id);
            next();
        })
    }
    button(req, res, next);
});


module.exports = router;
