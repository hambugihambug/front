import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const initialFormState = {
    patient_name: '',
    patient_age: '',
    patient_height: '',
    patient_weight: '',
    patient_blood: '',
    guardian_id: '',
    bed_id: '',
    patientCrte_id: '',
    patientCrte_dt: '',
    patientUpte_id: '',
    patientUpte_dt: '',
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
                setPatients(response.data.data);
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

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddPatient = async (e) => {
        e.preventDefault();

        const processedPatient = {
            ...newPatient,
            guardian_id: newPatient.guardian_id === '' ? null : newPatient.guardian_id,
            bed_id: newPatient.bed_id === '' ? null : newPatient.bed_id,
            patientCrte_id: newPatient.patientCrte_id || null,
            patientCrte_dt: newPatient.patientCrte_dt || null,
            patientUpte_id: newPatient.patientUpte_id || null,
            patientUpte_dt: newPatient.patientUpte_dt || null,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/patients`, processedPatient);
            setPatients((prev) => [...prev, response.data]);
            setNewPatient(initialFormState);
            setShowAddForm(false);
        } catch (err) {
            console.error('Error adding patient:', err);
            setError('환자 등록에 실패했습니다.');
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm('정말 이 환자를 삭제하시겠습니까?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/patients/${id}`);
            setPatients((prev) => prev.filter((patient) => patient.patient_id !== id));
        } catch (err) {
            console.error('Error deleting patient:', err);
            setError('환자 삭제에 실패했습니다.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">환자 관리</h1>

            <div className="card border p-4 rounded shadow">
                <div className="card-header flex justify-between items-center mb-4">
                    <h2 className="card-title text-xl font-semibold">환자 목록</h2>
                    <button
                        className="btn bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? '취소' : '환자 등록'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card-content mb-4">
                        <form onSubmit={handleAddPatient} className="grid grid-cols-2 gap-4">
                            <input
                                className="form-input border p-2"
                                name="patient_name"
                                value={newPatient.patient_name}
                                onChange={handleInputChange}
                                placeholder="이름"
                                required
                            />
                            <input
                                className="form-input border p-2"
                                name="patient_age"
                                type="number"
                                value={newPatient.patient_age}
                                onChange={handleInputChange}
                                placeholder="나이"
                                required
                            />
                            <input
                                className="form-input border p-2"
                                name="patient_height"
                                type="number"
                                value={newPatient.patient_height}
                                onChange={handleInputChange}
                                placeholder="키"
                                required
                            />
                            <input
                                className="form-input border p-2"
                                name="patient_weight"
                                type="number"
                                value={newPatient.patient_weight}
                                onChange={handleInputChange}
                                placeholder="몸무게"
                                required
                            />
                            <select
                                className="form-select border p-2"
                                name="patient_blood"
                                value={newPatient.patient_blood}
                                onChange={handleInputChange}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="O">O</option>
                                <option value="AB">AB</option>
                            </select>
                            <input
                                className="form-input border p-2"
                                name="guardian_id"
                                type="number"
                                value={newPatient.guardian_id}
                                onChange={handleInputChange}
                                placeholder="보호자 ID"
                            />
                            <input
                                className="form-input border p-2"
                                name="bed_id"
                                type="number"
                                value={newPatient.bed_id}
                                onChange={handleInputChange}
                                placeholder="침대 ID"
                            />
                            <button type="submit" className="btn bg-green-500 text-white px-4 py-2 rounded col-span-2">
                                등록
                            </button>
                        </form>
                    </div>
                )}

                <div className="card-content">
                    <div className="overflow-x-auto">
                        <table className="data-table w-full border text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">이름</th>
                                    <th className="p-2 border">나이</th>
                                    <th className="p-2 border">키</th>
                                    <th className="p-2 border">몸무게</th>
                                    <th className="p-2 border">혈액형</th>
                                    <th className="p-2 border">보호자</th>
                                    <th className="p-2 border">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.patient_id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{patient.patient_id}</td>
                                        <td className="p-2 border">{patient.patient_name}</td>
                                        <td className="p-2 border">{patient.patient_age}</td>
                                        <td className="p-2 border">{patient.patient_height}</td>
                                        <td className="p-2 border">{patient.patient_weight}</td>
                                        <td className="p-2 border">{patient.patient_blood}</td>
                                        <td className="p-2 border">{patient.guardian_id}</td>
                                        <td className="p-2 border">
                                            <button
                                                className="btn btn-sm bg-blue-400 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => alert('상세보기')}
                                            >
                                                상세
                                            </button>
                                            <button
                                                className="btn btn-sm bg-red-500 text-white px-2 py-1 rounded"
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
