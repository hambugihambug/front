// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getToken as getMessagingToken, onMessage as onMessageHandler } from 'firebase/messaging';
import axios from 'axios';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 토큰 저장 함수로 분리
export const saveTokenToServer = (currentToken, userId = '간병사1') => {
    return axios.post(`/notifications/save-token`, {
        token: currentToken,
        userId: userId,
    });
};

// 필요한 함수들 함께 export
export { messaging };
export const getToken = getMessagingToken;
export const onMessage = onMessageHandler;
