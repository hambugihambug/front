import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Thermometer, Droplets, Clock, AlertTriangle } from 'lucide-react'; // 아이콘 추가
import '../styles/components/EnvironmentalData.css';

const API_BASE_URL = 'http://localhost:3000';

const EnvironmentalData = () => {
    const [environmentalData, setEnvironmentalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState('all');
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchEnvironmentalData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/environmental`);
                const data = response.data.data || response.data;

                setEnvironmentalData(data);

                // 병실 이름 목록 (roomName 기준)
                const uniqueRooms = [...new Set(data.map((item) => item.roomName))];
                setRooms(uniqueRooms);
                setError(null);
            } catch (err) {
                console.error('환경 데이터 로드 오류:', err);
                setError('환경 데이터를 로드하는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchEnvironmentalData();
        const intervalId = setInterval(fetchEnvironmentalData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const filteredData =
        selectedRoom === 'all' ? environmentalData : environmentalData.filter((item) => item.roomName === selectedRoom);

    const getStatusColor = (status) => {
        return status === '경고' ? '#ffebee' : '#e8f5e9';
    };

    const getTemperatureColor = (temp) => {
        if (temp > 26) return '#ff5252'; // 높은 온도
        if (temp < 20) return '#2979ff'; // 낮은 온도
        return '#4caf50'; // 정상 온도
    };

    const getHumidityColor = (humidity) => {
        if (humidity > 60) return '#2979ff'; // 높은 습도
        if (humidity < 40) return '#ffa000'; // 낮은 습도
        return '#4caf50'; // 정상 습도
    };

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
        <div className="environmental-data-container">
            <h1 className="page-title">환경 모니터링</h1>
            <p className="page-description">병실 온도 및 습도 모니터링 현황</p>

            <div className="filter-container">
                <label htmlFor="room-filter" className="filter-label">
                    병실 선택:
                </label>
                <select
                    id="room-filter"
                    className="filter-select"
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

            <div className="env-cards-container">
                {filteredData.map((item) => (
                    <div
                        key={item.roomId}
                        className="env-card"
                        style={{
                            backgroundColor: getStatusColor(item.status),
                            borderLeft: `4px solid ${item.status === '경고' ? '#f44336' : '#4caf50'}`,
                        }}
                    >
                        <div className="env-card-header">
                            <h2 className="env-card-title">{item.roomName}호</h2>
                            <span className={`env-card-status ${item.status === '경고' ? 'warning' : 'normal'}`}>
                                {item.status === '경고' ? <AlertTriangle size={16} /> : null} {item.status}
                            </span>
                        </div>

                        <div className="env-card-body">
                            <div className="env-metric">
                                <div className="env-metric-icon">
                                    <Thermometer size={24} color={getTemperatureColor(item.temperature)} />
                                </div>
                                <div className="env-metric-details">
                                    <div
                                        className="env-metric-value"
                                        style={{ color: getTemperatureColor(item.temperature) }}
                                    >
                                        {item.temperature}°C
                                    </div>
                                    <div className="env-metric-label">온도</div>
                                    <div className="env-metric-range">적정: 20-26°C</div>
                                </div>
                            </div>

                            <div className="env-metric">
                                <div className="env-metric-icon">
                                    <Droplets size={24} color={getHumidityColor(item.humidity)} />
                                </div>
                                <div className="env-metric-details">
                                    <div
                                        className="env-metric-value"
                                        style={{ color: getHumidityColor(item.humidity) }}
                                    >
                                        {item.humidity}%
                                    </div>
                                    <div className="env-metric-label">습도</div>
                                    <div className="env-metric-range">적정: 40-60%</div>
                                </div>
                            </div>
                        </div>

                        <div className="env-card-footer">
                            <Clock size={14} />
                            <span>최근 업데이트: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="env-history-section">
                <h2 className="section-title">환경 데이터 기록</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>병실</th>
                                <th>온도</th>
                                <th>습도</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={`table-${item.roomId}`}>
                                    <td>{item.roomName}호</td>
                                    <td>{item.temperature}°C</td>
                                    <td>{item.humidity}%</td>
                                    <td>
                                        <span className={item.status === '경고' ? 'warning-text' : 'normal-text'}>
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
    );
};

export default EnvironmentalData;
