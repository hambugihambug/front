import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Thermometer, Droplets, PenSquare, Users, AlertTriangle, Clock } from 'lucide-react';
import {
    Box,
    Tabs,
    Tab,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    Pagination,
    Button,
    Divider,
} from '@mui/material';
import RiskDistributionChart from './dashboard/RiskDistributionChart';

const API_BASE_URL = 'http://localhost:3000';

const RoomManagement = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [activeTab, setActiveTab] = useState('상세정보');
    // 페이지 네비게이션
    const [currentPage, setCurrentPage] = useState(0);

    // 통계 데이터 (실제로는 API에서 가져와야 함)
    const [stats] = useState({
        totalBeds: {
            value: '150개',
            description: '전체 병상',
        },
        occupiedBeds: {
            value: '127개',
            description: '사용 중인 병상',
            change: '85%',
        },
        alerts: {
            value: '3건',
            description: '현재 경고',
            change: '+1건',
        },
        temperature: {
            value: '2실',
            description: '온도 주의',
        },
    });

    // 선택층 변경 시 페이지 초기화
    useEffect(() => {
        fetchRooms();
        setCurrentPage(0);
    }, [selectedFloor]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/rooms`);
            setRooms(response.data);
            setError(null);
        } catch (err) {
            setError('병실 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomDetail = async (roomName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${roomName}`);
            if (response.data.code === 0) {
                setSelectedRoom(response.data.data);
            } else {
                setError('병실 정보를 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('Error fetching room details:', err);
            setError('병실 정보를 불러오는데 실패했습니다.');
        }
    };

    const groupRoomsByFloor = () => {
        const grouped = {};
        rooms.forEach((room) => {
            const floorMatch = room.room_name.match(/^(\d+)/);
            const floor = floorMatch ? floorMatch[1][0] : '1';
            if (!grouped[floor]) {
                grouped[floor] = [];
            }
            grouped[floor].push(room);
        });
        return grouped;
    };

    const getRoomStatus = (room_temp) => {
        if (room_temp >= 28) return '높음';
        if (room_temp >= 26) return '중간';
        return '정상';
    };

    const floorRooms = groupRoomsByFloor();
    const floors = Object.keys(floorRooms).sort();
    // 현재 선택층의 모든 방, 페이징 계산
    const roomsOnFloor = floorRooms[selectedFloor] || [];
    const roomsPerPage = 4;
    const totalPages = Math.ceil(roomsOnFloor.length / roomsPerPage) || 1;
    const paginatedRooms = roomsOnFloor.slice(
        currentPage * roomsPerPage,
        currentPage * roomsPerPage + roomsPerPage
    );

    // 병실 클릭 핸들러 수정
    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        fetchRoomDetail(room.room_name);
    };

    const handleDetailClick = (roomName) => {
        navigate(`/rooms/${roomName}`);
    };

    if (loading) {
        return <div className="loading-text">병실 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    return (
        <Box p={3} bgcolor="#f8fafc" minHeight="100vh">
            {/* 헤더 */}
            <Typography variant="h4" gutterBottom fontWeight={600}>병실 관리</Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>병실 정보 및 환자 현황을 관리하세요</Typography>

            {/* 층별 탭 */}
            <Box mb={3}>
                <Tabs
                    value={selectedFloor}
                    onChange={(e, v) => { setSelectedFloor(v); setCurrentPage(0); }}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {floors.map((floor) => (
                        <Tab key={floor} label={`${floor}층`} value={floor} />
                    ))}
                </Tabs>
            </Box>

            {/* 병실 그리드 */}
            <Grid container spacing={2}>
                {paginatedRooms.map((room) => {
                    const status = getRoomStatus(room.room_temp);
                    const colorMap = { 정상: 'success', 중간: 'warning', 높음: 'error' };
                    return (
                        <Grid key={room.room_name} item xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader
                                    title={`${room.room_name}호`}
                                    action={<Chip label={status} color={colorMap[status]} size="small" />}
                                />
                                <Divider />
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Box display="flex" alignItems="center">
                                            <Thermometer size={18} />
                                            <Typography variant="body2" ml={1}>{room.room_temp}°C</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Droplets size={18} />
                                            <Typography variant="body2" ml={1}>{room.room_humidity}%</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Users size={18} />
                                        <Typography variant="body2" ml={1}>환자: {room.current_patients || 0}명</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={(e, p) => setCurrentPage(p - 1)}
                        color="primary"
                    />
                </Box>
            )}

            {/* 낙상 통계 차트 */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom fontWeight={600}>낙상 감지 통계</Typography>
                <RiskDistributionChart />
            </Box>
        </Box>
    );
};

export default RoomManagement;
