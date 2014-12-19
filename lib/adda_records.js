var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");

var _getEmailAndPassword  = function(db,onComplete){
	var select_query = "select id,email,password from users";
	db.all(select_query,onComplete);
};

var _addNewUser = function(user,db,onComplete){
	var insert_query = "insert into users('name','email','password') values('"+user.name+"','"+user.email+"','"+user.password+"');";
	db.run(insert_query,onComplete);
};

var _getTopics = function(db,onComplete){
	var topic_query = "select id,name from topics";
	db.all(topic_query,onComplete);
};

var _getTopicDetails = function(id,db,onComplete){
	var topic_details_query = "select * from topics where id="+id+";"
	db.get(topic_details_query,function(err,topic_detail){
		err || onComplete(null,topic_detail);
	});
};

var _addNewTopic = function(newTopic,db,onComplete){
	var add_topic_query = "insert into topics(name,description,start_time,owner_id) values"+
		" ('"+newTopic.topic_name+"','"+newTopic.topic_desc+"','"+newTopic.start_time+"',"
		+newTopic.owner_id+");"
	db.run(add_topic_query,onComplete);
};

var _getAllComments = function(topicId,db,onComplete){
	var comments_query = 'select * from comments where topic_id='+topicId;
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
	var comments_query = 'select * from comments where topic_id='+topicId;
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

var _getNewUser = function(db,onComplete){
	var get_user_query = 'select * from users order by id desc';
	db.get(get_user_query,onComplete);
};

var _getFiveLastCommentedTopics = function(db,onComplete){
	var get_comments_query = 'select topic_id from comments order by entered_time desc;';
	db.all(get_comments_query,function(err,topics_comments){
		var filtered_topics =  _.uniq(topics_comments,'topic_id');
		var topic_name_query = 'select * from topics;'
		db.all(topic_name_query,function(err,topics){
			
			var topic_name = filtered_topics.map(function(id){
				return _.find(topics, function(obj) { 
					return obj.id == id.topic_id }).name;				
			});
			onComplete(null,topic_name);
		});
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
		getNewUser:operate(_getNewUser),
		getFiveLastCommentedTopics:operate(_getFiveLastCommentedTopics),
		getAllMyTopics : operate(_getAllMyTopics)
	};

	return records;
};

exports.init = init;