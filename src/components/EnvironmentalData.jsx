import React, { useState, useEffect } from 'react';

const EnvironmentalData = () => {
    const [environmentalData, setEnvironmentalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState('all');

    // 더미 환경 데이터
    const mockEnvData = [
        {
            id: 1,
            roomId: 1,
            roomNumber: '101',
            timestamp: '2025-04-11T08:30:00',
            temperature: 23.5,
            humidity: 45,
            status: '정상',
        },
        {
            id: 2,
            roomId: 2,
            roomNumber: '102',
            timestamp: '2025-04-11T08:30:00',
            temperature: 22.1,
            humidity: 42,
            status: '정상',
        },
        {
            id: 3,
            roomId: 3,
            roomNumber: '103',
            timestamp: '2025-04-11T08:30:00',
            temperature: 24.2,
            humidity: 50,
            status: '정상',
        },
        {
            id: 4,
            roomId: 5,
            roomNumber: '201',
            timestamp: '2025-04-11T08:30:00',
            temperature: 22.8,
            humidity: 46,
            status: '정상',
        },
        {
            id: 5,
            roomId: 6,
            roomNumber: '202',
            timestamp: '2025-04-11T08:30:00',
            temperature: 22.5,
            humidity: 44,
            status: '정상',
        },
        {
            id: 6,
            roomId: 7,
            roomNumber: '203',
            timestamp: '2025-04-11T08:30:00',
            temperature: 29.1,
            humidity: 38,
            status: '경고',
        },
        {
            id: 7,
            roomId: 8,
            roomNumber: '204',
            timestamp: '2025-04-11T08:30:00',
            temperature: 23.2,
            humidity: 47,
            status: '정상',
        },
    ];

    // 사용 가능한 병실 목록
    const rooms = [...new Set(mockEnvData.map((item) => item.roomNumber))];

    useEffect(() => {
        // 목업 데이터 로드 시뮬레이션
        const loadEnvironmentalData = () => {
            try {
                setLoading(true);
                setEnvironmentalData(mockEnvData);
            } catch (error) {
                console.error('Error loading environmental data:', error);
                setError('환경 데이터를 로드하는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };

        loadEnvironmentalData();
    }, []);

    const filteredData =
        selectedRoom === 'all'
            ? environmentalData
            : environmentalData.filter((item) => item.roomNumber === selectedRoom);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>환경 데이터 로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <h2>오류 발생</h2>
                <p>{error}</p>
                <button className="btn" onClick={() => window.location.reload()}>
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>환경 데이터</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">현재 환경 상태</h2>
                    <div>
                        <label htmlFor="room-filter" className="form-label">
                            병실 선택:{' '}
                        </label>
                        <select
                            id="room-filter"
                            className="form-select"
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                        >
                            <option value="all">모든 병실</option>
                            {rooms.map((room) => (
                                <option key={room} value={room}>
                                    {room}호
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-content">
                    <div className="env-data-grid">
                        {filteredData.map((item) => (
                            <div key={item.id} className="card env-data-card">
                                <h3 className="card-title">{item.roomNumber}호</h3>
                                <div className="env-data-icon">🌡️</div>
                                <div className="env-data-value">{item.temperature}°C</div>
                                <div className="env-data-unit">온도</div>
                                <div className="env-data-range">적정 범위: 20-26°C</div>

                                <div className="env-data-icon">💧</div>
                                <div className="env-data-value">{item.humidity}%</div>
                                <div className="env-data-unit">습도</div>
                                <div className="env-data-range">적정 범위: 40-60%</div>

                                <div
                                    className={`env-data-status ${
                                        item.status === '경고' ? 'text-danger' : 'text-success'
                                    }`}
                                >
                                    상태: {item.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">환경 데이터 기록</h2>
                </div>
                <div className="card-content">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>병실</th>
                                    <th>시간</th>
                                    <th>온도</th>
                                    <th>습도</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.roomNumber}호</td>
                                        <td>{new Date(item.timestamp).toLocaleString('ko-KR')}</td>
                                        <td>{item.temperature}°C</td>
                                        <td>{item.humidity}%</td>
                                        <td>
                                            <span className={item.status === '경고' ? 'text-danger' : 'text-success'}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalData;
