import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/components/PatientAdd.css';
import { X, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const initialFormState = {
    patient_name: '',
    patient_birth: '',
    patient_height: '',
    patient_weight: '',
    patient_blood: '',
    patient_img: null,
    patient_memo: '',
    patient_status: '무위험군',
    guardian_id: '',
    bed_id: '',
};

const PatientAdd = () => {
    const navigate = useNavigate();
    const [newPatient, setNewPatient] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPatient((prev) => ({
                    ...prev,
                    patient_img: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            Object.keys(newPatient).forEach((key) => {
                if (key !== 'patient_img' || !newPatient[key]) {
                    formData.append(key, newPatient[key]);
                }
            });

            if (imageFile) {
                formData.append('patient_img', imageFile);
            }

            const response = await axios.post(`${API_BASE_URL}/patients`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.code === 0) {
                alert('환자가 성공적으로 등록되었습니다.');
                navigate('/patients');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('환자 등록에 실패했습니다.');
        }
    };

    return (
        <div className="patient-add-container">
            <div className="patient-add-header">
                <h2>환자 등록</h2>
                <button className="back-button" onClick={() => navigate('/patients')}>
                    <X size={20} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="patient-add-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>이름</label>
                        <input
                            type="text"
                            name="patient_name"
                            value={newPatient.patient_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="patient_birth"
                            value={newPatient.patient_birth}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>신장 (cm)</label>
                        <input
                            type="number"
                            name="patient_height"
                            value={newPatient.patient_height}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>체중 (kg)</label>
                        <input
                            type="number"
                            name="patient_weight"
                            value={newPatient.patient_weight}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>혈액형</label>
                        <select
                            name="patient_blood"
                            value={newPatient.patient_blood}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="A">A형</option>
                            <option value="B">B형</option>
                            <option value="O">O형</option>
                            <option value="AB">AB형</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>보호자 ID</label>
                        <input
                            type="text"
                            name="guardian_id"
                            value={newPatient.guardian_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>침대 ID</label>
                        <input type="text" name="bed_id" value={newPatient.bed_id} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>상태</label>
                        <select name="patient_status" value={newPatient.patient_status} onChange={handleInputChange}>
                            <option value="고위험군">고위험군</option>
                            <option value="저위험군">저위험군</option>
                            <option value="무위험군">무위험군</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>메모</label>
                        <textarea
                            name="patient_memo"
                            value={newPatient.patient_memo || ''}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="환자에 대한 메모를 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label>환자 사진</label>
                        <div className="file-upload-container">
                            {newPatient.patient_img && (
                                <div className="image-preview">
                                    <img src={newPatient.patient_img} alt="미리보기" className="preview-image" />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={() => navigate('/patients')}>
                        취소
                    </button>
                    <button type="submit" className="submit-button">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientAdd;
