import React, { useState, useEffect } from 'react';
// import { messaging, getToken, onMessage, saveTokenToServer } from './firebase';
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

function App() {
    const [isLoading, setIsLoading] = useState(true);

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
                        const { title, body } = payload.notification || {};
                        if (title && body) {
                            alert(`🔔 ${title}\n${body}`);
                        }
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
            </div>
        </Router>
    );
}

export default App;
