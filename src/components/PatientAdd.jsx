import React, { useState, useEffect, useRef } from 'react';
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
    guardian_tel: '',
    bed_id: '',
    patient_sex: '',
    patient_in: '',
    patient_out: '',
};

const PatientAdd = () => {
    const navigate = useNavigate();
    const [newPatient, setNewPatient] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [availableBeds, setAvailableBeds] = useState([]);
    const leftPanelRef = useRef(null);
    const hospitalInfoRef = useRef(null);
    const [memoHeight, setMemoHeight] = useState(300);

    // 기존 useEffect 유지
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/rooms`);
                if (response.data.code === 0) {
                    setRooms(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);

    // 메모 높이 조절을 위한 useEffect 추가
    useEffect(() => {
        if (leftPanelRef.current && hospitalInfoRef.current) {
            const leftHeight = leftPanelRef.current.offsetHeight;
            const hospitalHeight = hospitalInfoRef.current.offsetHeight;
            setMemoHeight(Math.max(220, leftHeight - hospitalHeight - 32));
        }
    }, [newPatient, imagePreview]);

    // 병실 선택 시 빈 침대 정보 가져오기
    const handleRoomChange = async (roomName) => {
        setSelectedRoom(roomName);
        if (!roomName) {
            setAvailableBeds([]);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${roomName}`);

            if (response.data.code === 0) {
                const roomData = response.data.data;

                // 현재 입원한 환자 수와 총 침대 수 비교
                if (roomData.patient_count >= roomData.room_capacity) {
                    alert('이 병실은 현재 만실입니다.');
                    setSelectedRoom('');
                    setAvailableBeds([]);
                    return;
                }

                // 사용 중인 침대 ID Set으로 만들기
                const occupiedBedIds = new Set(roomData.patients.map((p) => p.bed_id));

                // room_name과 병실 번호로 bed_id 범위 계산
                const roomNum = parseInt(roomName);
                const baseId = (roomNum - 101) * 4 + 1; // 101호는 1~4, 102호는 5~8, 103호는 9~12...

                // 빈 침대 계산
                const emptyBeds = [];
                for (let i = 0; i < roomData.room_capacity; i++) {
                    const currentBedId = baseId + i;
                    if (!occupiedBedIds.has(currentBedId)) {
                        emptyBeds.push({
                            bed_id: currentBedId,
                            bed_num: String.fromCharCode(65 + i), // A, B, C, D로 변환
                        });
                    }
                }

                console.log('Available beds:', emptyBeds); // 디버깅용
                setAvailableBeds(emptyBeds);
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
            setAvailableBeds([]);
        }
    };

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

    // handleSubmit 함수의 FormData 생성 부분 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // bed_id가 유효한 숫자인지 확인
            if (!newPatient.bed_id || isNaN(newPatient.bed_id)) {
                alert('올바른 침대를 선택해주세요.');
                return;
            }

            Object.keys(newPatient).forEach((key) => {
                if (key === 'bed_id') {
                    formData.append(key, parseInt(newPatient.bed_id)); // 숫자로 변환
                } else if (key !== 'patient_img' || !newPatient[key]) {
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

            <div className="profile-upload-section">
                <div className="profile-image-large" style={{ margin: 0 }}>
                    {imagePreview ? (
                        <img src={imagePreview} alt="환자 프로필 미리보기" className="profile-image" />
                    ) : (
                        <div className="profile-placeholder">
                            <span>?</span>
                        </div>
                    )}
                </div>
                <div className="profile-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="profile-upload"
                        className="profile-input"
                    />
                    <label htmlFor="profile-upload" className="profile-upload-button">
                        프로필 사진 업로드
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-panels">
                <div className="left-panel" ref={leftPanelRef}>
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
                            <span>성별</span>
                            <select
                                name="patient_sex"
                                value={newPatient.patient_sex}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">선택하세요</option>
                                <option value="Male">남성</option>
                                <option value="Female">여성</option>
                            </select>
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
                    <div className="hospital-info" ref={hospitalInfoRef}>
                        <h3>입원 정보</h3>
                        <div className="info-row">
                            <span>입원 날짜</span>
                            <input
                                type="date"
                                name="patient_in"
                                value={newPatient.patient_in}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="info-row">
                            <span>퇴원 예정일</span>
                            <input
                                type="date"
                                name="patient_out"
                                value={newPatient.patient_out}
                                onChange={handleInputChange}
                                min={newPatient.patient_in}
                            />
                        </div>
                        <div className="info-row">
                            <span>병실 선택</span>
                            <select
                                name="room"
                                value={selectedRoom}
                                onChange={(e) => handleRoomChange(e.target.value)}
                                required
                            >
                                <option value="">병실을 선택하세요</option>
                                {rooms.map((room) => (
                                    <option key={room.room_name} value={room.room_name}>
                                        {room.room_name}호
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="info-row">
                            <span>침대 번호</span>
                            <select
                                name="bed_id"
                                value={newPatient.bed_id}
                                onChange={handleInputChange}
                                required
                                disabled={!selectedRoom}
                            >
                                <option value="">침대를 선택하세요</option>
                                {availableBeds.map((bed) => (
                                    <option key={`${selectedRoom}-${bed.bed_num}`} value={bed.bed_id}>
                                        {bed.bed_num}
                                    </option>
                                ))}
                            </select>
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
                            <span>보호자 전화</span>
                            <input
                                type="tel"
                                name="guardian_tel"
                                value={newPatient.guardian_tel}
                                onChange={handleInputChange}
                                placeholder="010-0000-0000"
                                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                            />
                        </div>
                    </div>

                    <div className="memo-info" style={{ height: memoHeight }}>
                        <h3>메모</h3>
                        <textarea
                            name="patient_memo"
                            value={newPatient.patient_memo}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="환자에 대한 메모를 입력하세요"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PatientAdd;
