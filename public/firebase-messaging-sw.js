// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Firebase configuration - these values need to be updated with your project details
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID", 
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/notification-icon.png',
    badge: '/assets/notification-badge.png',
    data: payload.data
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  // Close the notification
  event.notification.close();
  
  // Get the notification data
  const data = event.notification.data;
  
  // Determine the URL to navigate to based on the incident type
  let url = '/';
  if (data && data.incident_type) {
    if (data.incident_type === 'fall') {
      url = '/incidents';
    } else if (data.incident_type.includes('temperature') || data.incident_type.includes('humidity')) {
      url = '/environmental';
    }
  }
  
  // Navigate to the appropriate page
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((clientList) => {
      // Check if a window client is already open and navigate to the URL
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus().then((client) => client.navigate(url));
        }
      }
      // If no window client is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
