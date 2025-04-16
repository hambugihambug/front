import React, { useState, useEffect } from 'react';

const FallIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);

    // 더미 낙상 사고 데이터
    const mockIncidents = [
        {
            id: 1,
            patientId: 1,
            patientName: '김영희',
            age: 65,
            gender: '여성',
            roomNumber: '103',
            timestamp: '2025-04-11T06:23:15',
            detectionConfidence: 0.92,
            status: '검증됨',
            description: '화장실 가는 도중 낙상',
            actionsTaken: '간호사 호출, 의사 검진 실시',
            injurySeverity: '경미',
        },
        {
            id: 2,
            patientId: 3,
            patientName: '박지민',
            age: 81,
            gender: '여성',
            roomNumber: '302',
            timestamp: '2025-04-10T22:15:43',
            detectionConfidence: 0.88,
            status: '검증됨',
            description: '침대에서 내려오다 낙상',
            actionsTaken: '즉시 응급 처치, CT 촬영',
            injurySeverity: '중간',
        },
        {
            id: 3,
            patientId: 4,
            patientName: '정민준',
            age: 68,
            gender: '남성',
            roomNumber: '110',
            timestamp: '2025-04-10T15:47:22',
            detectionConfidence: 0.76,
            status: '오탐지',
            description: '시스템 오탐지, 환자는 정상적으로 침대에 앉아있었음',
            actionsTaken: '해당 없음',
            injurySeverity: '없음',
        },
        {
            id: 4,
            patientId: 2,
            patientName: '이철수',
            age: 72,
            gender: '남성',
            roomNumber: '205',
            timestamp: '2025-04-09T09:12:05',
            detectionConfidence: 0.95,
            status: '검증됨',
            description: '기립성 저혈압으로 인한 어지러움으로 낙상',
            actionsTaken: '즉시 응급 처치, 약물 조정',
            injurySeverity: '경미',
        },
    ];

    useEffect(() => {
        const loadIncidents = () => {
            try {
                setLoading(true);
                setIncidents(mockIncidents);
            } catch (error) {
                console.error('Error loading incidents data:', error);
                setError('낙상 사고 데이터를 로드하는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, []);

    const handleIncidentClick = (incident) => {
        setSelectedIncident(incident);
    };

    const closeIncidentDetails = () => {
        setSelectedIncident(null);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case '검증됨':
                return 'badge-success';
            case '검증 중':
                return 'badge-warning';
            case '오탐지':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const incidentTime = new Date(timestamp);
        const diffMs = now - incidentTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}일 전`;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>낙상 사고 데이터 로딩 중...</p>
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
            <h1>낙상 사고</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">낙상 사고 목록</h2>
                </div>
                <div className="card-content">
                    {incidents.length === 0 ? (
                        <p>기록된 낙상 사고가 없습니다.</p>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>환자</th>
                                        <th>병실</th>
                                        <th>시간</th>
                                        <th>감지 정확도</th>
                                        <th>상태</th>
                                        <th>부상 정도</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidents.map((incident) => (
                                        <tr key={incident.id}>
                                            <td>
                                                {incident.patientName} ({incident.age}세, {incident.gender})
                                            </td>
                                            <td>{incident.roomNumber}호</td>
                                            <td>
                                                {new Date(incident.timestamp).toLocaleString('ko-KR', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                                <br />
                                                <small>{getTimeAgo(incident.timestamp)}</small>
                                            </td>
                                            <td>{(incident.detectionConfidence * 100).toFixed(1)}%</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(incident.status)}`}>
                                                    {incident.status}
                                                </span>
                                            </td>
                                            <td>{incident.injurySeverity}</td>
                                            <td>
                                                <button
                                                    className="btn btn-small"
                                                    onClick={() => handleIncidentClick(incident)}
                                                >
                                                    상세 보기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedIncident && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>낙상 사고 상세 정보</h2>
                            <button className="modal-close" onClick={closeIncidentDetails}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="incident-detail-grid">
                                <div>
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">환자 정보</h3>
                                        </div>
                                        <div className="card-content">
                                            <ul className="incident-info-list">
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">이름:</span>
                                                    <span className="incident-info-value">
                                                        {selectedIncident.patientName}
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">나이:</span>
                                                    <span className="incident-info-value">
                                                        {selectedIncident.age}세
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">성별:</span>
                                                    <span className="incident-info-value">
                                                        {selectedIncident.gender}
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">병실:</span>
                                                    <span className="incident-info-value">
                                                        {selectedIncident.roomNumber}호
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">사고 정보</h3>
                                        </div>
                                        <div className="card-content">
                                            <ul className="incident-info-list">
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">발생 시간:</span>
                                                    <span className="incident-info-value">
                                                        {new Date(selectedIncident.timestamp).toLocaleString('ko-KR')}
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">감지 정확도:</span>
                                                    <span className="incident-info-value">
                                                        {(selectedIncident.detectionConfidence * 100).toFixed(1)}%
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">상태:</span>
                                                    <span className="incident-info-value">
                                                        <span
                                                            className={`badge ${getStatusBadgeClass(
                                                                selectedIncident.status
                                                            )}`}
                                                        >
                                                            {selectedIncident.status}
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="incident-info-item">
                                                    <span className="incident-info-label">부상 정도:</span>
                                                    <span className="incident-info-value">
                                                        {selectedIncident.injurySeverity}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">설명 및 조치</h3>
                                </div>
                                <div className="card-content">
                                    <div className="form-group">
                                        <label className="form-label">사고 설명</label>
                                        <p>{selectedIncident.description}</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">취한 조치</label>
                                        <p>{selectedIncident.actionsTaken}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" onClick={closeIncidentDetails}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FallIncidents;
