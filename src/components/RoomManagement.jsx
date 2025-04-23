import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Thermometer, Droplets, PenSquare, Users, AlertTriangle, Clock, X, User } from 'lucide-react';
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
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
    const [stats, setStats] = useState({
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
            if (response.data.code === 0) {
                const roomsData = response.data.data.map((room) => ({
                    ...room,
                    room_humidity: room.room_humi, // room_humi를 room_humidity로 매핑
                    current_patients: parseInt(room.occupied_beds) || 0,
                }));
                setRooms(roomsData);

                // 통계 업데이트
                const totalBeds = roomsData.reduce((sum, room) => sum + room.total_beds, 0);
                const occupiedBeds = roomsData.reduce((sum, room) => sum + room.occupied_beds, 0);
                const warningRooms = roomsData.filter((room) => room.room_temp > 26 || room.room_temp < 20).length;

                setStats({
                    totalBeds: {
                        value: `${totalBeds}개`,
                        description: '전체 병상',
                    },
                    occupiedBeds: {
                        value: `${occupiedBeds}개`,
                        description: '사용 중인 병상',
                        change: `${((occupiedBeds / totalBeds) * 100).toFixed(1)}%`,
                    },
                    alerts: {
                        value: `${warningRooms}실`,
                        description: '현재 경고',
                        change: warningRooms > 0 ? `+${warningRooms}건` : '0건',
                    },
                    temperature: {
                        value: `${warningRooms}실`,
                        description: '온도 주의',
                    },
                });
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setError('병실 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomDetail = async (roomName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${roomName}`);
            if (response.data.code === 0) {
                const roomData = response.data.data;
                // 이미 백엔드에서 JSON 파싱이 완료된 데이터가 옴
                setSelectedRoom({
                    ...roomData,
                    patients: roomData.patients || [],
                });
            }
        } catch (err) {
            console.error('Error fetching room details:', err);
            setError('병실 정보를 불러오는데 실패했습니다.');
        }
    };

    const fetchPatientDetail = async (patientId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`);
            if (response.data.code === 0) {
                // 환자 정보에 추가 정보 요청
                const patientData = response.data.data;

                // 필요한 추가 정보가 없으면 API에서 가져오기
                if (!patientData.patient_height || !patientData.patient_weight || !patientData.patient_status) {
                    try {
                        const detailResponse = await axios.get(`${API_BASE_URL}/patients/${patientId}/detail`);
                        if (detailResponse.data.code === 0) {
                            setSelectedPatient({
                                ...patientData,
                                ...detailResponse.data.data,
                            });
                        } else {
                            setSelectedPatient(patientData);
                        }
                    } catch (error) {
                        console.error('환자 상세 정보 조회 실패:', error);
                        setSelectedPatient(patientData);
                    }
                } else {
                    setSelectedPatient(patientData);
                }

                setShowPatientDetailModal(true);
            }
        } catch (error) {
            console.error('환자 정보 조회 실패:', error);
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

    // 핸들러 함수 추가
    const handlePatientAssignment = async (patientId) => {
        try {
            // TODO: 환자 재배정 로직 구현
            console.log('Patient assignment:', patientId);
        } catch (err) {
            console.error('Error assigning patient:', err);
        }
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
                                            <span>습도: {room.room_humi}%</span> {/* room_humidity → room_humi */}
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
                                            <span>{selectedRoom.room_humi}%</span>
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
                                                <th>병상</th>
                                                <th>생년월일</th>
                                                <th>혈액형</th>
                                                <th>상세정보</th>
                                                <th>환자 배정</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRoom.patients && selectedRoom.patients.length > 0 ? (
                                                selectedRoom.patients.map((patient) => (
                                                    <tr key={patient.patient_id}>
                                                        <td>{patient.patient_name}</td>
                                                        <td>{patient.bed_num}</td>
                                                        <td>
                                                            {patient.patient_birth
                                                                ? new Date(patient.patient_birth).toLocaleDateString()
                                                                : '-'}
                                                        </td>
                                                        <td>{patient.patient_blood || '-'}</td>
                                                        <td>
                                                            <button
                                                                className="link-button"
                                                                onClick={() => fetchPatientDetail(patient.patient_id)}
                                                            >
                                                                상세정보
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="action-button small"
                                                                onClick={() =>
                                                                    handlePatientAssignment(patient.patient_id)
                                                                }
                                                            >
                                                                재배정
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="empty-message">
                                                        배정된 환자가 없습니다.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 환자 상세정보 모달 */}
            {showPatientDetailModal && selectedPatient && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>환자 상세정보</h2>
                            <button className="close-button" onClick={() => setShowPatientDetailModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="patient-detail-content">
                            <div className="profile-section">
                                <div className="profile-image-large">
                                    {selectedPatient.patient_img ? (
                                        <img
                                            src={selectedPatient.patient_img}
                                            alt={`${selectedPatient.patient_name}의 프로필`}
                                            className="profile-image"
                                        />
                                    ) : (
                                        <div className="profile-placeholder large">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="profile-info">
                                    <h3>{selectedPatient.patient_name}</h3>
                                    <p>환자 ID: {selectedPatient.patient_id}</p>
                                </div>
                            </div>
                            <div className="patient-details">
                                <div className="detail-row">
                                    <span className="detail-label">이름:</span>
                                    <span className="detail-value">{selectedPatient.patient_name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">생년월일:</span>
                                    <span className="detail-value">
                                        {selectedPatient.patient_birth
                                            ? new Date(selectedPatient.patient_birth).toLocaleDateString()
                                            : '-'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">키:</span>
                                    <span className="detail-value">
                                        {selectedPatient.patient_height ? `${selectedPatient.patient_height}cm` : '-'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">몸무게:</span>
                                    <span className="detail-value">
                                        {selectedPatient.patient_weight ? `${selectedPatient.patient_weight}kg` : '-'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">혈액형:</span>
                                    <span className="detail-value">
                                        {selectedPatient.patient_blood ? `${selectedPatient.patient_blood}형` : '-'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">침대 번호:</span>
                                    <span className="detail-value">{selectedPatient.bed_id || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">상태:</span>
                                    <span className="detail-value">
                                        {selectedPatient.patient_status === 'active'
                                            ? '입원중'
                                            : selectedPatient.patient_status === 'discharged'
                                            ? '퇴원'
                                            : selectedPatient.patient_status === 'deceased'
                                            ? '사망'
                                            : '-'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">보호자 ID:</span>
                                    <span className="detail-value">{selectedPatient.guardian_id || '-'}</span>
                                </div>
                            </div>
                            {selectedPatient.patient_memo && (
                                <div className="patient-memo">
                                    <h4>메모</h4>
                                    <p>{selectedPatient.patient_memo}</p>
                                </div>
                            )}
                            {selectedPatient.patient_medic && (
                                <div className="patient-memo medication">
                                    <h4>투약 정보</h4>
                                    <p>{selectedPatient.patient_medic}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="submit-button" onClick={() => setShowPatientDetailModal(false)}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;
