import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/PatientManagement.css';
import {
    Plus,
    Search,
    UserPlus,
    FileText,
    Filter,
    ChevronDown,
    ChevronUp,
    Users,
    AlertTriangle,
    Clock,
    Heart,
    X,
    Upload,
    Download,
    ChevronLeft,
    ChevronRight,
    User,
    Eye,
} from 'lucide-react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

const initialFormState = {
    patient_name: '',
    patient_birth: '',
    patient_height: '',
    patient_weight: '',
    patient_blood: '',
    patient_img: null,
    patient_memo: '',
    patient_status: '무위험군', // 기본값 수정
    guardian_id: '',
    bed_id: '',
};

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [newPatient, setNewPatient] = useState(initialFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        ageRange: { min: '', max: '' },
        bloodType: '',
        hasGuardian: null,
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: {
            value: '127명',
            description: '전체 환자',
        },
        newPatients: {
            value: '12명',
            description: '신규 입원',
            change: '+2명',
        },
        criticalPatients: {
            value: '5명',
            description: '중환자',
            change: '-1명',
        },
        dischargeScheduled: {
            value: '8명',
            description: '퇴원 예정',
        },
    });

    const navigate = useNavigate();

    // 날짜 포맷팅 함수 추가
    const formatBirthDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // fetchPatients 함수 수정
    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/patients`);
            if (response.data.code === 0) {
                setPatients(response.data.data); // data[0] 제거
                setStats((prev) => ({
                    ...prev,
                    totalPatients: {
                        ...prev.totalPatients,
                        value: `${response.data.totalCount}명`,
                    },
                }));
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

    // handleAddPatient 함수 수정
    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const patientData = {
                ...newPatient,
                patient_status: newPatient.patient_status || '무위험군', // 'active' 대신 '무위험군' 사용
                guardian_id: newPatient.guardian_id || null,
                bed_id: newPatient.bed_id || null,
            };

            const response = await axios.post(`${API_BASE_URL}/patients`, patientData);

            if (response.data.code === 0) {
                await fetchPatients();
                setNewPatient(initialFormState);
                setShowAddForm(false);
                alert('환자가 성공적으로 등록되었습니다.');
            }
        } catch (err) {
            console.error('Error adding patient:', err);
            alert(err.response?.data?.message || '환자 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = async (id) => {
        if (window.confirm('정말 이 환자를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${API_BASE_URL}/patients/${id}`);
                setPatients(patients.filter((patient) => patient.patient_id !== id));
            } catch (err) {
                console.error('Error deleting patient:', err);
                setError('환자 삭제에 실패했습니다.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedPatients = React.useMemo(() => {
        if (!sortConfig.key) return patients;
        return [...patients].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [patients, sortConfig]);

    // handleEditPatient 함수 수정
    const handleEditPatient = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const patientData = {
                ...editingPatient,
                patient_birth: editingPatient.patient_birth,
                patient_status: editingPatient.patient_status || 'active',
                medications: editingPatient.medications || [],
            };

            const response = await axios.put(`${API_BASE_URL}/patients/${editingPatient.patient_id}`, patientData);

            if (response.data.code === 0) {
                await fetchPatients();
                setShowEditForm(false);
                setEditingPatient(null);
                alert('환자 정보가 성공적으로 수정되었습니다.');
            } else {
                setError('환자 정보 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error('Error updating patient:', err);
            alert(err.response?.data?.message || '환자 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // openDetailView 함수 수정
    const openDetailView = (patient) => {
        navigate(`/patients/${patient.patient_id}`);
    };

    const openEditForm = (patient) => {
        // 생년월일 포맷팅 (patient_birth 또는 patient_age 필드 사용)
        const birthField = patient.patient_birth || patient.patient_age;
        const formattedBirthDate = birthField
            ? new Date(new Date(birthField).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : '';

        setEditingPatient({
            ...patient,
            patient_birth: formattedBirthDate,
        });
        setShowEditForm(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFilters((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFilters((prev) => ({ ...prev, [name]: value }));
        }
    };

    // 필터링 함수 수정
    const applyFilters = (patients) => {
        return patients.filter((patient) => {
            const age = patient.age; // TIMESTAMPDIFF로 계산된 나이 사용
            const matchesAge =
                (!filters.ageRange.min || age >= parseInt(filters.ageRange.min)) &&
                (!filters.ageRange.max || age <= parseInt(filters.ageRange.max));
            const matchesBlood = !filters.bloodType || patient.patient_blood === filters.bloodType;
            const matchesGuardian =
                filters.hasGuardian === null ||
                (filters.hasGuardian === true && patient.guardian_tel) ||
                (filters.hasGuardian === false && !patient.guardian_tel);

            return matchesAge && matchesBlood && matchesGuardian;
        });
    };

    const filteredPatients = applyFilters(sortedPatients).filter(
        (patient) =>
            patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patient_id.toString().includes(searchTerm)
    );

    const handleImageUpload = (e, setFunction) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFunction((prev) => ({
                    ...prev,
                    profile_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPatients(patients.map((patient) => patient.patient_id));
        } else {
            setSelectedPatients([]);
        }
    };

    const handleSelectPatient = (id) => {
        if (selectedPatients.includes(id)) {
            setSelectedPatients(selectedPatients.filter((i) => i !== id));
        } else {
            setSelectedPatients([...selectedPatients, id]);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case '고위험군':
                return 'high-risk';
            case '저위험군':
                return 'low-risk';
            case '무위험군':
                return 'no-risk';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-text">환자 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-text">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">환자 관리</h1>
            <p className="dashboard-subtitle">환자 정보를 관리하고 모니터링하세요</p>

            {/* 주요 통계 */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>전체 환자</h3>
                        <p className="stat-value">{stats.totalPatients.value}</p>
                        <p className="stat-change">{stats.totalPatients.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <UserPlus size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>신규 입원</h3>
                        <p className="stat-value">{stats.newPatients.value}</p>
                        <p className="stat-change">{stats.newPatients.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>중환자</h3>
                        <p className="stat-value">{stats.criticalPatients.value}</p>
                        <p className="stat-change negative">{stats.criticalPatients.change}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>퇴원 예정</h3>
                        <p className="stat-value">{stats.dischargeScheduled.value}</p>
                        <p className="stat-description">{stats.dischargeScheduled.description}</p>
                    </div>
                </div>
            </div>

            {/* 환자 등록 모달 */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>환자 등록</h2>
                            <button className="close-button" onClick={() => setShowAddForm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPatient} className="modal-form">
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
                                    <label>키 (cm)</label>
                                    <input
                                        type="number"
                                        name="patient_height"
                                        value={newPatient.patient_height}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>몸무게 (kg)</label>
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
                                    <input
                                        type="text"
                                        name="bed_id"
                                        value={newPatient.bed_id}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>상태</label>
                                    <select
                                        name="patient_status"
                                        value={newPatient.patient_status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="고위험군">고위험군</option>
                                        <option value="저위험군">저위험군</option>
                                        <option value="무위험군">무위험군</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>이미지 URL</label>
                                    <input
                                        type="text"
                                        name="patient_img"
                                        value={newPatient.patient_img || ''}
                                        onChange={handleInputChange}
                                        placeholder="이미지 URL을 입력하세요"
                                    />
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
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>
                                    취소
                                </button>
                                <button type="submit" className="submit-button">
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 필터 모달 */}
            {showFilterModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>필터 설정</h2>
                            <button className="close-button" onClick={() => setShowFilterModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="filter-form">
                            <div className="form-group">
                                <label>나이 범위</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="ageRange.min"
                                        placeholder="최소"
                                        value={filters.ageRange.min}
                                        onChange={handleFilterChange}
                                    />
                                    <span>~</span>
                                    <input
                                        type="number"
                                        name="ageRange.max"
                                        placeholder="최대"
                                        value={filters.ageRange.max}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>혈액형</label>
                                <select name="bloodType" value={filters.bloodType} onChange={handleFilterChange}>
                                    <option value="">전체</option>
                                    <option value="A">A형</option>
                                    <option value="B">B형</option>
                                    <option value="O">O형</option>
                                    <option value="AB">AB형</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>보호자 여부</label>
                                <select
                                    name="hasGuardian"
                                    value={filters.hasGuardian === null ? '' : filters.hasGuardian}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            hasGuardian: e.target.value === '' ? null : e.target.value === 'true',
                                        }))
                                    }
                                >
                                    <option value="">전체</option>
                                    <option value="true">있음</option>
                                    <option value="false">없음</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setShowFilterModal(false)}>
                                취소
                            </button>
                            <button className="submit-button" onClick={() => setShowFilterModal(false)}>
                                적용
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 상세보기 모달 */}
            {showDetailModal && selectedPatient && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>환자 상세정보</h2>
                            <button className="close-button" onClick={() => setShowDetailModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="profile-section">
                            <div className="profile-image-large">
                                {selectedPatient.profile_image ? (
                                    <img
                                        src={selectedPatient.profile_image}
                                        alt={`${selectedPatient.patient_name}의 프로필`}
                                        className="profile-image"
                                    />
                                ) : (
                                    <div className="profile-placeholder large">
                                        <UserPlus size={48} />
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
                                <span className="detail-value">{formatBirthDate(selectedPatient.patient_birth)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">키:</span>
                                <span className="detail-value">{selectedPatient.patient_height}cm</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">몸무게:</span>
                                <span className="detail-value">{selectedPatient.patient_weight}kg</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">혈액형:</span>
                                <span className="detail-value">{selectedPatient.patient_blood}형</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">병실:</span>
                                <span className="detail-value">{selectedPatient.room_name || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">침대 번호:</span>
                                <span className="detail-value">{selectedPatient.bed_num || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">보호자 연락처:</span>
                                <span className="detail-value">{selectedPatient.guardian_tel || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">상태:</span>
                                <span className="detail-value">{selectedPatient.patient_status || 'active'}</span>
                            </div>
                            {selectedPatient.patient_memo && (
                                <div className="detail-row">
                                    <span className="detail-label">메모:</span>
                                    <span className="detail-value">{selectedPatient.patient_memo}</span>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="submit-button" onClick={() => setShowDetailModal(false)}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 수정 모달 */}
            {showEditForm && editingPatient && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>환자 정보 수정</h2>
                            <button className="close-button" onClick={() => setShowEditForm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditPatient} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        name="patient_name"
                                        value={editingPatient.patient_name}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>생년월일</label>
                                    <input
                                        type="date"
                                        name="patient_birth"
                                        value={editingPatient.patient_birth}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_birth: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>키 (cm)</label>
                                    <input
                                        type="number"
                                        name="patient_height"
                                        value={editingPatient.patient_height}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_height: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>몸무게 (kg)</label>
                                    <input
                                        type="number"
                                        name="patient_weight"
                                        value={editingPatient.patient_weight}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_weight: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>혈액형</label>
                                    <select
                                        name="patient_blood"
                                        value={editingPatient.patient_blood}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_blood: e.target.value })
                                        }
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
                                        value={editingPatient.guardian_id || ''}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, guardian_id: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>침대 ID</label>
                                    <input
                                        type="text"
                                        name="bed_id"
                                        value={editingPatient.bed_id || ''}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, bed_id: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>상태</label>
                                    <select
                                        name="patient_status"
                                        value={editingPatient.patient_status || 'active'}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_status: e.target.value })
                                        }
                                    >
                                        <option value="고위험군">고위험군</option>
                                        <option value="저위험군">저위험군</option>
                                        <option value="무위험군">무위험군</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>이미지 URL</label>
                                    <input
                                        type="text"
                                        name="patient_img"
                                        value={editingPatient.patient_img || ''}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_img: e.target.value })
                                        }
                                        placeholder="이미지 URL을 입력하세요"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>메모</label>
                                    <textarea
                                        name="patient_memo"
                                        value={editingPatient.patient_memo || ''}
                                        onChange={(e) =>
                                            setEditingPatient({ ...editingPatient, patient_memo: e.target.value })
                                        }
                                        rows="3"
                                        placeholder="환자에 대한 메모를 입력하세요"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-button" onClick={() => setShowEditForm(false)}>
                                    취소
                                </button>
                                <button type="submit" className="submit-button">
                                    수정
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 테이블 헤더 액션 */}
            <div className="table-header-actions">
                <h1 className="table-title">Patients</h1>
            </div>

            {/* 검색 */}
            <div className="search-filter-section">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search customer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="action-group">
                    <button className="filter-button" onClick={() => setShowFilterModal(true)}>
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="header-button add-button" onClick={() => setShowAddForm(true)}>
                        <Plus size={18} />
                        Add
                    </button>
                </div>
            </div>

            {/* 환자 목록 테이블 */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="row-checkbox"
                                    checked={selectedPatients.length === patients.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>ID</th>
                            <th>사진</th>
                            <th>이름</th>
                            <th>생년월일</th>
                            <th>신체 정보</th>
                            <th>혈액형</th>
                            <th>병실/침대</th>
                            <th>상태</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients
                            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                            .map((patient) => (
                                <tr key={patient.patient_id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="row-checkbox"
                                            checked={selectedPatients.includes(patient.patient_id)}
                                            onChange={() => handleSelectPatient(patient.patient_id)}
                                        />
                                    </td>
                                    <td>
                                        <span className="patient-id">{patient.patient_id}</span>
                                    </td>
                                    <td>
                                        <div className="patient-avatar">
                                            {patient.patient_img ? (
                                                <img
                                                    src={patient.patient_img}
                                                    alt={`${patient.patient_name}의 프로필`}
                                                    className="patient-avatar-image"
                                                />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="patient-name">{patient.patient_name}</span>
                                    </td>
                                    <td>{formatBirthDate(patient.patient_birth)}</td>
                                    <td>
                                        {patient.patient_height}cm / {patient.patient_weight}kg
                                    </td>
                                    <td>
                                        <span className="status-badge blood-type">{patient.patient_blood}형</span>
                                    </td>
                                    <td>{patient.room_name ? `${patient.room_name}호 / ${patient.bed_num}번` : '-'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(patient.patient_status)}`}>
                                            {patient.patient_status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-button" onClick={() => openDetailView(patient)}>
                                                <ContentPasteSearchIcon sx={{ fontSize: 20 }} />
                                            </button>
                                            <button className="action-button" onClick={() => openEditForm(patient)}>
                                                <EditNoteIcon sx={{ fontSize: 20 }} />
                                            </button>
                                            <button
                                                className="action-button delete"
                                                onClick={() => handleDeletePatient(patient.patient_id)}
                                            >
                                                <DeleteIcon sx={{ fontSize: 20, color: '#dc2626' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="table-footer">
                    <div className="rows-per-page">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                const newRowsPerPage = Number(e.target.value);
                                setRowsPerPage(newRowsPerPage);
                                // 페이지당 행 수가 변경될 때 현재 페이지 조정
                                const maxPage = Math.ceil(filteredPatients.length / newRowsPerPage);
                                setCurrentPage((current) => Math.min(current, maxPage));
                            }}
                            className="rows-select"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                    <div className="pagination-info">
                        {`${Math.min((currentPage - 1) * rowsPerPage + 1, filteredPatients.length)}-${Math.min(
                            currentPage * rowsPerPage,
                            filteredPatients.length
                        )} of ${filteredPatients.length}`}
                    </div>
                    <div className="pagination-buttons">
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className="pagination-button"
                            onClick={() => {
                                const maxPage = Math.ceil(filteredPatients.length / rowsPerPage);
                                setCurrentPage((prev) => Math.min(prev + 1, maxPage));
                            }}
                            disabled={currentPage * rowsPerPage >= filteredPatients.length}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientManagement;
