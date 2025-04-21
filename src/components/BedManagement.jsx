import React, { useState, useEffect } from 'react';

const BedManagement = () => {
    const [beds, setBeds] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBed, setNewBed] = useState({
        name: '',
        roomId: '',
        status: 'available',
        patientId: '',
    });

    // 더미 데이터
    const mockRooms = [
        { id: 1, number: '101', status: 'occupied' },
        { id: 2, number: '102', status: 'available' },
        { id: 3, number: '103', status: 'occupied' },
        { id: 5, number: '201', status: 'occupied' },
        { id: 6, number: '202', status: 'available' },
        { id: 7, number: '203', status: 'alert' },
        { id: 8, number: '204', status: 'occupied' },
    ];

    const mockPatients = [
        { id: 1, name: '김영희', age: 65, gender: '여성', status: '입원중' },
        { id: 2, name: '이철수', age: 72, gender: '남성', status: '입원중' },
        { id: 3, name: '박지민', age: 81, gender: '여성', status: '입원중' },
        { id: 4, name: '정민준', age: 68, gender: '남성', status: '입원중' },
    ];

    const mockBeds = [
        { id: 1, name: '101-A', roomId: 1, roomNumber: '101', status: 'occupied', patientId: 1, patientName: '김영희' },
        { id: 2, name: '101-B', roomId: 1, roomNumber: '101', status: 'available', patientId: null, patientName: null },
        { id: 3, name: '103-A', roomId: 3, roomNumber: '103', status: 'occupied', patientId: 3, patientName: '박지민' },
        { id: 4, name: '201-A', roomId: 5, roomNumber: '201', status: 'occupied', patientId: 2, patientName: '이철수' },
        { id: 5, name: '203-A', roomId: 7, roomNumber: '203', status: 'occupied', patientId: 4, patientName: '정민준' },
    ];

    useEffect(() => {
        // API 호출 대신 목업 데이터 직접 사용
        const loadData = () => {
            try {
                setLoading(true);
                setRooms(mockRooms);
                setPatients(mockPatients);
                setBeds(mockBeds);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('데이터를 로드하는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBed({
            ...newBed,
            [name]: value,
        });
    };

    const handleAddBed = (e) => {
        e.preventDefault();
        const id = beds.length > 0 ? Math.max(...beds.map((b) => b.id)) + 1 : 1;

        // 선택한 병실 번호 가져오기
        const selectedRoom = rooms.find((room) => room.id === parseInt(newBed.roomId));
        const roomNumber = selectedRoom ? selectedRoom.number : '';

        // 선택한 환자 이름 가져오기
        let patientName = null;
        if (newBed.patientId && newBed.status === 'occupied') {
            const selectedPatient = patients.find((patient) => patient.id === parseInt(newBed.patientId));
            patientName = selectedPatient ? selectedPatient.name : null;
        }

        const newBedWithDetails = {
            ...newBed,
            id,
            roomNumber,
            patientName,
            patientId: newBed.patientId ? parseInt(newBed.patientId) : null,
            roomId: parseInt(newBed.roomId),
        };

        setBeds([...beds, newBedWithDetails]);
        setNewBed({
            name: '',
            roomId: '',
            status: 'available',
            patientId: '',
        });
        setShowAddForm(false);
    };

    const getBedStatusClass = (status) => {
        switch (status) {
            case 'occupied':
                return 'status-occupied';
            case 'available':
                return 'status-available';
            case 'maintenance':
                return 'status-maintenance';
            default:
                return '';
        }
    };

    const getBedStatusText = (status) => {
        switch (status) {
            case 'occupied':
                return '사용중';
            case 'available':
                return '사용가능';
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
                <p>병상 정보 로딩 중...</p>
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
            <h1>병상 관리</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">병상 목록</h2>
                    <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? '취소' : '병상 추가'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card-content">
                        <form onSubmit={handleAddBed}>
                            <div className="form-group">
                                <label className="form-label">병상 이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newBed.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="예: 101-A"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">병실</label>
                                <select
                                    name="roomId"
                                    value={newBed.roomId}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">병실 선택</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.number}호
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">상태</label>
                                <select
                                    name="status"
                                    value={newBed.status}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="available">사용가능</option>
                                    <option value="occupied">사용중</option>
                                    <option value="maintenance">유지보수중</option>
                                </select>
                            </div>

                            {newBed.status === 'occupied' && (
                                <div className="form-group">
                                    <label className="form-label">환자</label>
                                    <select
                                        name="patientId"
                                        value={newBed.patientId}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required={newBed.status === 'occupied'}
                                    >
                                        <option value="">환자 선택</option>
                                        {patients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} ({patient.age}세, {patient.gender})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button type="submit" className="btn btn-secondary">
                                추가
                            </button>
                        </form>
                    </div>
                )}

                <div className="card-content">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>병상</th>
                                    <th>병실</th>
                                    <th>상태</th>
                                    <th>환자</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beds.map((bed) => (
                                    <tr key={bed.id}>
                                        <td>{bed.id}</td>
                                        <td>{bed.name}</td>
                                        <td>{bed.roomNumber}호</td>
                                        <td>
                                            <span className={getBedStatusClass(bed.status)}>
                                                {getBedStatusText(bed.status)}
                                            </span>
                                        </td>
                                        <td>{bed.patientName || '-'}</td>
                                        <td>
                                            <button className="btn btn-small">수정</button>
                                            <button className="btn btn-small btn-danger">삭제</button>
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

export default BedManagement;
