var sqlite3 = require("sqlite3").verbose();

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
	var add_topic_query = "insert into topics(name,description,start_time,owner_id) values ('"+
		newTopic.topic_name+"','"+newTopic.topic_desc+"','"+newTopic.start_time+"',"
		+newTopic.owner_id+");"
	db.run(add_topic_query,onComplete);
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
		addNewTopic:operate(_addNewTopic)
	};

	return records;
};

exports.init = init;