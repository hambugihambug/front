import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const FallIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/fall-incidents`);
            if (response.data.code === 0) {
                setIncidents(response.data.data);
            } else {
                setError(response.data.message || '낙상 사고 데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error loading incidents data:', error);
            setError('서버 연결에 실패했습니다. 나중에 다시 시도해 주세요.');
        } finally {
            setLoading(false);
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
                                        <th>사고 ID</th>
                                        <th>환자 정보</th>
                                        <th>발생 일시</th>
                                        <th>사고 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidents.map((incident) => (
                                        <tr key={incident.accident_id}>
                                            <td>{incident.accident_id}</td>
                                            <td>
                                                {incident.patient_name} ({incident.patient_id})
                                            </td>
                                            <td>
                                                {new Date(incident.accident_date).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td>{incident.accident_YN === 1 ? '발생' : '미발생'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FallIncidents;
