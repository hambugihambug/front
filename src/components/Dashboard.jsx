import React, { useState } from 'react';
import '../styles/components/Dashboard.css';
import FallsChart from './dashboard/FallsChart';
import RiskDistributionChart from './dashboard/RiskDistributionChart';

// 목업 데이터
const mockAlerts = [
    {
        id: 1,
        type: 'warning',
        patient: 'Martha Johnson',
        room: '203B',
        time: '2025. 4. 14. 오후 1:02:52',
        status: 'Requires Immediate Attention',
    },
    {
        id: 2,
        type: 'info',
        patient: 'Robert Wilson',
        room: '115A',
        time: '2025. 4. 14. 오후 12:10:52',
        status: 'Being Evaluated',
    },
];

const mockStats = {
    totalPatients: 5,
    highRiskPatients: 2,
    fallsThisMonth: 4,
    averageResponseTime: '23 min',
};

const Dashboard = () => {
    const [alerts] = useState(mockAlerts);
    const [stats] = useState(mockStats);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Fall Detection Dashboard</h1>

            {/* 활성 알림 섹션 */}
            <div className="active-alerts-section">
                <div className="section-header">
                    <h2>Active Alerts</h2>
                    <span className="alert-count">{alerts.length} Active</span>
                </div>
                <div className="alerts-grid">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="alert-card">
                            <div className={`alert-icon ${alert.type}`}>{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</div>
                            <div className="alert-content">
                                <h3>Fall Detected</h3>
                                <p>Patient: {alert.patient}</p>
                                <p>Room: {alert.room}</p>
                                <p>Time: {alert.time}</p>
                                <p className="alert-status">Status: {alert.status}</p>
                                <div className="alert-actions">
                                    <button className="btn-view">View Details</button>
                                    <button className={alert.type === 'warning' ? 'btn-respond' : 'btn-resolve'}>
                                        {alert.type === 'warning' ? 'Respond' : 'Resolve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 통계 개요 섹션 */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Patients</h3>
                        <p className="stat-value">{stats.totalPatients}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <h3>High Risk Patients</h3>
                        <p className="stat-value">{stats.highRiskPatients}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Falls This Month</h3>
                        <p className="stat-value">{stats.fallsThisMonth}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3>Average Response Time</h3>
                        <p className="stat-value">{stats.averageResponseTime}</p>
                    </div>
                </div>
            </div>

            {/* 차트 섹션 */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Falls Over Time</h3>
                    <FallsChart />
                </div>
                <div className="chart-card">
                    <h3>Patient Risk Distribution</h3>
                    <RiskDistributionChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
