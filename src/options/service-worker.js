
window.addEventListener('push', function(event) {
  console.log('Received a message', event);

  var title = 'New notification.';
  var body = 'You have a new notification.';
  var icon = '/icons/icon96.png';
  var tag = 'notify';

  event.waitUntil(
    window.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

window.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow({humhub_url: 'https://'});
    }
  }));
});
