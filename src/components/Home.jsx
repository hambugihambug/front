import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Thermometer, Monitor } from 'lucide-react';
import axios from 'axios';
import '../styles/components/dashboard/Home.css';

const Home = () => {
    const [weather, setWeather] = useState({
        temperature: 'N/A',
        weather: ' 로딩중...',
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get('http://localhost:3000/weather');
                setWeather(response.data.data);
            } catch (error) {
                console.error('날씨 정보 조회 실패:', error);
                setWeather({
                    temperature: 'N/A',
                    weather: '🌈 날씨 정보 없음',
                });
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // 10분마다 갱신
        return () => clearInterval(interval);
    }, []);

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
            <div className="home-header">
                <div>
                    <h1 className="home-title">병원 모니터링 시스템</h1>
                    <p className="home-subtitle">
                        환영합니다. 이 시스템은 환자의 낙상 사고를 감지하고 환경을 모니터링합니다.
                    </p>
                </div>
                <div className="weather-widget">
                    <span className="temperature">{weather.temperature}</span>
                    <span className="weather">{weather.weather}</span>
                </div>
            </div>
            <div className="home-card-grid">
                {cards.map((card) => (
                    <NavLink to={card.link} key={card.title} className="home-card">
                        <div className="home-card-icon" style={{ backgroundColor: card.iconBg }}>
                            <card.icon size={24} color={card.iconColor} />
                        </div>
                        <h3 className="home-card-title">{card.title}</h3>
                        <p className="home-card-desc">{card.desc}</p>
                        <span className="home-card-link">{card.linkLabel} →</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Home;
