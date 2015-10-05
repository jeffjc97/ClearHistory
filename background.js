var millisecondsPerHour = 1000 * 60 * 60;
var millisecondsPerDay = millisecondsPerHour * 24;
var always = 0;

var timeArray = [millisecondsPerHour, millisecondsPerDay, always];
var timeToClear;
var clearDate;
var default_sites = ['https://www.gmail.com', 'https://en.wikipedia.org/wiki/Special:Random', 'http://www.bbc.com', 'http://finance.yahoo.com'];


function addUrls(sites) {
	for(i=0; i<sites.length; i++) {
		chrome.history.addUrl({url:sites[i]});
	}
}

chrome.browserAction.onClicked.addListener(function () {
	chrome.storage.sync.get('time', function(result) {
		time = result['time'];
		// console.log(time);
		if(time === undefined) {
			chrome.storage.sync.set({'time':0, 'urls':default_sites});
			timeToClear = timeArray[0];
		}
		else {
			timeToClear = timeArray[time];
		}
		clearDate = (new Date()).getTime() - timeToClear;
	})

	chrome.browsingData.remove({
		"since": clearDate,
		"originTypes": {
			"unprotectedWeb": true
		}
	}, {
		"history": true
	}, function () {
		console.log("History Cleared");
	});

	chrome.storage.sync.get('urls', function(result) {
		urls = result['urls'];
		// console.log(time);
		if(urls === undefined) {
			addUrls(default_sites);
		}
		else {
			addUrls(urls);
		}
	})
})