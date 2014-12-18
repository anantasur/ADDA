var onSearchDone = function(fileNamesHTML){	
	$('#displayResult').html(fileNamesHTML);
};

var onSearch = function(){
	var topic = $('#topic').val().toLowerCase();
	$.ajax('/topicsList?topic='+topic).done(onSearchDone).error(function(err){
		$('#displayResult').html(err.responseText);		
	});
};

var onPageLoad = function(){
	$('#search').click(onSearch);
};
$(document).ready(onPageLoad);