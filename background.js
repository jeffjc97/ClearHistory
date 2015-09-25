var millisecondsPerHour = 1000 * 60 * 60;
var millisecondsPerDay = millisecondsPerHour * 24;
var always = 0;

var timeArray = [millisecondsPerHour, millisecondsPerDay, always];
var timeToClear;
var clearDate;

chrome.storage.sync.get('time', function(result) {
	time = result['time'];
	console.log(time);
	if(time === undefined) {
		chrome.storage.sync.set({'time':0});
		timeToClear = timeArray[0];
	}
	else {
		timeToClear = timeArray[time];
	}
	clearDate = (new Date()).getTime() - timeToClear;
})

chrome.browserAction.onClicked.addListener(function () {
	chrome.browsingData.remove({
		"since": clearDate,
		"originTypes": {
			"unprotectedWeb": true
		}
	}, {
		"history": true
	}, function () {
		alert("Cleared!");
	});
	chrome.history.addUrl({url:"https://google.com"})
})