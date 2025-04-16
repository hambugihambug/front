import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// 초기 폼 상태
const initialFormState = {
    name: '',
    age: '',
    gender: '남성',
    room: '',
    status: '입원중',
    condition: '안정',
};

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPatient, setNewPatient] = useState(initialFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/patients`);

            if (response.data.code === 0) {
                setPatients(response.data.data); // ✅ 수정: data 배열을 꺼내서 저장
            } else {
                setError('환자 정보를 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 환자 목록 조회
    useEffect(() => {
        fetchPatients();
    }, []);

    // 환자 추가
    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/patients`, newPatient);
            setPatients((prev) => [...prev, response.data]);
            setNewPatient(initialFormState);
            setShowAddForm(false);
        } catch (err) {
            console.error('Error adding patient:', err);
            setError('환자 등록에 실패했습니다.');
        }
    };

    // 환자 삭제
    const handleDeletePatient = async (id) => {
        if (!window.confirm('정말 이 환자를 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/patients/${id}`);
            setPatients((prev) => prev.filter((patient) => patient_id !== id));
        } catch (err) {
            console.error('Error deleting patient:', err);
            setError('환자 삭제에 실패했습니다.');
        }
    };

    // 폼 입력 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h1>환자 관리</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">환자 목록</h2>
                    <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? '취소' : '환자 등록'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card-content">
                        <form onSubmit={handleAddPatient}>
                            <div className="form-group">
                                <label className="form-label">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newPatient.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">나이</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={newPatient.age}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">성별</label>
                                <select
                                    name="gender"
                                    value={newPatient.gender}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="남성">남성</option>
                                    <option value="여성">여성</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">병실</label>
                                <input
                                    type="text"
                                    name="room"
                                    value={newPatient.room}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">상태</label>
                                <select
                                    name="status"
                                    value={newPatient.status}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="입원중">입원중</option>
                                    <option value="퇴원">퇴원</option>
                                    <option value="외출">외출</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">상태</label>
                                <select
                                    name="condition"
                                    value={newPatient.condition}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="안정">안정</option>
                                    <option value="주의요망">주의요망</option>
                                    <option value="위험">위험</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-secondary">
                                등록
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
                                    <th>이름</th>
                                    <th>나이</th>
                                    <th>성별</th>
                                    <th>병실</th>
                                    <th>상태</th>
                                    <th>건강상태</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.patient_id}>
                                        <td>{patient.patient_id}</td>
                                        <td>{patient.patient_name}</td>
                                        <td>{patient.patient_age}</td>
                                        <td>{patient.patient_gender}</td>
                                        <td>{patient.patient_room}</td>
                                        <td>{patient.patient_status}</td>
                                        <td>{patient.patient_condition}</td>
                                        <td>
                                            <button className="btn btn-small" onClick={() => alert('환자 상세 정보')}>
                                                상세
                                            </button>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => handleDeletePatient(patient.patient_id)}
                                            >
                                                삭제
                                            </button>
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

export default PatientManagement;
