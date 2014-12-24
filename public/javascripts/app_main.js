var onSearchDone = function(topics){	
	$('#displayResult').html(topics);
};

var onSearch = function(){
	var topic = $('#topic').val().toLowerCase();
	var user = $('#user_id').val();
	$.ajax('/topicsList?topic='+topic+'&user='+user).done(onSearchDone).error(function(err){
		$('#displayResult').html(err.responseText);		
	});
};

var aferLoadingComplete = function(comments){
	$('#fiveComments').html(comments);
};

var onLoad = function(){
	var topic_id = $('#hidden').val();
	$.ajax('/commentsList?topic_id='+topic_id).done(aferLoadingComplete).error(function(err){
		$('#fiveComments').html(err.responseText);
	});
};

var afterAddingComment = function(comment){
	$('#newComment').append(comment);
};

var onSendingComment = function(){
	var comment = $('#addedComment').val();
	var topic_id = $('#hiddenTopicID').val();
	var user_id = $('#hiddenUserID').val();
	$.ajax('/addComment?comment='+comment+'&topicId='+topic_id+'&userId='+user_id).done(afterAddingComment).error(function(err){
		$('#newComment').html(err.responseText);
	});

};

var onPageLoad = function(){
	$('#search').click(onSearch);
	$('#loadComplete').click(onLoad);
	$('#sendComment').click(onSendingComment);
};
$(document).ready(onPageLoad);