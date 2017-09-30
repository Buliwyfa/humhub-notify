humhub
var pingDuration = 2000;
var privateMessageBadge = "icons/icon96.png";
var closedTabBadge = "icons/icongray96.png";
var groupOrChannelBadge = "icons/icon96.png";

var configured = false;
var humhub;
chrome.storage.local.get("humhub_url", function(result) {
  humhub = result.humhub_url;
  if (humhub === undefined) {
    setNotConfiguredState();
  } else {
    configured = true;
  }
});

function goToHumHub() {
  if (!configured) {
    setNotConfiguredState();
    chrome.runtime.openOptionsPage()
    return;
  }
  chrome.tabs.getAllInWindow(null, function(tabs) {
    var found = false;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url.indexOf(humhub) > -1) {
        found = true;
        chrome.tabs.update(tabs[i].id, {selected: true});
      }
    }
    if(!found)
      chrome.tabs.create({url: humhub});
  });
}
chrome.browserAction.onClicked.addListener(goToHumHub);

function checkMessages() {
  if (!configured) {
    setNotConfiguredState();
    return;
  }
  chrome.windows.getAll({populate: true}, function(windows) {
    var connected = false;

    windows.forEach(function(a_window) {
      a_window.tabs.forEach(function(tab) {
        state = parseTabName(tab);
        if (state.success) {
          connected = true;
          updateState(state);
        }
      });
    });

    if (!connected) updateState();
  });
}
setInterval(checkMessages, pingDuration);

function parseTabName(tab) {
  var groupMessage = false;
  var numberUnread = 0;
  var success = false;

  if (tab.url.indexOf(humhub) > -1) {
    success = true;
    if (tab.title.indexOf("*") > -1) {
      groupMessage = true;
    }
    if (tab.title.indexOf("(") > -1) {
      var rgx = /\(([^)]+)\)/;
      var matcher = tab.title.match(rgx);
      numberUnread = matcher && matcher[1];
    }
  }

  return {"groupMessage": groupMessage, "numberUnread": numberUnread,
          "success": success};
}

function updateState(state) {
  if (!state) {
    chrome.browserAction.setIcon({path: closedTabBadge});
    chrome.browserAction.setBadgeText({text: ""});
    return;
  }

  var badge;
  var groupMessage = state["groupMessage"];
  var numberUnread = state["numberUnread"];

  // Set the badge icon.
  if (groupMessage)
    badge = groupOrChannelBadge;
  else
    badge = privateMessageBadge;

  chrome.browserAction.setIcon({path: badge});

  // Notifications handler
  chrome.notifications.getAll(
  function(callback, request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
  });

  // Set the number of unread.
  var bubbleText = "";
  if (numberUnread > 0)
    bubbleText = "" + numberUnread;

  chrome.browserAction.setBadgeText({text: bubbleText});
}

function setNotConfiguredState() {
  chrome.browserAction.setIcon({path: closedTabBadge});
  chrome.browserAction.setBadgeText({text: "?"});
}
