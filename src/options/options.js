// Saves options to chrome.storage.local.
function save_options() {
  var humhub_url = document.getElementById('humhub_url').value;
  chrome.storage.local.set({humhub_url: humhub_url}, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.extension.getBackgroundPage().window.location.reload();
  });
}

// Restores text box state using the value stored in chrome.storage.local.
function restore_options() {
  chrome.storage.local.get({humhub_url: 'https://'}, function(items) {
    document.getElementById('humhub_url').value = items.humhub_url;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if(!notify.isSupported){
  // display message that it will be supported
  }
  else{
      notify.config({pageVisibility: false, autoClose: 5000});
      if (Notification.permission !== "granted")
        Notification.requestPermission();
      }
  }
);

function notify() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Google Chrome.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('New Notification', {
      body: "Hey there! You have a new notification!",
    });

  }
}
