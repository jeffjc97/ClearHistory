var millisecondsPerHour = 1000 * 60 * 60;
var millisecondsPerDay = millisecondsPerHour * 24;
var always = 0;

// the number of milliseconds to clear for each option
var timeArray = [millisecondsPerHour, millisecondsPerDay, always];
var timeToClear;
var clearDate;
var default_sites = ['https://www.gmail.com', 'https://en.wikipedia.org/wiki/Special:Random', 'http://www.bbc.com', 'http://finance.yahoo.com'];

// adds the specified urls into the user's history
function addUrls(sites) {
	for(i=0; i<sites.length; i++) {
		chrome.history.addUrl({url:sites[i]});
	}
}

// when the extension icon is clicked, retrieve the user's data (time, urls), clear the history, and add the new urls
chrome.browserAction.onClicked.addListener(function () {
	chrome.storage.sync.get('time', function(result) {
		time = result['time'];
		// if the time hasn't been set (i.e. a new user)
		if(time === undefined) {
			chrome.storage.sync.set({'time':0, 'urls':default_sites});
			timeToClear = timeArray[0];
		}
		else {
			timeToClear = timeArray[time];
		}
		clearDate = (new Date()).getTime() - timeToClear;
	})

	// clear the user's history
	// chrome.browsingData.remove({
	// 	"since": clearDate,
	// 	"originTypes": {
	// 		"unprotectedWeb": true
	// 	}
	// }, {
	// 	"history": true
	// }, function () {
	// 	alert("Cleared!");
	// });
	
	// calling addUrls to actually add the urls into the history
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