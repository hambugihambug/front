import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Thermometer, Droplets, Plus, PenSquare, Users, AlertTriangle, Clock } from 'lucide-react';
import '../styles/components/RoomManagement.css';

const API_BASE_URL = 'http://localhost:3000';

const RoomManagement = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [activeTab, setActiveTab] = useState('상세정보');

    // 통계 데이터 (실제로는 API에서 가져와야 함)
    const [stats] = useState({
        totalBeds: {
            value: '150개',
            description: '전체 병상',
        },
        occupiedBeds: {
            value: '127개',
            description: '사용 중인 병상',
            change: '85%',
        },
        alerts: {
            value: '3건',
            description: '현재 경고',
            change: '+1건',
        },
        temperature: {
            value: '2실',
            description: '온도 주의',
        },
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/rooms`);
            setRooms(response.data);
            setError(null);
        } catch (err) {
            setError('병실 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomDetail = async (roomName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${roomName}`);
            if (response.data.code === 0) {
                setSelectedRoom(response.data.data);
            } else {
                setError('병실 정보를 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('Error fetching room details:', err);
            setError('병실 정보를 불러오는데 실패했습니다.');
        }
    };

    const groupRoomsByFloor = () => {
        const grouped = {};
        rooms.forEach((room) => {
            const floorMatch = room.room_name.match(/^(\d+)/);
            const floor = floorMatch ? floorMatch[1][0] : '1';
            if (!grouped[floor]) {
                grouped[floor] = [];
            }
            grouped[floor].push(room);
        });
        return grouped;
    };

    const getRoomStatus = (room_temp) => {
        if (room_temp >= 28) return '높음';
        if (room_temp >= 26) return '중간';
        return '정상';
    };

    const floorRooms = groupRoomsByFloor();
    const floors = Object.keys(floorRooms).sort();

    // 병실 클릭 핸들러 수정
    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        fetchRoomDetail(room.room_name);
    };

    const handleDetailClick = (roomName) => {
        navigate(`/rooms/${roomName}`);
    };

    if (loading) {
        return <div className="loading-text">병실 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">병실 관리</h1>
            <p className="dashboard-subtitle">병실 정보 및 환자 현황을 관리하세요</p>

            {/* 주요 통계 */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>전체 병상</h3>
                        <p className="stat-value">{stats.totalBeds.value}</p>
                        <p className="stat-description">{stats.totalBeds.description}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>사용 중인 병상</h3>
                        <p className="stat-value">{stats.occupiedBeds.value}</p>
                        <p className="stat-change positive">{stats.occupiedBeds.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>현재 경고</h3>
                        <p className="stat-value">{stats.alerts.value}</p>
                        <p className="stat-change">{stats.alerts.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Thermometer size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>온도 주의</h3>
                        <p className="stat-value">{stats.temperature.value}</p>
                        <p className="stat-description">{stats.temperature.description}</p>
                    </div>
                </div>
            </div>

            <div className="room-management-content">
                <div className="room-list-section">
                    <div className="section-header">
                        <h2>병실 목록</h2>
                        <div className="header-actions">
                            <button className="action-button">
                                <Plus size={16} />
                                <span>병실 추가</span>
                            </button>
                        </div>
                    </div>

                    <div className="floor-tabs">
                        {floors.map((floor) => (
                            <button
                                key={floor}
                                className={`floor-button ${selectedFloor === floor ? 'active' : ''}`}
                                onClick={() => setSelectedFloor(floor)}
                            >
                                {floor}층
                            </button>
                        ))}
                    </div>

                    <div className="room-grid">
                        {floorRooms[selectedFloor]?.map((room) => {
                            const status = getRoomStatus(room.room_temp);
                            return (
                                <div
                                    key={room.room_name}
                                    className={`room-card ${status.toLowerCase()} ${
                                        selectedRoom?.room_name === room.room_name ? 'selected' : ''
                                    }`}
                                    onClick={() => handleRoomClick(room)}
                                >
                                    <div className="room-header">
                                        <h3>{room.room_name}호</h3>
                                        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                                    </div>
                                    <div className="room-info">
                                        <div className="info-row">
                                            <Thermometer size={16} />
                                            <span>온도: {room.room_temp}°C</span>
                                        </div>
                                        <div className="info-row">
                                            <Droplets size={16} />
                                            <span>습도: {room.room_humidity}%</span>
                                        </div>
                                        <div className="info-row">
                                            <Users size={16} />
                                            <span>환자: {room.current_patients || 0}명</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedRoom && (
                    <div className="room-detail-section">
                        <div className="section-header">
                            <h2>{selectedRoom.room_name}호 상세정보</h2>
                            <button className="action-button" onClick={() => handleDetailClick(selectedRoom.room_name)}>
                                <PenSquare size={16} />
                                <span>상세정보</span>
                            </button>
                        </div>

                        <div className="detail-content">
                            <div className="detail-tabs">
                                <button
                                    className={`tab-button ${activeTab === '상세정보' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('상세정보')}
                                >
                                    상세정보
                                </button>
                                <button
                                    className={`tab-button ${activeTab === '환자' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('환자')}
                                >
                                    환자
                                </button>
                            </div>

                            {activeTab === '상세정보' && (
                                <div className="status-cards">
                                    <div className="detail-card">
                                        <h3>온도</h3>
                                        <div className="detail-value">
                                            <Thermometer size={20} />
                                            <span>{selectedRoom.room_temp}°C</span>
                                        </div>
                                        <p className="detail-reference">기준: 26°C</p>
                                    </div>
                                    <div className="detail-card">
                                        <h3>습도</h3>
                                        <div className="detail-value">
                                            <Droplets size={20} />
                                            <span>{selectedRoom.room_humidity}%</span>
                                        </div>
                                        <p className="detail-reference">기준: 60%</p>
                                    </div>
                                    <div className="detail-card">
                                        <h3>상태</h3>
                                        <div
                                            className={`status-indicator ${getRoomStatus(
                                                selectedRoom.room_temp
                                            ).toLowerCase()}`}
                                        >
                                            {getRoomStatus(selectedRoom.room_temp)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === '환자' && (
                                <div className="patient-list">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>이름</th>
                                                <th>나이</th>
                                                <th>낙상 위험도</th>
                                                <th>침대</th>
                                                <th>담당 간호사</th>
                                                <th>상세정보</th>
                                                <th>환자 배정</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>김환자</td>
                                                <td>65</td>
                                                <td>
                                                    <span className="risk-badge high">높음</span>
                                                </td>
                                                <td>1</td>
                                                <td>미배정</td>
                                                <td>
                                                    <button className="link-button">상세정보</button>
                                                </td>
                                                <td>
                                                    <button className="action-button small">배정</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomManagement;
