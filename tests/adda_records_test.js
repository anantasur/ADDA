var lib = require('../lib/adda_records');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');

var adda_records;
describe('adda_records',function(){
	beforeEach(function(){
		fs.writeFileSync('tests/data/adda.db',dbFileData);
		adda_records = lib.init('tests/data/adda.db');
	});

	describe('#getEmailAndPassword',function(){
		it('retrieves email and password',function(done){
			adda_records.getEmailAndPassword(function(err,users){
				assert.notOk(err);
				assert.deepEqual(users,[{id:1,email:'vikassry@gmail.com',password:'vikash'}, {id:2,email:'vikas2@email.com',password:'vikas123'}]);
				done();
			});
		});
	});

	describe('#addNewUser',function(){
		it('add a new user in users table',function(done){
			var user = {name:'krati',email:'krati@gmail.com',password:'krati'};
			adda_records.addNewUser(user,function(err){
				assert.notOk(err);
				adda_records.getEmailAndPassword(function(err,users){
					assert.deepEqual(users,[{id:1,email:'vikassry@gmail.com',password:'vikash'}, {id:2,email:'vikas2@email.com',password:'vikas123'}, {id:3,email:'krati@gmail.com',password:'krati'}])
					done();
				});
			});
		});
	});

	describe('#getTopics',function(){
		it('retrieves all the topics',function(done){
			adda_records.getTopics(function(err,topics){
				assert.notOk(err);
				assert.deepEqual(topics,[{"id": 1,"name": "Cricket"},{"id": 2,"name": "Football"}]);
				done();
			});
		});
	});

	describe('#getTopicDetails',function(){
		it('retrives the topic detail of cricket',function(done){
			var expected = {
								id:1,name:'Cricket',
								description:'About ind-Aus',
								start_time:'Wed Dec 17 2014 17:07:55',
								end_time:null,
								owner_id:2
							};
			adda_records.getTopicDetails(1,function(err,topic_details){
				assert.notOk(err);
				assert.deepEqual(topic_details,expected);
				done();
			});
		});
	});

	describe('#addNewTopic',function(){
		it('adds a new topic PK ,its description,owner id and start time',function(done){
			var newTopic = {topic_name:'PK',topic_desc:'dec-19th release',start_time:'Wed Dec 17 2014 17:07:55',owner_id:1};
			var expected = {
								id:3,name:'PK',
								description:'dec-19th release',
								start_time:'Wed Dec 17 2014 17:07:55',
								end_time:null,
								owner_id:1
							};
			adda_records.addNewTopic(newTopic,function(err){
				assert.notOk(err);
				adda_records.getTopicDetails(3,function(err,topic_details){
					assert.notOk(err);
					assert.deepEqual(topic_details,expected);
					done();
				});
			});
		});
	});
});