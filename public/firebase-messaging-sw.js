// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'your_api_key',
    projectId: 'your_project_id',
    messagingSenderId: 'your_sender_id',
    appId: 'your_app_id',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 핸들러 수정
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] 백그라운드 메시지:', payload);

    // 클라이언트 찾기
    self.clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true,
        })
        .then((clients) => {
            if (clients.length > 0) {
                // 활성화된 클라이언트가 있으면 메시지 전달
                const client = clients[0];
                client.postMessage({
                    type: 'FIREBASE_ALERT',
                    payload: payload,
                });
                return;
            }

            // 활성화된 클라이언트가 없으면 기본 알림 표시
            const { title, body } = payload.notification;
            self.registration.showNotification(title, {
                body,
                icon: '/logo.png',
                // 클릭하면 앱 열기
                data: { url: self.location.origin },
            });
        });
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // 앱 열기
    const urlToOpen = event.notification.data?.url || self.location.origin;

    event.waitUntil(
        self.clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                // 이미 열린 창이 있으면 포커스
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // 열린 창이 없으면 새 창 열기
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
    );
});
