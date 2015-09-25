$(document).ready( function() {
	// alert("yoo");
	chrome.storage.sync.get('time', function(result) {
		time = result['time'];
		console.log(time);
		if(time === undefined) {
			chrome.storage.sync.set({'time':0});
			$('.btn-group').find('[time="0"]').addClass("selected")
		}
		else {
			$('.btn-group').find('[time="' + time + '"]').addClass("selected");
		}
	})

	$('.btn').click(function() {
		$('.btn-group').find('.selected').removeClass('selected');
		newTime = $(this).attr("time");
		console.log("New Time: ", newTime);
		chrome.storage.sync.set({'time':newTime});
		$(this).addClass("selected");
	})
});