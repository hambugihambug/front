import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import RoomManagement from './components/RoomManagement';
import BedManagement from './components/BedManagement';
import FallIncidents from './components/FallIncidents';
import EnvironmentalData from './components/EnvironmentalData';
import Notifications from './components/Notifications';
import './styles/main.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 로딩 시뮬레이션 유지
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>병원 모니터링 시스템 로딩 중...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/patients" element={<PatientManagement />} />
                        <Route path="/rooms" element={<RoomManagement />} />
                        <Route path="/beds" element={<BedManagement />} />
                        <Route path="/fall-incidents" element={<FallIncidents />} />
                        <Route path="/environmental" element={<EnvironmentalData />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
