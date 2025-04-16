import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // 더미 알림 데이터
    const mockNotifications = [
        {
            id: 1,
            type: 'fall',
            title: '낙상 감지',
            message: '김영희 환자(103호)가 낙상한 것으로 감지되었습니다.',
            timestamp: '2025-04-11T06:23:15',
            isRead: false,
        },
        {
            id: 2,
            type: 'environmental',
            title: '실내 온도 이상',
            message: '203호 온도가 29.1°C로 적정 범위(20-26°C)를 초과했습니다.',
            timestamp: '2025-04-11T05:12:43',
            isRead: true,
        },
        {
            id: 3,
            type: 'fall',
            title: '낙상 감지',
            message: '박지민 환자(302호)가 낙상한 것으로 감지되었습니다.',
            timestamp: '2025-04-10T22:15:43',
            isRead: true,
        },
        {
            id: 4,
            type: 'environmental',
            title: '실내 습도 이상',
            message: '302호 습도가 35%로 적정 범위(40-60%) 미만입니다.',
            timestamp: '2025-04-10T17:22:10',
            isRead: true,
        },
        {
            id: 5,
            type: 'fall',
            title: '낙상 감지',
            message: '정민준 환자(110호)가 낙상한 것으로 감지되었습니다.',
            timestamp: '2025-04-10T15:47:22',
            isRead: true,
        },
    ];

    useEffect(() => {
        const loadNotifications = () => {
            try {
                setLoading(true);
                setNotifications(mockNotifications);

                // 브라우저 알림 권한 확인
                const permissionStatus = checkNotificationPermission();
                setNotificationsEnabled(permissionStatus === 'granted');
            } catch (error) {
                console.error('Error loading notifications:', error);
                setError('알림 데이터를 로드하는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const checkNotificationPermission = () => {
        if (!('Notification' in window)) {
            console.warn('이 브라우저는 알림을 지원하지 않습니다.');
            return 'notSupported';
        }
        return Notification.permission;
    };

    const handleEnableNotifications = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    setNotificationsEnabled(true);
                    alert('알림이 성공적으로 활성화되었습니다.');
                } else {
                    alert('알림 권한이 거부되었습니다.');
                }
            });
        }
    };

    const handleDisableNotifications = () => {
        setNotificationsEnabled(false);
        alert('알림이 비활성화되었습니다.');
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter((notif) => notif.id !== id));
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}일 전`;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>알림 데이터 로딩 중...</p>
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
            <h1>알림</h1>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">알림 설정</h2>
                </div>
                <div className="card-content">
                    <p className="notification-status">
                        현재 상태: <strong>{notificationsEnabled ? '활성화됨' : '비활성화됨'}</strong>
                    </p>

                    <div className="notification-actions">
                        {notificationsEnabled ? (
                            <button className="btn btn-danger" onClick={handleDisableNotifications}>
                                알림 비활성화
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleEnableNotifications}>
                                알림 활성화
                            </button>
                        )}
                    </div>

                    <div className="notification-info">
                        <p>
                            <strong>알림 유형:</strong>
                        </p>
                        <ul>
                            <li>낙상 감지 - 환자가 낙상했을 때 즉시 알림</li>
                            <li>환경 이상 - 병실 온도 또는 습도가 적정 범위를 벗어났을 때 알림</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">알림 기록</h2>
                    <button
                        className="btn btn-small"
                        onClick={markAllAsRead}
                        disabled={notifications.every((n) => n.isRead)}
                    >
                        모두 읽음으로 표시
                    </button>
                </div>
                <div className="card-content">
                    {notifications.length === 0 ? (
                        <p>알림이 없습니다.</p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.isRead ? 'notification-unread' : ''}`}
                                >
                                    <div
                                        className={`notification-icon ${
                                            notification.type === 'fall'
                                                ? 'notification-fall'
                                                : 'notification-environmental'
                                        }`}
                                    >
                                        {notification.type === 'fall' ? '!' : '🌡️'}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                            {!notification.isRead && (
                                                <span className="notification-badge">새 알림</span>
                                            )}
                                        </div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{getTimeAgo(notification.timestamp)}</div>
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.isRead && (
                                            <button
                                                className="btn btn-small"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                읽음
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-small btn-danger"
                                            onClick={() => deleteNotification(notification.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
