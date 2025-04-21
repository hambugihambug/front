import React, { useState } from 'react';
import { Bell, Search, Filter, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp, BellRing } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'alert',
            title: '낙상 감지',
            message: '301호실에서 낙상이 감지되었습니다.',
            time: '10:23',
            read: false,
        },
        {
            id: 2,
            type: 'info',
            title: '환자 상태 변경',
            message: '김민수 환자의 상태가 정상으로 변경되었습니다.',
            time: '09:45',
            read: true,
        },
        {
            id: 3,
            type: 'alert',
            title: '환경 알림',
            message: '302호실의 온도가 28°C를 초과했습니다.',
            time: '09:30',
            read: false,
        },
        {
            id: 4,
            type: 'info',
            title: '의료진 호출',
            message: '303호실에서 의료진 호출이 있었습니다.',
            time: '08:15',
            read: true,
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedNotifications = React.useMemo(() => {
        if (!sortConfig.key) return notifications;
        return [...notifications].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [notifications, sortConfig]);

    const filteredNotifications = sortedNotifications.filter(
        (notification) =>
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="dashboard-container">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* 헤더 섹션 */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 className="dashboard-title">알림 관리</h1>
                    <p className="dashboard-subtitle">모든 알림을 한 곳에서 관리하세요</p>
                </div>

                {/* 통계 카드 */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <BellRing size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>전체 알림</h3>
                            <p className="stat-value">{notifications.length}개</p>
                            <p className="stat-description">오늘의 알림</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>읽지 않은 알림</h3>
                            <p className="stat-value">{unreadCount}개</p>
                            <p className="stat-change">{unreadCount > 0 ? '확인이 필요합니다' : '모두 확인했습니다'}</p>
                        </div>
                    </div>
                </div>

                {/* 알림 목록 섹션 */}
                <div className="room-detail-section" style={{ marginTop: '24px' }}>
                    <div className="section-header">
                        <h2>알림 목록</h2>
                        <div className="header-actions">
                            <button className="action-button">
                                <Bell size={16} />
                                <span>모두 읽음 처리</span>
                            </button>
                        </div>
                    </div>

                    {/* 검색 및 필터 */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8',
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="알림 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 40px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#64748b',
                                    backgroundColor: 'white',
                                }}
                            >
                                <Filter size={20} />
                                필터
                            </button>
                        </div>
                    </div>

                    {/* 알림 테이블 */}
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>상태</th>
                                    <th
                                        style={{ width: '120px', cursor: 'pointer' }}
                                        onClick={() => handleSort('time')}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            시간
                                            {sortConfig.key === 'time' &&
                                                (sortConfig.direction === 'ascending' ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                ))}
                                        </div>
                                    </th>
                                    <th style={{ width: '200px' }}>제목</th>
                                    <th>내용</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNotifications.map((notification) => (
                                    <tr
                                        key={notification.id}
                                        style={{
                                            backgroundColor: !notification.read ? '#f8fafc' : 'white',
                                        }}
                                    >
                                        <td>
                                            {notification.type === 'alert' ? (
                                                <AlertCircle size={20} color="#ef4444" />
                                            ) : (
                                                <CheckCircle2 size={20} color="#22c55e" />
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={16} color="#64748b" />
                                                <span>{notification.time}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: !notification.read ? '500' : '400' }}>
                                            {notification.title}
                                        </td>
                                        <td>{notification.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
