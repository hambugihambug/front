import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    BarChart3,
    LineChart,
    Bell,
    Timer,
    CheckCircle,
    Thermometer,
    Droplets,
    PenSquare,
    Users,
    AlertTriangle,
    Clock,
} from 'lucide-react';
import '../styles/components/FallIncidents.css';

const API_BASE_URL = 'http://localhost:3000';

const FallIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [hourlyStats, setHourlyStats] = useState([]);
    const [roomStats, setRoomStats] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        todayCount: 0,
        yesterdayCount: 0,
        responseTime: '0분 0초',
        accuracy: '0%',
        accuracyChange: '0%',
    });
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false); // 탭 변경 시 데이터 로딩 상태
    const [error, setError] = useState(null);
    const [statsTab, setStatsTab] = useState('일간');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (loading) {
                    setLoading(true);
                } else {
                    setDataLoading(true);
                }

                // 낙상 사고 목록 조회
                const incidentsResponse = await axios.get(`${API_BASE_URL}/fall-incidents`);

                // 시간대별 통계 데이터 조회
                const statsResponse = await axios.get(`${API_BASE_URL}/fall-incidents/stats`);

                // 데이터 설정
                if (incidentsResponse?.data?.code === 0) {
                    setIncidents(incidentsResponse.data.data);
                }

                if (statsResponse?.data?.code === 0) {
                    setHourlyStats(statsResponse.data.data);

                    // 병실별 통계 계산
                    const roomData = processRoomStats(incidentsResponse.data.data);
                    setRoomStats(roomData);

                    // 요약 통계 계산
                    const summary = calculateSummaryStats(incidentsResponse.data.data);
                    setSummaryStats(summary);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
                setDataLoading(false);
            }
        };

        fetchAllData();
    }, [statsTab]);

    // 병실별 통계 처리 함수
    const processRoomStats = (incidents) => {
        const roomCounts = incidents.reduce((acc, incident) => {
            const roomName = incident.room_name;
            if (!acc[roomName]) {
                acc[roomName] = { count: 0, roomName };
            }
            if (incident.accident_YN === 'Y') {
                acc[roomName].count++;
            }
            return acc;
        }, {});

        const roomStats = Object.values(roomCounts);
        const totalIncidents = roomStats.reduce((sum, room) => sum + room.count, 0);

        return roomStats.map((room) => ({
            ...room,
            percentage: totalIncidents > 0 ? Math.round((room.count / totalIncidents) * 100) : 0,
        }));
    };

    // 요약 통계 계산 함수
    const calculateSummaryStats = (incidents) => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        const todayIncidents = incidents.filter(
            (i) => new Date(i.accident_date).toDateString() === today && i.accident_YN === 'Y'
        ).length;

        const yesterdayIncidents = incidents.filter(
            (i) => new Date(i.accident_date).toDateString() === yesterday && i.accident_YN === 'Y'
        ).length;

        return {
            todayCount: todayIncidents,
            yesterdayCount: yesterdayIncidents,
            responseTime: '2분 34초', // 임시 데이터
            accuracy: '95%', // 임시 데이터
            accuracyChange: '+2.3%', // 임시 데이터
        };
    };

    // 시간대별 통계에서 최대값 계산
    const maxHourlyCount = useMemo(() => {
        if (hourlyStats.length === 0) return 10;
        const dataMax = Math.max(...hourlyStats.map((item) => item.count));
        // 최댓값의 20% 추가하여 여유 공간 확보 (최소 1 이상 추가)
        return Math.ceil(dataMax * 1.2) + Math.max(1, Math.floor(dataMax * 0.1));
    }, [hourlyStats]);

    // 시간대별 그래프 Y축 눈금 값 계산
    const yAxisLabels = useMemo(() => {
        if (maxHourlyCount <= 5) {
            // 최댓값이 작은 경우 (5 이하) 1 단위로 표시
            const labels = [];
            for (let i = maxHourlyCount; i >= 0; i--) {
                labels.push(i);
            }
            // 눈금이 너무 많으면 적절히 필터링 (최대 6개)
            if (labels.length > 6) {
                const filtered = [];
                const step = Math.ceil(labels.length / 5);
                for (let i = 0; i < labels.length; i += step) {
                    filtered.push(labels[i]);
                }
                // 0 추가
                if (filtered[filtered.length - 1] !== 0) {
                    filtered.push(0);
                }
                return filtered;
            }
            return labels;
        } else {
            // 최댓값이 큰 경우 적절한 단위 계산
            const numberOfTicks = 6; // 원하는 눈금 개수
            const range = maxHourlyCount;

            // 적절한 간격 계산 (1, 2, 5, 10, 20, 50... 단위)
            let step = Math.ceil(range / (numberOfTicks - 1));
            const magnitude = Math.pow(10, Math.floor(Math.log10(step)));

            if (step / magnitude < 1.5) {
                step = magnitude; // 1단위
            } else if (step / magnitude < 3.5) {
                step = 2 * magnitude; // 2단위
            } else if (step / magnitude < 7.5) {
                step = 5 * magnitude; // 5단위
            } else {
                step = 10 * magnitude; // 10단위
            }

            // 최댓값을 step 단위로 올림
            const ceiling = Math.ceil(maxHourlyCount / step) * step;

            // 눈금값 생성
            const labels = [];
            for (let i = ceiling; i >= 0; i -= step) {
                labels.push(i);
                if (labels.length >= numberOfTicks) break;
            }

            // 마지막 값이 0이 아니면 0 추가
            if (labels[labels.length - 1] !== 0) {
                labels.push(0);
            }

            return labels;
        }
    }, [maxHourlyCount]);

    // 시간대별 가장 활발한 시간 찾기
    const peakHour = useMemo(() => {
        if (hourlyStats.length === 0) return '없음';
        const peak = hourlyStats.reduce((max, item) => (item.count > max.count ? item : max), hourlyStats[0]);
        return peak.hour;
    }, [hourlyStats]);

    // 탭 변경 핸들러
    const handleTabChange = (tab) => {
        if (tab !== statsTab) {
            setStatsTab(tab);
        }
    };

    if (loading) {
        return <div className="loading-text">낙상 감지 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">낙상 감지 통계</h1>
            <p className="dashboard-subtitle">병실별 낙상 감지 현황 및 통계를 관리하세요</p>

            {/* 낙상 통계 요약 카드 섹션 */}
            <div className="stats-summary-cards">
                <div className="summary-card-container">
                    <div className="summary-card warning">
                        <div className="card-icon">
                            <Bell size={24} />
                        </div>
                        <div className="card-content">
                            <div className="card-title">오늘 낙상 감지</div>
                            <div className="card-value">{summaryStats.todayCount}건</div>
                            <div className="card-description">
                                어제보다{' '}
                                {summaryStats.todayCount > summaryStats.yesterdayCount
                                    ? `+${summaryStats.todayCount - summaryStats.yesterdayCount}`
                                    : summaryStats.todayCount < summaryStats.yesterdayCount
                                    ? `-${summaryStats.yesterdayCount - summaryStats.todayCount}`
                                    : '±0'}
                                건
                            </div>
                        </div>
                    </div>

                    <div className="summary-card info">
                        <div className="card-icon">
                            <Timer size={24} />
                        </div>
                        <div className="card-content">
                            <div className="card-title">평균 대응 시간</div>
                            <div className="card-value">{summaryStats.responseTime}</div>
                            <div className="card-description">최근 24시간 평균</div>
                        </div>
                    </div>

                    <div className="summary-card success">
                        <div className="card-icon">
                            <CheckCircle size={24} />
                        </div>
                        <div className="card-content">
                            <div className="card-title">감지 정확도</div>
                            <div className="card-value">{summaryStats.accuracy}</div>
                            <div className="card-description positive">{summaryStats.accuracyChange}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tab-buttons">
                <button
                    className={`tab-button ${statsTab === '일간' ? 'active' : ''}`}
                    onClick={() => handleTabChange('일간')}
                >
                    일간
                </button>
                <button
                    className={`tab-button ${statsTab === '주간' ? 'active' : ''}`}
                    onClick={() => handleTabChange('주간')}
                >
                    주간
                </button>
                <button
                    className={`tab-button ${statsTab === '월간' ? 'active' : ''}`}
                    onClick={() => handleTabChange('월간')}
                >
                    월간
                </button>
            </div>

            <div className="stats-grid">
                <div className={`stats-card ${dataLoading ? 'loading' : ''}`}>
                    <div className="stats-card-header">
                        <h3>병실별 낙상 감지</h3>
                        <span className="stats-date">
                            {statsTab === '일간' ? '최근 24시간' : statsTab === '주간' ? '최근 7일' : '최근 30일'}
                        </span>
                    </div>

                    <div className="stats-bar-container">
                        {roomStats.length === 0 ? (
                            <div className="no-data-message">데이터가 없습니다.</div>
                        ) : (
                            <>
                                {roomStats.map((room, index) => (
                                    <div className="stats-room-row" key={index}>
                                        <span className="room-name">{room.roomName}</span>
                                        <div className="stats-bar-wrapper">
                                            <div
                                                className="stats-bar"
                                                style={{ width: `${room.percentage}%` }}
                                                title={`${room.roomName}: ${room.count}건 (${room.percentage}%)`}
                                            ></div>
                                        </div>
                                        <span className="stats-value">{room.percentage}%</span>
                                    </div>
                                ))}
                                {roomStats.length < 4 &&
                                    Array(4 - roomStats.length)
                                        .fill()
                                        .map((_, i) => <div className="stats-room-row empty" key={`empty-${i}`}></div>)}
                            </>
                        )}
                    </div>

                    {dataLoading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                        </div>
                    )}

                    <div className="stats-total">
                        <span>총 낙상 감지</span>
                        <span>{incidents.filter((i) => i.accident_YN === 1).length}건</span>
                    </div>
                </div>

                <div className={`stats-card ${dataLoading ? 'loading' : ''}`}>
                    <div className="stats-card-header">
                        <h3>시간대별 감지 현황</h3>
                        <span className="stats-date">
                            {statsTab === '일간' ? '최근 24시간' : statsTab === '주간' ? '최근 7일' : '최근 30일'}
                        </span>
                    </div>

                    <div className="time-chart-container">
                        <div className="time-chart">
                            <div className="chart-y-axis">
                                {yAxisLabels.map((label, index) => (
                                    <div className="y-label" key={index}>
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <div className="chart-bars">
                                {hourlyStats.length === 0 ? (
                                    <div className="no-data-message">데이터가 없습니다.</div>
                                ) : (
                                    hourlyStats.map((item, index) => (
                                        <div className="time-bar-group" key={index}>
                                            <div
                                                className="time-bar"
                                                style={{
                                                    height: `${
                                                        maxHourlyCount > 0 ? (item.count / maxHourlyCount) * 100 : 0
                                                    }%`,
                                                }}
                                                title={`${item.hour}: ${item.count}건`}
                                            >
                                                <span className="bar-value">{item.count}</span>
                                            </div>
                                            <div className="time-label">{item.hour.split('-')[0]}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {dataLoading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                        </div>
                    )}

                    <div className="stats-peak">
                        <span>가장 활발한 시간대</span>
                        <span>{peakHour}</span>
                    </div>
                </div>
            </div>

            {/* 낙상 사고 목록 */}
            <div className="room-management-content">
                <div className="room-list-section">
                    <div className="section-header">
                        <h2>낙상 사고 목록</h2>
                    </div>

                    <div className="data-table-container">
                        {incidents.length === 0 ? (
                            <div className="no-data-message">사고 데이터가 없습니다.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>사고 ID</th>
                                        <th>환자 정보</th>
                                        <th>발생 일시</th>
                                        <th>사고 여부</th>
                                        <th>병실</th>
                                        <th>상세정보</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidents.map((incident) => (
                                        <tr key={incident.accident_id}>
                                            <td>{incident.accident_id}</td>
                                            <td>
                                                {incident.patient_name} ({incident.patient_id})
                                            </td>
                                            <td>{new Date(incident.accident_date).toLocaleString('ko-KR')}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        incident.accident_YN === 'Y' ? '높음' : '정상'
                                                    }`}
                                                >
                                                    {incident.accident_YN === 'Y' ? '발생' : '미발생'}
                                                </span>
                                            </td>
                                            <td>
                                                {incident.room_name} ({incident.bed_num})
                                            </td>
                                            <td>
                                                <button className="link-button">상세정보</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FallIncidents;
