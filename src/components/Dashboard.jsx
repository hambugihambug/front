import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from './ui/card';
import StatsOverview from './dashboard/StatsOverview';
import ActiveAlerts from './dashboard/ActiveAlerts';
import FallsChart from './dashboard/FallsChart';
import RecentActivity from './dashboard/RecentActivity';
import RoomGrid from './dashboard/RoomGrid';
import '../styles/pages/DashboardPage.css';

export default function Dashboard() {
  const navigate = useNavigate();

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
                  <p className="stat-value">12건</p>
                  <p className="stat-change positive">전주 대비 +2건</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">낙상 위험 환자</p>
                  <p className="stat-value">24명</p>
                  <p className="stat-change">전체 환자의 18.9%</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">예방 조치 이행률</p>
                  <p className="stat-value">92.4%</p>
                  <p className="stat-change positive">목표 대비 +7.4%</p>
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
