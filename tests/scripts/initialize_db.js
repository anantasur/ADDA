var location = process.argv[2];
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(location);
var runAllQueries = function(){	
	var runQuery = function(q){
		console.log(q);
		db.run(q,function(err){
			if(err){
				console.log(err);
				process.exit(1);
			}
		});
	};

	[	"create table users(id integer primary key autoincrement,"+
			" name text, email text, password text);",

		"create table topics(id integer primary key autoincrement, name text,"+
			" description text, start_time text, end_time text, owner_id integer not null,"+
			" foreign key(owner_id) references users(id));",

		"create table comments(topic_id integer not null, user_id integer not null,"+
			" comment text,entered_time text, foreign key(topic_id) references topics(id),"+
			" foreign key(user_id) references users(id));",

		"create table joinedUsers(user_id integer not null, topic_id integer not null,"+
			" foreign key(topic_id) references topics(id),foreign key(user_id) references users(id));"
	
	].forEach(runQuery)	;
};
db.serialize(runAllQueries);