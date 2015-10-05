var urls;
var time;
var tab;
var default_sites = ['https://www.gmail.com', 'https://en.wikipedia.org/wiki/Special:Random', 'http://www.bbc.com', 'http://finance.yahoo.com'];

function populateSiteList(urls) {
	if (urls.length == 0) {
		$(".message").fadeIn(500);
	}
	for(i=0; i<urls.length; i++) {
		var clone = $("#accepted-clone").clone();
		$(clone).find("#bulletText").text(urls[i]);
		$(clone).find("#bulletList").attr("index", i);
		$(clone).find("span.icon-click").click(function() {deleteUrl(this)});
		$(clone).show();
		$('#accepted-urls').append(clone);
	}
}

function learnRegExp(value){
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

function validateUrl(input_url) {
	if (learnRegExp(input_url)) {
		addUrl(input_url);
	}
	else{
		input_url = "http://" + input_url;
		if (learnRegExp(input_url)) {
			addUrl(input_url);
		}
		else{
			$('.invalid-url').show();
		}
	}
	// chrome.history.addUrl({url:input_url}, function() {
	// 	// check to see if the url is formatted correctly
	// 	if (chrome.extension.lastError){
	// 		var errorMsg = chrome.extension.lastError.message;
	// 		console.log(errorMsg);
	// 		if (errorMsg == "Url is invalid."){
	// 			console.log("ERROR!!");
	// 			$('.invalid-url').show();
				
	// 		}
	// 	}
	// 	// if it is correct, add it to the local storage and display on frontend
	// });
}

function deleteUrl(e){
	var index = $(e).parent().attr("index");
	console.log(index);
	urls.splice(index,1);
	if (urls.length == 0) {
		$(".message").fadeIn(500);
	}
	chrome.storage.sync.set({'tab':0, 'time':time, 'urls':urls}, function(){
		$(e).parent().fadeOut(200, function(){
			console.log(urls);
			$("#accepted-urls").empty();
			populateSiteList(urls);
		});
	});

}

function addUrl(input_url) {
	// backend
	//make sure there's no duplicate URLs
	if (urls.indexOf(input_url) == -1) {
		urls.push(input_url);
		chrome.storage.sync.set({'tab':0, 'time':time, 'urls':urls}, function() {
			// frontend
			$(".message").hide();
			var clone = $("#accepted-clone").clone();
			$(clone).find("#bulletText").text(input_url);
			$(clone).find("#bulletList").attr("index", urls.length-1);
			$(clone).find("span.icon-click").click(function(){deleteUrl(this)});
			$(clone).show();
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
			chrome.storage.sync.set({'tab':0, 'time':0, 'urls':default_sites}, function() {
				$('.time-button-group').find('[time="0"]').addClass("selected")
			});
		}
		else {
			$('.time-button-group').find('[time="' + time + '"]').addClass("selected");
		}
	})

	chrome.storage.sync.get('tab', function(result) {
		tab = result['tab'];
		// kinda bad but fix later
		if(tab === undefined) {
			tab = 0;
			chrome.storage.sync.set({'tab':0, 'time':0, 'urls':default_sites}, function() {
				$('.tab-button-group').find('[tab="0"]').addClass("selected")
			});
		}
		else {
			$('.tab-button-group').find('[tab="' + tab + '"]').addClass("selected");			
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

	$('.time-button').click(function() {
		$('.time-button-group').find('.selected').removeClass('selected');
		time = $(this).attr("time");
		chrome.storage.sync.set({'tab':tab, 'time':time, 'urls':urls}, function() {
			console.log("New Time: ", time);
		});
		$(this).addClass("selected");
	})

	$('.tab-button').click(function() {
		$('.tab-button-group').find('.selected').removeClass('selected');
		tab = $(this).attr("tab");
		chrome.storage.sync.set({'tab':tab, 'time':time, 'urls':urls}, function() {
			console.log("New Tab: ", tab);
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

	$("#restore-defaults").click(function(){
		default_sites.forEach(function(e){
			addUrl(e);
		});
	});
	 
});