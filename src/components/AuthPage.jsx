import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/components/AuthPage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // TODO: 실제 로그인 로직 추가
        navigate('/dashboard');
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        // TODO: 실제 회원가입 로직 추가
        // 가입 후 로그인 탭으로 전환
        setIsLogin(true);
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <button type="button" className="home-button" onClick={() => navigate('/')}>
                    홈으로 이동
                </button>
                <h1>병원 안전 관리 시스템</h1>
                <p>로그인 또는 계정을 생성하세요</p>
                <div className="auth-tabs">
                    <button className={`auth-tab-button ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
                        로그인
                    </button>
                    <button className={`auth-tab-button ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
                        회원가입
                    </button>
                </div>
                {isLogin ? (
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>이메일</label>
                            <input type="email" placeholder="이메일을 입력하세요" required />
                        </div>
                        <div className="form-group">
                            <label>비밀번호</label>
                            <input type="password" placeholder="비밀번호를 입력하세요" required />
                        </div>
                        <button type="submit" className="submit-button">
                            로그인
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleSignUpSubmit}>
                        <div className="form-group">
                            <label>이름</label>
                            <input type="text" placeholder="이름을 입력하세요" required />
                        </div>
                        <div className="form-group">
                            <label>이메일</label>
                            <div className="input-with-button">
                                <input type="email" placeholder="이메일을 입력하세요" required />
                                <button type="button" className="check-button">
                                    중복확인
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>비밀번호</label>
                            <input type="password" placeholder="비밀번호를 입력하세요" required />
                        </div>
                        <div className="form-group">
                            <label>비밀번호 확인</label>
                            <input type="password" placeholder="비밀번호를 다시 입력하세요" required />
                        </div>
                        <button type="submit" className="submit-button">
                            회원가입
                        </button>
                    </form>
                )}
            </div>
            <div className="auth-right">
                <h2>환자 안전을 위한 지능형 모니터링 시스템</h2>
                <p>
                    인공지능 기반 낙상 감지, 실시간 환자 모니터링, 그리고 24시간 안전 관리 시스템으로 의료진과
                    보호자에게 신속한 알림을 제공합니다.
                </p>
                <ul className="features">
                    <li>AI 기반 낙상 감지 시스템</li>
                    <li>실시간 환경 모니터링</li>
                    <li>의료진과 보호자를 위한 즉각적인 알림</li>
                </ul>
                <div className="image-container">
                    <img src="/images/Doctors-rafiki.png" alt="의사 이미지" />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
