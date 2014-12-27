var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");

var _getEmailAndPassword  = function(db,onComplete){
	var select_query = "select id,email,password from users";
	db.all(select_query,onComplete);
};

var _addNewUser = function(user,db,onComplete){
	var insert_query = "insert into users('name','email','password') values('"+
						user.name+"','"+user.email+"','"+user.password+"');";
	db.run(insert_query,onComplete);
};

var _getTopics = function(db,onComplete){
	var topic_query = "select id,name from topics";
	db.all(topic_query,onComplete);
};

var getUsersName = function(topic_detail,db,onComplete){
	var owner_query = 'select name from users where id='+topic_detail.owner_id;
	db.get(owner_query,function(err,owner_name){
		topic_detail.startedBy = owner_name.name;
		err || onComplete(null,topic_detail);
	});
};

var _getTopicDetails = function(id,db,onComplete){
	var topic_details_query = "select * from topics where id="+id+";";
	db.get(topic_details_query,function(err,topic_detail){
		if(!topic_detail){
			onComplete(null,null);
			return;
		};
		getUsersName(topic_detail,db,onComplete);
	});
};

var _getLastTopicID = function(newTopic,db,onComplete){
	if(!newTopic.topic_name){
		onComplete(null,null);
		return;
	}
	var get_last_inserted_topic_id = "select id from topics where name='"+
								newTopic.topic_name+"';";
	db.get(get_last_inserted_topic_id,function(err,topicID){
		onComplete(null,topicID);
	});
};

var gettopicId = function(newTopic,db,onComplete){
	var get_last_inserted_topic_id = "select id from topics where name='"+
								newTopic.topic_name+"';";

	db.get(get_last_inserted_topic_id,function(err,topic_id){
		if(!topic_id){
			onComplete(null,null);
			return;
		}
		var insert_into_joined = 'insert into joinedUsers values('+
								newTopic.owner_id+","+topic_id.id+");";

		db.run(insert_into_joined,onComplete);
	});
};
var _addNewTopic = function(newTopic,db,onComplete){
	var add_topic_query = "insert into topics(name,description,start_time,owner_id) values"+
		" ('"+newTopic.topic_name+"','"+newTopic.topic_desc+"','"+newTopic.start_time+"',"
		+newTopic.owner_id+");"

	db.run(add_topic_query,function(err){
		gettopicId(newTopic,db,onComplete);
	});
};

var _getJoinedUsers = function(topic_id,db,onComplete){
	var joinedUsers_query = 'select user_id from joinedUsers where topic_id='+topic_id;
	db.all(joinedUsers_query,function(err,userIds){
		onComplete(null, userIds);
	});
};

var _getAllComments = function(topicId,db,onComplete){
	var comments_query = 'select us.name as user_name, com.user_id as user_id,'+
		' com.topic_id as topic_id, com.comment as comment, com.entered_time from comments com,'+
		' users us where com.topic_id='+topicId+' and com.user_id=us.id';
	
	db.all(comments_query,function(err,comments){
		if(!comments.length){
			onComplete();
			return;
		}
		else
			onComplete(null,comments);
	});
};

var _getLastFiveComments = function(topicId,db,onComplete){
	var comments_query = 'select us.name as user_name, com.user_id as user_id,'+
		' com.topic_id as topic_id, com.comment as comment, com.entered_time from comments'+
		' com, users us where com.topic_id='+topicId+' and com.user_id=us.id';

	db.all(comments_query,function(err,comments){
		var comments = (comments.slice(-5));
		if(!comments.length){
			onComplete();
			return;
		}
		else
			onComplete(null,comments);
	});
};

var _addNewComment = function(comment,db,onComplete){
	var comment_query = 'insert into comments (topic_id, user_id, comment, entered_time) '+
					'values ('+comment.topic_id+','+comment.user_id+',"'+
					comment.comment+'","'+comment.entered_time+'")';
	db.run(comment_query, onComplete);
};

var _getNewUser = function(db,onComplete){
	var get_user_query = 'select * from users order by id desc';
	db.get(get_user_query,onComplete);
};

var getLastTopicName = function(topics_comments,db,onComplete){
	var filtered_topics =  _.uniq(topics_comments,'topic_id');
	var last_5Topics = _.first(filtered_topics,5);
	var topic_name_query = 'select * from topics;'
	db.all(topic_name_query,function(err,topics){
		var topic_name = last_5Topics.map(function(id){
			return _.find(topics, function(obj) { 
				return obj.id == id.topic_id }).name;				
		});
		onComplete(null,topic_name);
	});
};

var _getFiveLastCommentedTopics = function(db,onComplete){
	var get_comments_query = 'select topic_id from comments order by entered_time desc;';
	db.all(get_comments_query,function(err,topics_comments){
		getLastTopicName(topics_comments,db,onComplete);
	});
};

var _getAllMyTopics = function(userId,db,onComplete){
	var topicQuery = "select ju.topic_id as topic_id, top.name as topic_name from topics top,"+
							" joinedUsers ju where top.id=ju.topic_id and user_id="+userId;
	db.all(topicQuery,function(err,topics){
		if(!topics.length){
			onComplete();
			return;
		}
		else
			onComplete(null,topics);
	});
};

var _getUserNameById = function(id,db,onComplete){
	var select_name_query = "select name from users where id="+id;
	db.get(select_name_query,function(err,user_name){
		err || onComplete(null, user_name);
	});
};

var _checkUserExistInJoinTable = function(detail,db,onComplete){
	var check_user_query = "select * from joinedUsers where user_id="+detail.user_id+
		" and topic_id="+detail.topic_id+";"
	db.get(check_user_query,function(err,user){
		err || onComplete(null,user)
	});
}


var init = function(location){	
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];
			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};
	};

	var records = {		
		getEmailAndPassword:operate(_getEmailAndPassword),
		addNewUser:operate(_addNewUser),
		getTopics:operate(_getTopics),
		getTopicDetails:operate(_getTopicDetails),
		addNewTopic:operate(_addNewTopic),
		getAllComments:operate(_getAllComments),
		getLastFiveComments:operate(_getLastFiveComments),
		addNewComment:operate(_addNewComment),
		getNewUser:operate(_getNewUser),
		getFiveLastCommentedTopics:operate(_getFiveLastCommentedTopics),
		getAllMyTopics : operate(_getAllMyTopics),
		getJoinedUsers: operate(_getJoinedUsers),
		getLastTopicID:operate(_getLastTopicID),
		getUserNameById : operate(_getUserNameById),
		checkUserExistInJoinTable:operate(_checkUserExistInJoinTable)
	};

	return records;
};

exports.init = init;