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
});