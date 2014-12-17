var sqlite3 = require("sqlite3").verbose();

var _getEmailAndPassword  = function(db,onComplete){
	var select_query = "select id,email,password from users";
	db.all(select_query,onComplete);
};

var _addNewUser = function(user,db,onComplete){
	var insert_query = "insert into users('name','email','password') values('"+user.name+"','"+user.email+"','"+user.password+"');";
	db.run(insert_query,onComplete);
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
		addNewUser:operate(_addNewUser)
	};

	return records;
};

exports.init = init;




















// var fs = require('fs');
// var _ = require('lodash');
// var USERFILE = './data/adda.db';
// var users = fs.existsSync(USERFILE)?
// 	JSON.parse(fs.readFileSync(USERFILE,'utf-8')):
// 	[];
// var saveAll = function(){
// 	fs.writeFile(USERFILE,JSON.stringify(users));
// };
// exports.create = function(){
// 	return {
// 		save: function(user){
// 			console.log(_.some(users,{email:user.email}))
// 			if(_.some(users,{email:user.email}))
// 				return {error:'email already registered'};
// 			users.push(user);
// 			saveAll();
// 			return {};
// 		},
// 		load: function(email){
// 			return _.find(users,{email:email});
// 		}
// 	};
// };

