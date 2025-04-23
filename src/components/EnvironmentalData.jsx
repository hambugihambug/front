import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Thermometer, Droplets, Clock, AlertTriangle, CheckCircle, Bed } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/components/EnvironmentalData.css';

const API_BASE_URL = 'http://localhost:3000';

const EnvironmentalData = () => {
    const [roomsData, setRoomsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [floors, setFloors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [metric, setMetric] = useState('temperature');
    const [historyData, setHistoryData] = useState([]);

    // 전체 병실 데이터 조회
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/environmental`);
                const data = res.data.data.map((room) => ({
                    roomId: room.room_id,
                    roomName: room.room_name,
                    temperature: room.room_temp,
                    humidity: room.humidity,
                    totalBeds: room.total_beds,
                    occupiedBeds: room.occupied_beds,
                    status: room.status,
                }));

                setRoomsData(data);

                // roomName 기반으로 층수 계산
                const floorNums = data.map((item) => {
                    const num = parseInt(item.roomName.replace(/[^0-9]/g, ''), 10);
                    return Math.floor(num / 100);
                });
                const maxFloor = Math.max(...floorNums);
                setFloors(Array.from({ length: maxFloor }, (_, i) => (i + 1).toString()));

                // Set initial selected room ID based on the default floor ('1')
                if (data.length > 0 && !selectedRoomId) {
                    // Check if selectedRoomId is null
                    const firstFloorRooms = data.filter((room) => {
                        const num = parseInt(room.roomName.replace(/[^0-9]/g, ''), 10);
                        return !isNaN(num) && Math.floor(num / 100).toString() === '1'; // Default to floor '1'
                    });
                    if (firstFloorRooms.length > 0) {
                        setSelectedRoomId(firstFloorRooms[0].roomId);
                    } else if (data.length > 0) {
                        // Fallback: select the very first room if floor 1 has no rooms
                        setSelectedRoomId(data[0].roomId);
                    }
                }
                setError(null);
            } catch (err) {
                console.error(err);
                setError('환경 데이터를 불러오는 중 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
        // 1분마다 데이터 갱신
        const interval = setInterval(fetchRooms, 60000);
        return () => clearInterval(interval);
    }, []);

    // 선택 병실 상세 정보 조회
    useEffect(() => {
        if (!selectedRoomId) return;

        const fetchRoomDetail = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/environmental/${selectedRoomId}`);
                const roomDetail = res.data.data;

                // 선택된 병실 정보 업데이트
                setRoomsData((prev) =>
                    prev.map((room) =>
                        room.roomId === selectedRoomId
                            ? {
                                  ...room,
                                  roomCapacity: roomDetail.room_capacity,
                                  patients: roomDetail.patients,
                              }
                            : room
                    )
                );
            } catch (err) {
                console.error('Error fetching room detail:', err);
            }
        };

        fetchRoomDetail();
    }, [selectedRoomId]);

    // 선택 병실 24시간 이력 조회
    useEffect(() => {
        if (!selectedRoomId) return;
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/environmental/${selectedRoomId}/history`);
                setHistoryData(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, [selectedRoomId]);

    // 선택된 층 또는 상태(roomName 기반 또는 status 기반)만 필터링
    const filteredRooms = useMemo(() => {
        if (!roomsData || roomsData.length === 0) return []; // 데이터 없으면 빈 배열

        if (selectedFloor === 'all') {
            return roomsData; // 모든 층
        }

        if (selectedFloor === 'warning') {
            // '경고' 상태인 병실만 필터링
            return roomsData.filter((item) => item.status === '경고');
        }

        // 특정 층 필터링 (기존 로직)
        return roomsData.filter((item) => {
            const num = parseInt(item.roomName.replace(/[^0-9]/g, ''), 10);
            if (isNaN(num)) return false;
            return Math.floor(num / 100).toString() === selectedFloor;
        });
    }, [roomsData, selectedFloor]);

    if (loading) return <div className="loading-container">로딩 중...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const selectedRoom = roomsData.find((r) => r.roomId === selectedRoomId);
    if (!selectedRoom && roomsData.length > 0) {
        // Attempt to select the first room of the filtered list if available
        if (filteredRooms.length > 0 && !selectedRoomId) {
            setSelectedRoomId(filteredRooms[0].roomId);
            // This state update will trigger a re-render, so maybe return loading or placeholder?
            return <div className="loading-container">병실 정보 로딩 중...</div>;
        }
        // If still no selected room (e.g., filter result is empty), show message
        else if (!selectedRoomId) {
            return (
                <div className="main-detail">
                    <div className="error-message">사이드바에서 병실을 선택하세요.</div>
                </div>
            );
        }
        // If selectedRoomId exists but room not found (edge case), show error
        else {
            return (
                <div className="main-detail">
                    <div className="error-message">선택된 병실 정보를 찾을 수 없습니다.</div>
                </div>
            );
        }
    }
    // Handle case where roomsData is initially empty or fetch failed silently
    else if (!selectedRoom && roomsData.length === 0 && !loading) {
        return (
            <div className="main-detail">
                <div className="error-message">표시할 병실 데이터가 없습니다.</div>
            </div>
        );
    }
    // Add a check for selectedRoom again after potential update or if initial was null
    else if (!selectedRoom) {
        // It might still be loading the details for the first selected room
        return <div className="loading-container">병실 상세 정보 로딩 중...</div>;
    }

    const currentValue = selectedRoom[metric];
    const statusColor = selectedRoom.status === '경고' ? 'warning' : 'normal';
    // 레벨바 범위
    const range = metric === 'temperature' ? { min: 18, max: 32 } : { min: 20, max: 80 };
    const widthPercent = ((currentValue - range.min) / (range.max - range.min)) * 100;

    return (
        <div className="environmental-data-page">
            <h1 className="page-title">환경 모니터링</h1>
            <p className="page-description">병실 환경 상태를 모니터링하고 관리합니다.</p>

            <div className="environmental-data-container">
                <div className="sidebar">
                    <h2 className="sidebar-title">모니터링 병실</h2>
                    <div className="filter-floor">
                        <label htmlFor="floor-select">층 선택:</label>
                        <select
                            id="floor-select"
                            value={selectedFloor}
                            onChange={(e) => setSelectedFloor(e.target.value)}
                            className="floor-select"
                        >
                            <option value="all">모든 층</option>
                            <option value="warning">경고</option>
                            {floors.map((floor) => (
                                <option key={floor} value={floor}>
                                    {floor}층
                                </option>
                            ))}
                        </select>
                    </div>
                    <ul className="room-list">
                        {filteredRooms.length === 0 ? (
                            <li className="room-list-placeholder">
                                {selectedFloor === 'all'
                                    ? '표시할 병실이 없습니다.'
                                    : selectedFloor === 'warning'
                                    ? '경고 상태인 병실이 없습니다.'
                                    : `${selectedFloor}층에 병실이 없습니다.`}
                            </li>
                        ) : (
                            filteredRooms.map((item) => (
                                <li
                                    key={item.roomId}
                                    className={`room-item ${item.roomId === selectedRoomId ? 'active' : ''}`}
                                    onClick={() => setSelectedRoomId(item.roomId)}
                                >
                                    <div className="room-item-header">
                                        <span
                                            className={`status-dot ${
                                                item.status === '경고' ? 'warning-dot' : 'normal-dot'
                                            }`}
                                        />
                                        <span className="room-name">{item.roomName}호</span>
                                    </div>
                                    <div className="room-item-details-group">
                                        <div className="room-item-metrics">
                                            <div className="room-metric">
                                                <Thermometer size={14} className="metric-icon" />
                                                <span className="metric-value">{item.temperature}°C</span>
                                            </div>
                                            <div className="room-metric">
                                                <Droplets size={14} className="metric-icon" />
                                                <span className="metric-value">{item.humidity}%</span>
                                            </div>
                                        </div>
                                        <div className="room-occupancy">
                                            <Bed size={14} className="metric-icon" />
                                            <span className="metric-value">
                                                {item.occupiedBeds}/{item.totalBeds}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="main-detail">
                    <div className="detail-header">
                        <h1 className="detail-title">{selectedRoom.roomName}호 환경 상태</h1>
                        <div className="toggle-input-group">
                            <div
                                className={`toggle-input ${metric === 'temperature' ? 'active' : ''}`}
                                onClick={() => setMetric('temperature')}
                            >
                                온도
                            </div>
                            <div
                                className={`toggle-input ${metric === 'humidity' ? 'active' : ''}`}
                                onClick={() => setMetric('humidity')}
                            >
                                습도
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="current-info">
                            <h3 className="stats-label">현재 {metric === 'temperature' ? '온도' : '습도'}</h3>
                            <div className="current-display">
                                {metric === 'temperature' ? (
                                    <Thermometer
                                        size={36}
                                        color={currentValue > 26 || currentValue < 20 ? '#f44336' : '#4caf50'}
                                    />
                                ) : (
                                    <Droplets
                                        size={36}
                                        color={currentValue > 60 || currentValue < 40 ? '#f44336' : '#4caf50'}
                                    />
                                )}
                                <span className="current-text">
                                    {currentValue}
                                    {metric === 'temperature' ? '°C' : '%'}
                                </span>
                            </div>
                            <div className="stats-subdesc">
                                적정 {metric === 'temperature' ? '온도' : '습도'}:{' '}
                                {metric === 'temperature' ? '22.0°C ~ 26.0°C' : '40.0% ~ 60.0%'}
                            </div>
                        </div>
                        <div className="range-info">
                            <h3 className="stats-label">{metric === 'temperature' ? '온도 수준' : '습도 수준'}</h3>
                            <div className="progress-wrapper">
                                <div className="level-bar">
                                    <div
                                        className="level-fill"
                                        style={{ width: `${widthPercent}%`, backgroundColor: 'rgb(25,72,144)' }}
                                    />
                                </div>
                                <div className="level-labels">
                                    <span>
                                        {range.min}
                                        {metric === 'temperature' ? '°C' : '%'}
                                    </span>
                                    <span>{metric === 'temperature' ? '25°C' : '50%'}</span>
                                    <span>
                                        {range.max}
                                        {metric === 'temperature' ? '°C' : '%'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`status-box ${statusColor}`}>
                        {statusColor === 'normal' ? (
                            <CheckCircle size={16} className="status-box-icon" />
                        ) : (
                            <AlertTriangle size={16} className="status-box-icon" />
                        )}
                        <span className="status-text">
                            {statusColor === 'normal' ? '정상 상태' : '경고 상태'} –{' '}
                            {statusColor === 'normal'
                                ? '모든 환경 지표가 정상 범위 내에 있습니다.'
                                : '모든 환경 지표가 비정상 범위 내에 있습니다.'}
                        </span>
                    </div>

                    {/* Add CCTV Monitoring Section */}
                    <div className="cctv-monitoring-section">
                        <div className="cctv-placeholder">
                            {/* Placeholder for CCTV feed */}
                            <span>CCTV 화면 영역</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalData;
