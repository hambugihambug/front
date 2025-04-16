import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { path: '/', label: '대시보드' },
    { path: '/patients', label: '환자 관리' },
    { path: '/rooms', label: '병실 관리' },
    { path: '/beds', label: '병상 관리' },
    { path: '/fall-incidents', label: '낙상 사고' },
    { path: '/environmental', label: '환경 데이터' },
    { path: '/notifications', label: '알림' },
];

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">병원 모니터링 시스템</div>
            <ul className="navbar-menu">
                {navItems.map((item) => (
                    <li key={item.path} className="navbar-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
