pragma foreign_keys = 'ON';
insert into users (id, name, email, password) 
	values (1,'vikas','vikassry@gmail.com', 'vikash'), (2,'vikas2','vikas2@email.com','vikas123');
insert into topics (id, name, description, start_time, end_time, owner_id)
	values (1,'Cricket','About ind-Aus','Wed Dec 17 2014 17:07:55',null, 2), (2,'Football','About ISL','Wed Dec 16 2014 17:07:55',null, 1);
insert into comments (topic_id,user_id,comment)
	values (1,1,'hello'), (2,2,'byee'), (1,2,'seeya');
insert into joinedUsers (user_id, topic_id) 
	values (1,1), (1,2), (2,1);