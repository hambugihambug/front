import React, { useState, useEffect } from 'react';
import { Thermometer, Droplet, Users } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import '../../styles/components/DashboardPage.css';

const API_BASE_URL = 'http://localhost:3000';

export default function RoomGrid() {
    const [roomsEnv, setRoomsEnv] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function loadData() {
            try {
                const [envRes, patRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/environmental`).then((r) => r.json()),
                    fetch(`${API_BASE_URL}/patients`).then((r) => r.json()),
                ]);
                setRoomsEnv(envRes.data || []);
                setPatients(patRes.data || []);
                if (envRes.data && envRes.data.length) {
                    const floors = Array.from(new Set(envRes.data.map((r) => Math.floor(parseInt(r.room_name) / 100))));
                    setSelectedFloor(floors[0]);
                    setCurrentPage(0);
                }
            } catch (err) {
                console.error('RoomGrid load error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <p>로딩 중...</p>;
    }
    if (error) {
        return <p className="text-red-500">병실 모니터링 로드 실패</p>;
    }

    const roomCards = roomsEnv.map((r) => ({
        roomId: r.room_id,
        roomName: r.room_name,
        status: r.status,
        temperature: `${r.room_temp}°C`,
        humidity: `${r.humidity}%`,
        patients: parseInt(r.occupied_beds) || 0,
    }));
    const floors = Array.from(new Set(roomsEnv.map((r) => Math.floor(parseInt(r.room_name) / 100))));
    const floorCards = roomCards.filter((c) => Math.floor(parseInt(c.roomName) / 100) === selectedFloor);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(floorCards.length / itemsPerPage) || 1;
    const paginatedCards = floorCards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const isSingle = paginatedCards.length === 1;

    return (
        <div>
            <div className="floor-tabs">
                {floors.map((floor) => (
                    <button
                        key={floor}
                        className={`floor-tab ${floor === selectedFloor ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedFloor(floor);
                            setCurrentPage(0);
                        }}
                    >
                        {floor}층
                    </button>
                ))}
            </div>
            <div className={`room-grid${isSingle ? ' single' : ''}`}>
                {paginatedCards.map((card) => (
                    <div key={card.roomId} className="room-card">
                        <div className="room-header">
                            <h3 className="room-name">{card.roomName}</h3>
                            <span className={`status-badge ${card.status}`}>{card.status}</span>
                        </div>
                        <div className="room-info">
                            <div className="info-row">
                                <Thermometer size={16} />
                                <span>{card.temperature}</span>
                            </div>
                            <div className="info-row">
                                <Droplet size={16} />
                                <span>{card.humidity}</span>
                            </div>
                            <div className="info-row">
                                <Users size={16} />
                                <span>{card.patients}명</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls" style={{ marginTop: '12px', textAlign: 'center' }}>
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    className="btn-small mr-2"
                >
                    이전
                </button>
                <span>
                    {currentPage + 1} / {totalPages}
                </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                    className="btn-small ml-2"
                >
                    다음
                </button>
            </div>
        </div>
    );
}
