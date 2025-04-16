import React, { useState, useEffect } from 'react';

// 목업 데이터 추가
const mockRooms = [
    {
        id: 1,
        number: '101',
        type: '일반실',
        capacity: 2,
        status: 'occupied',
        patient: '김영희',
        temperature: 23.5,
        humidity: 45,
    },
    {
        id: 2,
        number: '102',
        type: '일반실',
        capacity: 2,
        status: 'available',
        patient: null,
        temperature: 22.1,
        humidity: 42,
    },
    {
        id: 3,
        number: '103',
        type: '중환자실',
        capacity: 1,
        status: 'occupied',
        patient: '박지민',
        temperature: 24.2,
        humidity: 50,
    },
    // ... 기존 목업 데이터 유지
];

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newRoom, setNewRoom] = useState({
        number: '',
        type: '일반실',
        capacity: 2,
        status: 'available',
    });

    useEffect(() => {
        const loadRooms = () => {
            try {
                setLoading(true);
                setRooms(mockRooms);
            } catch (error) {
                console.error('Error loading rooms:', error);
                setError('병실 목록을 로드하는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom({
            ...newRoom,
            [name]: value,
        });
    };

    const handleAddRoom = (e) => {
        e.preventDefault();
        const id = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
        const newRoomWithDefaults = {
            ...newRoom,
            id,
            temperature: null,
            humidity: null,
            patient: null,
        };

        setRooms([...rooms, newRoomWithDefaults]);
        setNewRoom({
            number: '',
            type: '일반실',
            capacity: 2,
            status: 'available',
        });
        setShowAddForm(false);
    };

    const getRoomStatusClass = (status) => {
        switch (status) {
            case 'occupied':
                return 'room-occupied';
            case 'available':
                return 'room-available';
            case 'alert':
                return 'room-alert';
            case 'maintenance':
                return 'room-maintenance';
            default:
                return '';
        }
    };

    const getRoomStatusText = (status) => {
        switch (status) {
            case 'occupied':
                return '사용중';
            case 'available':
                return '사용가능';
            case 'alert':
                return '알림발생';
            case 'maintenance':
                return '유지보수중';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>병실 정보 로딩 중...</p>
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
            <h1>병실 관리</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">병실 상태</h2>
                    <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? '취소' : '병실 추가'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card-content">
                        <form onSubmit={handleAddRoom}>
                            <div className="form-group">
                                <label className="form-label">병실 번호</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={newRoom.number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">병실 유형</label>
                                <select
                                    name="type"
                                    value={newRoom.type}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="일반실">일반실</option>
                                    <option value="중환자실">중환자실</option>
                                    <option value="격리실">격리실</option>
                                    <option value="VIP실">VIP실</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">수용 인원</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={newRoom.capacity}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="1"
                                    max="6"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">상태</label>
                                <select
                                    name="status"
                                    value={newRoom.status}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="available">사용가능</option>
                                    <option value="maintenance">유지보수중</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-secondary">
                                추가
                            </button>
                        </form>
                    </div>
                )}

                <div className="card-content">
                    <div className="room-status-grid">
                        {rooms.map((room) => (
                            <div key={room.id} className={`room-status-card ${getRoomStatusClass(room.status)}`}>
                                <div className="room-status-badge">{getRoomStatusText(room.status)}</div>
                                <div className="room-number">{room.number}호</div>
                                <div className="room-details">
                                    {room.patient ? `환자: ${room.patient}` : '비어있음'}
                                    {room.temperature && room.humidity ? (
                                        <div>
                                            온도: {room.temperature}°C | 습도: {room.humidity}%
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomManagement;
