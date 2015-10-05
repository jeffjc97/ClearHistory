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

function closeTabs(setting, active_tab) {
	if(setting == 1) {
		chrome.tabs.remove(active_tab.id);
	}
	else if(setting == 2) {
		chrome.windows.getCurrent(function(window) {
			chrome.windows.remove(window.id);
		})
	}
}

chrome.browserAction.onClicked.addListener(function (active_tab) {
	chrome.storage.sync.get('time', function(result) {
		time = result['time'];
		// console.log(time);
		if(time === undefined) {
			chrome.storage.sync.set({'tab':0 , 'time':0, 'urls':default_sites});
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
		alert("History Burned!");
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

	chrome.storage.sync.get('tab', function(result) {
		tab = result['tab'];
		// console.log(time);
		if(tab === undefined) {
			closeTabs(0, active_tab);
		}
		else {
			closeTabs(tab, active_tab);
		}
	})
})

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "options.html"}, function (tab) {
        console.log("Options launched!");
    });
});