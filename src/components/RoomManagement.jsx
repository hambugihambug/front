import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/rooms`);
            setRooms(response.data);
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setError('병실 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    if (loading) {
        return <div className="text-center text-lg font-medium">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center font-semibold">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">병실 관리</h1>
            <div className="card border p-4 rounded shadow">
                <div className="card-header mb-4">
                    <h2 className="card-title text-xl font-semibold">병실 목록</h2>
                </div>
                <div className="card-content">
                    <div className="overflow-x-auto">
                        <table className="data-table w-full border text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">병실 이름</th>
                                    <th className="p-2 border">병실 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.room_id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{room.room_id}</td>
                                        <td className="p-2 border">{room.room_name}</td>
                                        <td className="p-2 border">{room.room_status}</td>
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

export default RoomManagement;
