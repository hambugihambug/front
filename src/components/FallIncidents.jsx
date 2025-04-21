import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FallIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '시간대별 낙상 사고 발생 현황',
            },
        },
    };

    // 낙상 사고 목록 조회
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fall-incidents');
                if (response.data.code === 0) {
                    setIncidents(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching incidents:', error);
            }
        };

        fetchIncidents();
    }, []);

    // 시간대별 통계 데이터 조회
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fall-incidents/stats');
                if (response.data.code === 0) {
                    setStatsData(response.data.data);

                    // 차트 데이터 설정
                    setChartData({
                        labels: response.data.data.map((item) => item.hour),
                        datasets: [
                            {
                                label: '낙상 사고 건수',
                                data: response.data.data.map((item) => item.count),
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                borderColor: 'rgb(53, 162, 235)',
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="fall-incidents-container" style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>낙상 사고 관리</h1>

            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    margin: '20px 0',
                }}
            >
                {/* 왼쪽: 사고 목록 */}
                <div
                    style={{
                        flex: '1',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    <h2 style={{ marginBottom: '15px' }}>낙상 사고 목록</h2>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>사고 ID</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>환자 정보</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>발생 일시</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>사고 여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((incident) => (
                                    <tr key={incident.accident_id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{incident.accident_id}</td>
                                        <td style={{ padding: '12px' }}>
                                            {incident.patient_name} ({incident.patient_id})
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {new Date(incident.accident_date).toLocaleString('ko-KR')}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {incident.accident_YN === 1 ? '발생' : '미발생'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 오른쪽: 그래프 */}
                <div
                    style={{
                        flex: '1',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    <h2 style={{ marginBottom: '15px' }}>시간대별 낙상 사고 발생 현황</h2>
                    <div style={{ height: '400px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FallIncidents;
