var lib = require('../lib/adda_records');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');

var adda_records;
describe('adda_records', function() {
	beforeEach(function() {
		fs.writeFileSync('tests/data/adda.db', dbFileData);
		adda_records = lib.init('tests/data/adda.db');
	});

	describe('#getEmailAndPassword', function() {
		it('retrieves email and password of all users', function(done) {
			adda_records.getEmailAndPassword(function(err, users) {
				assert.notOk(err);
				assert.deepEqual(users, [{
					id: 1,
					email: 'vikassry@gmail.com',
					password: 'vikash'
				}, {
					id: 2,
					email: 'vikas2@email.com',
					password: 'vikas123'
				}]);
				done();
			});
		});
	});

	describe('#addNewUser', function() {
		it('add a new user in users table', function(done) {
			var user = {
				name: 'krati',
				email: 'krati@gmail.com',
				password: 'krati'
			};
			adda_records.addNewUser(user, function(err) {
				assert.notOk(err);
				adda_records.getEmailAndPassword(function(eep, users) {
					assert.deepEqual(users, [{
						id: 1,
						email: 'vikassry@gmail.com',
						password: 'vikash'
					}, {
						id: 2,
						email: 'vikas2@email.com',
						password: 'vikas123'
					}, {
						id: 3,
						email: 'krati@gmail.com',
						password: 'krati'
					}]);
					done();
				});
			});
		});
	});

	describe('#getTopics', function() {
		it('retrieves all the topics', function(done) {
			adda_records.getTopics(function(err, topics) {
				assert.notOk(err);
				assert.deepEqual(topics, [{
					"id": 1,
					"name": "Cricket"
				}, {
					"id": 2,
					"name": "Football"
				}]);
				done();
			});
		});
	});

	describe('#getTopicDetails', function() {
		it('retrives the topic detail of cricket', function(done) {
			var expected = {
				id: 1,
				name: 'Cricket',
				description: 'About ind-Aus',
				start_time: 'Wed Dec 17 2014 17:07:55',
				end_time: null,
				owner_id: 2,
				startedBy: 'vikas2'
			};
			adda_records.getTopicDetails(1, function(err, topic_details) {
				assert.notOk(err);
				assert.deepEqual(topic_details, expected);
				done();
			});
		});
		it('retrieves nothing of existing topic', function(done) {
			adda_records.getTopicDetails(8, function(err, topic_details) {
				assert.notOk(err);
				assert.notOk(topic_details);
				done();
			});
		});
	});

	describe('#addNewTopic', function() {
		it('adds a new topic PK ,its description,owner id and start time also checks its entry in joinedUsers table',
			function(done) {
				var newTopic = {
					topic_name: 'PK',
					topic_desc: 'dec-19th release',
					start_time: 'Wed Dec 17 2014 17:07:55',
					owner_id: 1
				};
				var expected = {
					id: 3,
					name: 'PK',
					description: 'dec-19th release',
					start_time: 'Wed Dec 17 2014 17:07:55',
					end_time: null,
					owner_id: 1,
					startedBy: 'vikas'
				};
				adda_records.addNewTopic(newTopic, function(err) {
					assert.notOk(err);
					adda_records.getTopicDetails(3, function(err, topic_details) {
						assert.notOk(err);
						assert.deepEqual(topic_details, expected);
						adda_records.getJoinedUsers(3, function(err, user_ids) {
							assert.notOk(err);
							assert.deepEqual(user_ids, [{
								user_id: 1
							}]);
							done();
						});
					});
				});
			}
		);
	});


	describe('#getJoinedUsers', function() {
		it('gets joined users ids for a particular topic', function(done) {
			adda_records.getJoinedUsers(1, function(err, user_ids) {
				assert.notOk(err);
				assert.deepEqual(user_ids, [{
					user_id: 1
				}, {
					user_id: 2
				}]);
				done();
			});
		});
	});

	describe('#getAllComments', function() {
		it('retrieves the comments of cricket', function(done) {
			adda_records.getAllComments(1, function(err, comments) {
				var expected = [{
					"comment": "hello",
					"entered_time": "Wed Dec 17 2014 17:07:55",
					"topic_id": 1,
					"user_id": 1,
					"user_name": 'vikas'
				}, {
					"comment": "seeya",
					"entered_time": "Wed Dec 17 2014 17:08:55",
					"topic_id": 1,
					"user_id": 2,
					"user_name": 'vikas2'
				}, {
					"comment": "helloooooo",
					"entered_time": "Wed Dec 17 2014 17:08:57",
					"topic_id": 1,
					"user_id": 2,
					"user_name": 'vikas2'
				}, {
					"comment": "asdfgh",
					"entered_time": "Wed Dec 17 2014 17:08:59",
					"topic_id": 1,
					"user_id": 2,
					"user_name": 'vikas2'
				}, {
					"comment": "go_away",
					"entered_time": "Wed Dec 18 2014 17:10:55",
					"topic_id": 1,
					"user_id": 2,
					"user_name": 'vikas2'
				}];
				assert.notOk(err);
				assert.deepEqual(comments, expected);
				done();
			});
		});

		it('retrieves no comments for non existing topic', function(done) {
			adda_records.getAllComments(8, function(err, comments) {
				assert.notOk(err);
				assert.notOk(comments);
				done();
			});
		});
	});

	describe('#getLastFiveComments', function() {
		it('retrieves the comments of cricket', function(done) {
			adda_records.getLastFiveComments(1, function(err, comments) {
				var expected = [{
					user_name: 'vikas',
					user_id: 1,
					topic_id: 1,
					comment: 'hello',
					entered_time: 'Wed Dec 17 2014 17:07:55'
				}, {
					topic_id: 1,
					user_id: 2,
					user_name: 'vikas2',
					comment: 'seeya',
					entered_time: 'Wed Dec 17 2014 17:08:55'
				}, {
					topic_id: 1,
					user_id: 2,
					user_name: 'vikas2',
					comment: 'helloooooo',
					entered_time: 'Wed Dec 17 2014 17:08:57'
				}, {
					topic_id: 1,
					user_id: 2,
					user_name: 'vikas2',
					comment: 'asdfgh',
					entered_time: 'Wed Dec 17 2014 17:08:59'
				}, {
					topic_id: 1,
					user_id: 2,
					user_name: 'vikas2',
					comment: 'go_away',
					entered_time: 'Wed Dec 18 2014 17:10:55'
				}]
				assert.notOk(err);
				assert.deepEqual(comments, expected);
				done();
			});
		});
		it('retrieves no comments for non existing topic', function(done) {
			adda_records.getLastFiveComments(8, function(err, comments) {
				assert.notOk(err);
				assert.notOk(comments);
				done();
			});
		});
	});

	describe('#addNewComment', function() {
		it('adds new comment how are you? in comments table', function(done) {
			var new_comment = {
				'topic_id': 2,
				'user_id': 2,
				'comment': 'how are you?',
				'entered_time': 'Fri Dec 20 2014 17:10:05'
			};

			var expected = [{
				'user_name': 'vikas2',
				'user_id': 2,
				'topic_id': 2,
				'comment': 'byee',
				'entered_time': 'Wed Dec 17 2014 17:08:56'
			}, {
				'user_name': 'vikas2',
				'topic_id': 2,
				'user_id': 2,
				'comment': 'how are you?',
				'entered_time': 'Fri Dec 20 2014 17:10:05'
			}];

			adda_records.addNewComment(new_comment, function(err) {
				adda_records.getLastFiveComments(2, function(err, comments) {
					assert.notOk(err);
					assert.deepEqual(comments, expected);
					done();
				});
			});
		});
	});

	describe('#getNewUser', function() {
		it('gets the last inserted user', function(done) {
			var user = {
				name: 'userx',
				email: 'userx@gmail.com',
				password: 'userx'
			};
			var expected = {
				id: 3,
				name: 'userx',
				email: 'userx@gmail.com',
				password: 'userx'
			};
			adda_records.addNewUser(user, function(err) {
				adda_records.getNewUser(function(err, user) {
					assert.notOk(err);
					assert.deepEqual(user, expected);
					done();
				});
			});
		});
	});


	describe('#getFiveLastCommentedTopics', function() {
		it('retrieves the last 5 commented topics', function(done) {
			var expected = ['Cricket', 'Football'];
			adda_records.getFiveLastCommentedTopics(function(err, topics) {
				assert.notOk(err);
				assert.deepEqual(topics, expected);
				done();
			});
		});
	});

	describe('#getUserRelatedTopics', function() {
		it('retrieves user related all topics', function(done) {
			adda_records.getAllMyTopics(1, function(err, allTopics) {
				var expected = [{
					topic_id: 1,
					topic_name: 'Cricket'
				}, {
					topic_id: 2,
					topic_name: 'Football'
				}];
				assert.notOk(err);
				assert.deepEqual(allTopics, expected);
			});
			adda_records.getAllMyTopics(2, function(err, allTopics) {
				var expected = [{
					topic_id: 1,
					topic_name: 'Cricket'
				}];
				assert.notOk(err);
				assert.deepEqual(allTopics, expected);
				done();
			});
		});
		it('retrieves no topics for non existing user', function(done) {
			adda_records.getAllMyTopics(8, function(err, allTopics) {
				assert.notOk(err);
				assert.notOk(allTopics);
				done();
			});
		});
	});
	
	describe("#getLastTopicID", function() {
		it('retrieves id of the last topic added', function(done) {
			var newTopic = {
				topic_name: 'PK',
				topic_desc: 'dec-19th release',
				start_time: 'Wed Dec 17 2014 17:07:55',
				owner_id: 1
			};

			adda_records.addNewTopic(newTopic, function(err) {
				assert.notOk(err);
				adda_records.getLastTopicID(newTopic, function(err, topicId) {
					assert.notOk(err);
					assert.deepEqual(topicId, {
						id: 3
					});
					done();
				});
			});
		});
		it('retrieves no id if no last insertion has been made', function(done) {
			var newTopic = {};
			adda_records.addNewTopic(newTopic, function(err) {
				assert.notOk(err);
				adda_records.getLastTopicID(newTopic, function(err, topicId) {
					assert.notOk(err);
					assert.notOk(topicId);
					done();
				});
			});
		});
	});

	describe("#getUserNameById", function() {
		it("retrieves user's name by given user's id", function(done) {
			adda_records.getUserNameById(2, function(err, user_name) {
				assert.notOk(err);
				assert.deepEqual(user_name, {
					name: 'vikas2'
				});
				done();
			});
		});
		it("retrieves no user name for non-existing user's id", function(done) {
			adda_records.getUserNameById(8, function(err, user_name) {
				assert.notOk(err);
				assert.notOk(user_name);
				done();
			});
		});
	});

	describe("#checkUserExistInJoinTable", function() {
		it("checks that vikas has join the topic cricket or not", function(done) {
			var input = {
				user_id: 1,
				topic_id: 1
			};
			adda_records.checkUserExistInJoinTable(input, function(err, user) {
				assert.notOk(err);
				assert.deepEqual(user, input);
				done();
			});
		});
	});

	describe('#insertIntoJoinedUsers', function() {
		it('insert user id 2 and topic id 2 into joined users', function(done) {
			var input = {
				user_id: 2,
				topic_id: 2
			};
			adda_records.insertIntoJoinedUsers(input, function(err) {
				assert.notOk(err);
				adda_records.checkUserExistInJoinTable(input, function(err, user) {
					assert.notOk(err);
					assert.deepEqual(user, input);
					done();
				});
			});
		});
	});

	describe('#deleteFromJoinedUsers', function() {
		it('delete user id 2 topic id 1 from joined users', function(done) {
			var input = {
				user_id: 2,
				topic_id: 1
			};
			adda_records.deleteFromJoinedUsers(input, function(err) {
				assert.notOk(err)
				adda_records.checkUserExistInJoinTable(input, function(err, user) {
					assert.notOk(err);
					assert.deepEqual(user, undefined);
					done();
				});
			});
		});
	});
	describe('#updateEndTimeIntoTopics', function() {
		it('insert end time into cricket', function(done) {
			var input = {
				topic_id: 1,
				end_time: 'Wed Dec 27 2014 17:07:55'
			};
			var expected = {
				id: 1,
				name: 'Cricket',
				description: 'About ind-Aus',
				start_time: 'Wed Dec 17 2014 17:07:55',
				end_time: 'Wed Dec 27 2014 17:07:55',
				owner_id: 2,
				startedBy: 'vikas2'
			};
			adda_records.updateEndTimeIntoTopics(input, function(err) {
				assert.notOk(err);
				adda_records.getTopicDetails(1, function(err, topic) {
					assert.notOk(err);
					assert.deepEqual(topic, expected);
					done();
				});
			});
		});
	});
});