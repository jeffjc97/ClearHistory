chrome.browserAction.onClicked.addListener(function () {
	chrome.browsingData.remove({
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