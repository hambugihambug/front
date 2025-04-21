import React, { useState } from 'react';
import '../styles/components/Dashboard.css';

const Dashboard = () => {
    // 실시간 모니터링 데이터
    const [stats] = useState({
        totalPatients: {
            value: '127명',
            description: '병상 점유율 85%',
        },
        currentAlerts: {
            value: '3건',
            change: '+1건',
            description: '전일 대비',
        },
        responseTime: {
            value: '2분 34초',
            change: '-28%',
            description: '목표 시간',
        },
        environmentalAlerts: {
            value: '2건',
            description: '온도 초과',
        },
    });

    // 병실 상태 데이터
    const [rooms] = useState([
        {
            number: '101호',
            status: '정상',
            patients: 3,
            temperature: '24.5°C',
            humidity: '45%',
            manager: '김간호',
        },
        {
            number: '102호',
            status: '경고',
            patients: 4,
            temperature: '22.0°C',
            humidity: '50%',
            manager: '박간호',
            alert: '3번 병상 낙상 감지 (2분 전)',
        },
        {
            number: '103호',
            status: '정상',
            patients: 2,
            temperature: '23.5°C',
            humidity: '48%',
            manager: '이간호',
        },
        {
            number: '104호',
            status: '주의',
            patients: 3,
            temperature: '25.5°C',
            humidity: '52%',
            manager: '최간호',
        },
    ]);

    // 최근 이벤트 데이터
    const [recentEvents] = useState([
        {
            type: '낙상 감지',
            location: '102호 3번 병상 (응급호출)',
            time: '24분 전',
        },
        {
            type: '온도 경고',
            location: '104호 (27.5°C, 임계값: 26°C)',
            time: '2시간 전',
        },
        {
            type: '낙상 감지',
            location: '105호 2번 병상 (검출중)',
            time: '5시간 전',
        },
    ]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">스마트 케어 대시보드</h1>
            <p className="dashboard-subtitle">실시간 병원 모니터링 현황 및 정보를 확인하세요</p>

            {/* 응급 상황 알림 */}
            <div className="alert-banner">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">102실 3번 병상에서 낙상 사고가 감지되었습니다.</span>
                <button className="alert-action">즉시 확인</button>
            </div>

            {/* 주요 지표 */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>전체 환자</h3>
                        <p className="stat-value">{stats.totalPatients.value}</p>
                        <p className="stat-description">{stats.totalPatients.description}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <h3>오늘 낙상 감지</h3>
                        <p className="stat-value">{stats.currentAlerts.value}</p>
                        <p className="stat-change">{stats.currentAlerts.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3>평균 대응 시간</h3>
                        <p className="stat-value">{stats.responseTime.value}</p>
                        <p className="stat-change">{stats.responseTime.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-content">
                        <h3>환경 알림</h3>
                        <p className="stat-value">{stats.environmentalAlerts.value}</p>
                        <p className="stat-description">{stats.environmentalAlerts.description}</p>
                    </div>
                </div>
            </div>

            {/* 실시간 병실 모니터링 */}
            <div className="monitoring-section">
                <h2>실시간 병실 모니터링</h2>
                <div className="room-grid">
                    {rooms.map((room) => (
                        <div key={room.number} className={`room-card ${room.status.toLowerCase()}`}>
                            <div className="room-header">
                                <h3>{room.number}</h3>
                                <span className={`status-badge ${room.status.toLowerCase()}`}>{room.status}</span>
                            </div>
                            <div className="room-info">
                                <p>환자: {room.patients}명</p>
                                <p>온도: {room.temperature}</p>
                                <p>습도: {room.humidity}</p>
                                <p>담당: {room.manager}</p>
                            </div>
                            {room.alert && <div className="room-alert">{room.alert}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* 최근 이벤트 */}
            <div className="events-section">
                <h2>최근 이벤트</h2>
                <div className="events-list">
                    {recentEvents.map((event, index) => (
                        <div key={index} className="event-item">
                            <div className="event-type">{event.type}</div>
                            <div className="event-details">
                                <p>{event.location}</p>
                                <p className="event-time">{event.time}</p>
                            </div>
                            <button className="event-action">상세 보기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
