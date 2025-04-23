import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ArrowLeft } from 'lucide-react';
import '../styles/components/PatientDetail.css'; // CSS 파일 경로를 맞춰주세요

const API_BASE_URL = 'http://localhost:3000';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatientDetail();
    }, [id]);

    const fetchPatientDetail = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/patients/${id}`);
            if (response.data.code === 0) {
                setPatient(response.data.data);
            } else {
                setError('환자 정보를 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('Error fetching patient details:', err);
            setError('환자 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!patient) return <div className="not-found">환자를 찾을 수 없습니다.</div>;

    return (
        <div className="patient-detail-container">
            <div className="detail-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    돌아가기
                </button>
                <h1>환자 상세정보</h1>
            </div>

            <div className="medical-record">
                <div className="left-panel">
                    <div className="patient-basic-info">
                        <h3>기본 정보</h3>
                        <div className="info-row">
                            <span>이름:</span>
                            <span>{patient.patient_name}</span>
                        </div>
                        <div className="info-row">
                            <span>생년월일:</span>
                            <span>{new Date(patient.patient_birth).toLocaleDateString()}</span>
                        </div>
                        <div className="info-row">
                            <span>혈액형:</span>
                            <span>{patient.patient_blood}형</span>
                        </div>
                    </div>

                    <div className="vital-signs">
                        <h3>신체 정보</h3>
                        <div className="info-row">
                            <span>키:</span>
                            <span>{patient.patient_height}cm</span>
                        </div>
                        <div className="info-row">
                            <span>체중:</span>
                            <span>{patient.patient_weight}kg</span>
                        </div>
                    </div>

                    <div className="hospital-info">
                        <h3>입원 정보</h3>
                        <div className="info-row">
                            <span>병실:</span>
                            <span>{patient.room_name}호</span>
                        </div>
                        <div className="info-row">
                            <span>침대:</span>
                            <span>{patient.bed_num}번</span>
                        </div>
                        <div className="info-row">
                            <span>상태:</span>
                            <span className={`status ${patient.patient_status}`}>{patient.patient_status}</span>
                        </div>
                    </div>

                    <div className="guardian-info">
                        <h3>보호자 정보</h3>
                        <div className="info-row">
                            <span>연락처:</span>
                            <span>{patient.guardian_tel || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="body-diagram">
                        <h3>증상 체크</h3>
                        <div className="body-image">
                            <img src="/images/body-diagram.png" alt="신체 다이어그램" />
                            {/* 클릭 가능한 영역들 추가 */}
                            <div className="clickable-areas">
                                {patient.symptoms?.map((symptom, index) => (
                                    <div
                                        key={index}
                                        className="symptom-marker"
                                        style={{
                                            top: `${symptom.y}%`,
                                            left: `${symptom.x}%`,
                                        }}
                                        title={symptom.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;
