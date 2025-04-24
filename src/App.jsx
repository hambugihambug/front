import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { messaging, getToken, onMessage, saveTokenToServer } from './firebase';
=======
// import { messaging, getToken, onMessage, saveTokenToServer } from './firebase';
>>>>>>> b47947f53a3296521fc466a63e409020a2761bb4
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import RoomManagement from './components/RoomManagement';
import BedManagement from './components/BedManagement';
import FallIncidents from './components/FallIncidents';
import EnvironmentalData from './components/EnvironmentalData';
import Notifications from './components/Notifications';
import RoomDetail from './components/RoomDetail';
import Schedule from './components/Schedule';
import Home from './components/Home';
import PatientDetail from './components/PatientDetail';
import './App.css';

// 알림 컴포넌트
const AlertNotification = ({ notification, onClose }) => {
    if (!notification) return null;

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert">
                <div className="custom-alert-header">
                    <span>⚠️ {notification.title}</span>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="custom-alert-body">{notification.body}</div>
                <div className="custom-alert-footer">
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const showCustomAlert = (title, body) => {
        setNotification({ title, body });

        // 알림 소리 재생 (선택 사항)
        try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch((err) => console.log('알림 소리 재생 실패:', err));
        } catch (error) {
            console.log('오디오 객체 생성 실패:', error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('🛡️ Service Worker 등록 성공');

<<<<<<< HEAD
                    // 서비스 워커로부터 메시지 수신 처리
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        console.log('Service Worker로부터 메시지 수신:', event.data);

                        if (event.data && event.data.type === 'FIREBASE_ALERT') {
                            const payload = event.data.payload;
                            let title, body;

                            if (payload.notification) {
                                title = payload.notification.title;
                                body = payload.notification.body;
                            } else if (payload.data) {
                                title = payload.data.title || '낙상 사고 발생';
                                body =
                                    payload.data.body || payload.data.message || `병실에서 낙상 사고가 감지되었습니다.`;
                            } else {
                                title = '알림';
                                body = '새로운 알림이 도착했습니다.';
                            }

                            // 커스텀 알림 표시
                            showCustomAlert(title, body);
                        }
                    });

=======
>>>>>>> b47947f53a3296521fc466a63e409020a2761bb4
                    getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                    })
                        .then((currentToken) => {
                            if (currentToken) {
                                console.log('📬 FCM Token:', currentToken);
                                // 서버로 토큰 전송
                                saveTokenToServer(currentToken);
                            } else {
                                console.log('알림 권한이 없음');
                            }
                        })
                        .catch((err) => {
                            console.error('토큰 가져오기 실패:', err);
                        });

                    // 포그라운드 메시지 수신 처리
                    onMessage(messaging, (payload) => {
                        console.log('포그라운드 메시지 수신:', payload);
<<<<<<< HEAD

                        // 모든 payload 구조 확인
                        console.log('Payload structure:', JSON.stringify(payload));

                        // 다양한 구조에서 정보 추출
                        let title, body;

                        if (payload.notification) {
                            title = payload.notification.title;
                            body = payload.notification.body;
                        } else if (payload.data) {
                            title = payload.data.title || '낙상 사고 발생';
                            body = payload.data.body || payload.data.message || `병실에서 낙상 사고가 감지되었습니다.`;
                        } else {
                            title = '알림';
                            body = '새로운 알림이 도착했습니다.';
                        }

                        // 커스텀 알림 표시
                        showCustomAlert(title, body);

                        // 브라우저 알림 표시 방지
                        return false;
=======
                        const { title, body } = payload.notification || {};
                        if (title && body) {
                            alert(`🔔 ${title}\n${body}`);
                        }
>>>>>>> b47947f53a3296521fc466a63e409020a2761bb4
                    });
                })
                .catch((err) => {
                    console.error('Service Worker 등록 실패:', err);
                });
        }
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">병원 모니터링 시스템 로딩 중...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/rooms" element={<RoomManagement />} />
                        <Route path="/rooms/:roomName" element={<RoomDetail />} />
                        <Route path="/patients" element={<PatientManagement />} />
                        <Route path="/patients/:id" element={<PatientDetail />} />
                        <Route path="/beds" element={<BedManagement />} />
                        <Route path="/fall-incidents" element={<FallIncidents />} />
                        <Route path="/environmental" element={<EnvironmentalData />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/schedule" element={<Schedule />} />
                    </Routes>
                </main>
                <AlertNotification notification={notification} onClose={handleCloseNotification} />
            </div>
        </Router>
    );
}

export default App;
