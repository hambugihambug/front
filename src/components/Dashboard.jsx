import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from './ui/card';
import StatsOverview from './dashboard/StatsOverview';
import ActiveAlerts from './dashboard/ActiveAlerts';
import FallsChart from './dashboard/FallsChart';
import RecentActivity from './dashboard/RecentActivity';
import RoomGrid from './dashboard/RoomGrid';
import '../styles/components/DashboardPage.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // 실제 백엔드 서버 주소로 변경

export default function Dashboard() {
    const navigate = useNavigate();
    const [fallStats, setFallStats] = useState({
        weeklyFalls: 0,
        weeklyChange: 0,
        riskPatients: 0,
        riskPercentage: 0,
        preventionRate: 0,
        preventionChange: 0,
    });

    useEffect(() => {
        fetchFallStats();
    }, []);

    const fetchFallStats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stats/falls`);
            console.log('낙상 통계 응답:', response.data); // 디버깅을 위한 로그 추가

            if (response.data.code === 0) {
                const data = response.data.data;
                setFallStats({
                    weeklyFalls: data.weekly_falls_count || 12, // 임시 기본값 설정
                    weeklyChange: data.weekly_falls_change || 2, // 임시 기본값 설정
                    riskPatients: data.risk_patients_count || 24, // 임시 기본값 설정
                    riskPercentage: data.risk_patients_percentage || 18.9, // 임시 기본값 설정
                    preventionRate: data.prevention_rate || 92.4, // 임시 기본값 설정
                    preventionChange: data.prevention_rate_change || 7.4, // 임시 기본값 설정
                });
            }
        } catch (error) {
            console.error('낙상 통계 데이터 조회 실패:', error);
            // 에러 발생 시에도 기본값 설정
            setFallStats({
                weeklyFalls: 12,
                weeklyChange: 2,
                riskPatients: 24,
                riskPercentage: 18.9,
                preventionRate: 92.4,
                preventionChange: 7.4,
            });
        }
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1 className="dashboard-title">스마트 케어 대시보드</h1>
                <p className="dashboard-subtitle">실시간 병원 모니터링 현황 및 정보를 확인하세요</p>
            </header>

            {/* 응급 알림 + 개요 통계 + 모니터링 + 사이드바 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* 좌측 3컬럼: 알림, 통계 개요, 모니터링 */}
                <div className="lg:col-span-3 space-y-6">
                    <ActiveAlerts />
                    <StatsOverview />
                    <Card>
                        <CardHeader>실시간 병실 모니터링</CardHeader>
                        <CardContent>
                            <RoomGrid />
                        </CardContent>
                    </Card>
                </div>

                {/* 우측 1컬럼: 최근 이벤트 */}
                <div className="space-y-4">
                    <Card>
                        <CardContent>
                            <RecentActivity />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 하단: 낙상 통계 + 활동 및 바로가기 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 좌측 3컬럼: 낙상 감지 통계 + 요약 카드 */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>낙상 감지 통계</CardHeader>
                        <CardContent>
                            <FallsChart />
                            <div className="falls-summary stats-grid">
                                <div className="stat-card">
                                    <p className="stat-title">이번주 낙상 사고</p>
                                    <p className="stat-value">{fallStats.weeklyFalls}건</p>
                                    <p
                                        className={`stat-change ${
                                            fallStats.weeklyChange >= 0 ? 'positive' : 'negative'
                                        }`}
                                    >
                                        전주 대비 {fallStats.weeklyChange > 0 ? '+' : ''}
                                        {fallStats.weeklyChange}건
                                    </p>
                                </div>
                                <div className="stat-card">
                                    <p className="stat-title">낙상 위험 환자</p>
                                    <p className="stat-value">{fallStats.riskPatients}명</p>
                                    <p className="stat-change">전체 환자의 {fallStats.riskPercentage}%</p>
                                </div>
                                <div className="stat-card">
                                    <p className="stat-title">예방 조치 이행률</p>
                                    <p className="stat-value">{fallStats.preventionRate}%</p>
                                    <p
                                        className={`stat-change ${
                                            fallStats.preventionChange >= 0 ? 'positive' : 'negative'
                                        }`}
                                    >
                                        목표 대비 {fallStats.preventionChange > 0 ? '+' : ''}
                                        {fallStats.preventionChange}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* 우측 1컬럼: 오늘의 활동은 상단 RecentEvents에서만 표시됩니다 */}
            </div>
        </div>
    );
}
