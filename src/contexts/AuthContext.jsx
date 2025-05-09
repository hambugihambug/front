import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 초기화 시 로컬 스토리지에서 사용자 정보 확인
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('로컬 스토리지에서 사용자 정보 로드:', parsedUser);
            } catch (error) {
                console.error('로컬 스토리지 사용자 정보 파싱 오류:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        console.log('사용자 로그인:', userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        console.log('사용자 로그아웃');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!user,
                user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
