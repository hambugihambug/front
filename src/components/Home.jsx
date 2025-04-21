import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Thermometer, Monitor } from 'lucide-react';
import '../styles/components/dashboard/Home.css';

const Home = () => {
    const cards = [
        {
            title: '낙상 감지',
            desc: 'AI 기술을 활용한 실시간 환자 낙상 감지 시스템입니다.',
            icon: Monitor,
            iconBg: '#E0F2FE',
            iconColor: '#0284C7',
            link: '/fall-incidents',
            linkLabel: '낙상 감지 페이지',
        },
        {
            title: '대시보드',
            desc: '병원 전체 현황과 환자 상태를 모니터링하는 대시보드입니다.',
            icon: LayoutDashboard,
            iconBg: '#F5F3FF',
            iconColor: '#7C3AED',
            link: '/dashboard',
            linkLabel: '대시보드 확인',
        },
        {
            title: '환자 안전 대시보드',
            desc: '애니메이션 환자 안전 지표와 활동 수준을 표시합니다.',
            icon: Activity,
            iconBg: '#FEF2FF',
            iconColor: '#D946EF',
            link: '/patients',
            linkLabel: '안전 대시보드',
        },
        {
            title: '환경 모니터링',
            desc: '병실 환경을 모니터링하고 이상 상황을 감지합니다.',
            icon: Thermometer,
            iconBg: '#ECFDF5',
            iconColor: '#22C55E',
            link: '/environmental',
            linkLabel: '환경 모니터링',
        },
    ];

    return (
        <div className="dashboard-home-container">
            <h1 className="home-title">병원 모니터링 시스템</h1>
            <p className="home-subtitle">환영합니다. 이 시스템은 환자의 낙상 사고를 감지하고 환경을 모니터링합니다.</p>
            <div className="home-card-grid">
                {cards.map((c) => (
                    <NavLink to={c.link} key={c.title} className="home-card">
                        <div className="home-card-icon" style={{ backgroundColor: c.iconBg }}>
                            <c.icon size={24} color={c.iconColor} />
                        </div>
                        <h3 className="home-card-title">{c.title}</h3>
                        <p className="home-card-desc">{c.desc}</p>
                        <span className="home-card-link">{c.linkLabel} →</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Home;
