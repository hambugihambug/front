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
import RoomDetail from './components/RoomDetail';
import Schedule from './components/Schedule';
import Home from './components/Home';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
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
