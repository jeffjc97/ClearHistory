var urls;
var time;
var default_sites = ['https://www.google.com', 'https://www.facebook.com'];

function populateSiteList(urls) {
	console.log("popsitelist called");
	console.log(urls);
	for(i=0; i<urls.length; i++) {
		var clone = $("#accepted-clone").clone();
		$(clone).find("#bulletText").text(urls[i]);
		$(clone).find("#bulletList").attr("index", i);
		$(clone).find("span.iconClick").click(function() {deleteUrl(this)});
		$(clone).show();
		$('#accepted-urls').append(clone);
	}
}

function validateUrl(input_url) {
	chrome.history.addUrl({url:input_url}, function() {
		// check to see if the url is formatted correctly
		if (chrome.extension.lastError){
			var errorMsg = chrome.extension.lastError.message;
			console.log(errorMsg);
			if (errorMsg == "Url is invalid."){
				console.log("ERROR!!");
				$('.invalid-url').show();
				
			}
		}
		// if it is correct, add it to the local storage and display on frontend
		else {
			addUrl(input_url);
		}
	});
}

function deleteUrl(e){
	var index = $(e).parent().attr("index");
	urls.splice(i,1);
	chrome.storage.sync.set({'time':time, 'urls':urls}, function(){
		$(e).remove();
	});

}

function addUrl(input_url) {
	// backend
	//make sure there's no duplicate URLs
	if (urls.indexOf(input_url) == -1) {
		urls.push(input_url);
		chrome.storage.sync.set({'time':time, 'urls':urls}, function() {
			// frontend
			var clone = $("#accepted-clone").clone();
			$(clone).find("#bulletText").text(input_url);
			$(clone).find("#bulletList").attr("index", urls.length);
			$(clone).css("display: inline");
			$(clone).find("span.iconClick").click(function(){deleteUrl(this)});
			$('#accepted-urls').append(clone);
		});
	}
	else {
		$('.duplicate-url').show();
	}
	$('.urlinput').val('');	
}


$(document).ready( function() {
	// alert("yoo");
	chrome.storage.sync.get('time', function(result) {
		time = result['time'];
		console.log(time);
		if(time === undefined) {
			chrome.storage.sync.set({'time':0, 'urls':default_sites}, function() {
				$('.btn-group').find('[time="0"]').addClass("selected")
			});
		}
		else {
			$('.btn-group').find('[time="' + time + '"]').addClass("selected");
		}
	})

	chrome.storage.sync.get('urls', function(result) {
		urls = result['urls'];
		// kinda bad but fix later
		if(urls === undefined) {
			urls = default_sites
			chrome.storage.sync.set({'time':0, 'urls':default_sites});
		}
		populateSiteList(urls);
	})

	$('.btn').click(function() {
		$('.btn-group').find('.selected').removeClass('selected');
		time = $(this).attr("time");
		chrome.storage.sync.set({'time':time, 'urls':urls}, function() {
			console.log("New Time: ", time);
		});
		$(this).addClass("selected");
	})

	$('.urlinput').keydown(function(event) {
		if($('.invalid-url').css('display') != 'none') {
			$('.invalid-url').hide();
		}
		if($('.duplicate-url').css('display') != 'none') {
			$('.duplicate-url').hide();
		}
		if (event.keyCode == 13) {
			console.log($(this).val());
			validateUrl($(this).val());
			return false;
		}
	})
	 
});