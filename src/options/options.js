// Saves options to chrome.storage.local.
function save_options() {
  var humhub_url = document.getElementById('humhub_url').value;
  chrome.storage.local.set({humhub_url: humhub_url}, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.extension.getBackgroundPage().window.location.reload()
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
