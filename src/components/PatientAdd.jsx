import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/components/PatientAdd.css';
import { X, User, ArrowLeft } from 'lucide-react';

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
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
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
        <div className="patient-detail-container">
            <div className="detail-header">
                <button className="back-button" onClick={() => navigate('/patients')}>
                    <ArrowLeft size={16} />
                    돌아가기
                </button>
                <h1>환자 등록</h1>
                <div className="header-buttons">
                    <button className="cancel-button" onClick={() => navigate('/patients')}>
                        <X size={16} />
                        취소
                    </button>
                    <button className="submit-button" onClick={handleSubmit}>
                        등록
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="medical-record">
                <div className="left-panel">
                    <div className="patient-basic-info">
                        <h3>기본 정보</h3>
                        <div className="info-row">
                            <span>이름</span>
                            <input
                                type="text"
                                name="patient_name"
                                value={newPatient.patient_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="info-row">
                            <span>생년월일</span>
                            <input
                                type="date"
                                name="patient_birth"
                                value={newPatient.patient_birth}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="info-row">
                            <span>혈액형</span>
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
                    </div>

                    <div className="vital-signs">
                        <h3>신체 정보</h3>
                        <div className="info-row">
                            <span>키</span>
                            <input
                                type="number"
                                name="patient_height"
                                value={newPatient.patient_height}
                                onChange={handleInputChange}
                                required
                                placeholder="cm"
                            />
                        </div>
                        <div className="info-row">
                            <span>체중</span>
                            <input
                                type="number"
                                name="patient_weight"
                                value={newPatient.patient_weight}
                                onChange={handleInputChange}
                                required
                                placeholder="kg"
                            />
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="hospital-info">
                        <h3>입원 정보</h3>
                        <div className="info-row">
                            <span>침대 번호</span>
                            <input
                                type="text"
                                name="bed_id"
                                value={newPatient.bed_id}
                                onChange={handleInputChange}
                                placeholder="침대 번호 입력"
                            />
                        </div>
                        <div className="info-row">
                            <span>위험도</span>
                            <select
                                name="patient_status"
                                value={newPatient.patient_status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="무위험군">무위험군</option>
                                <option value="저위험군">저위험군</option>
                                <option value="고위험군">고위험군</option>
                            </select>
                        </div>
                        <div className="info-row">
                            <span>보호자 ID</span>
                            <input
                                type="text"
                                name="guardian_id"
                                value={newPatient.guardian_id}
                                onChange={handleInputChange}
                                placeholder="보호자 ID 입력"
                            />
                        </div>
                    </div>

                    <div className="memo-info">
                        <h3>메모</h3>
                        <textarea
                            name="patient_memo"
                            value={newPatient.patient_memo}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="환자에 대한 메모를 입력하세요"
                        />
                    </div>

                    <div className="profile-section">
                        <div className="profile-image-large">
                            {imagePreview ? (
                                <img src={imagePreview} alt="프로필 미리보기" className="profile-image" />
                            ) : (
                                <div className="profile-placeholder large">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h3>새 환자</h3>
                            <p>환자 정보를 입력해주세요</p>
                            <label className="profile-upload-button">
                                사진 업로드
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="profile-input"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PatientAdd;
