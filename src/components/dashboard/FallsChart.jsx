import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';

const API_BASE_URL = 'http://localhost:3000';

export default function FallsChart() {
    const [timeRange, setTimeRange] = useState('daily');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadChart() {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/fall-incidents`);
                const json = await res.json();
                const all = json.data || [];
                let data = [];
                const now = new Date();

                if (timeRange === 'daily') {
                    // 오늘 날짜에 해당되는 낙상사고만 필터링
                    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
                    const hourlyCounts = Array(24).fill(0); // 24시간 초기화

                    all.filter((f) => f.accident_YN === 'Y' && f.accident_date.startsWith(today)).forEach((f) => {
                        const hour = new Date(f.accident_date).getHours();
                        hourlyCounts[hour]++;
                    });

                    data = hourlyCounts.map((count, hour) => ({
                        name: `${hour}시`,
                        fallsDetected: count,
                    }));
                } else if (timeRange === 'weekly') {
                    // 현재 주차에 해당되는 낙상사고만 필터링
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // 월요일
                    startOfWeek.setHours(0, 0, 0, 0);

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6); // 일요일
                    endOfWeek.setHours(23, 59, 59, 999);

                    const days = ['월', '화', '수', '목', '금', '토', '일'];
                    const counts = days.reduce((obj, day) => {
                        obj[day] = 0;
                        return obj;
                    }, {});

                    all.filter((f) => {
                        const accidentDate = new Date(f.accident_date);
                        return f.accident_YN === 'Y' && accidentDate >= startOfWeek && accidentDate <= endOfWeek;
                    }).forEach((f) => {
                        const accidentDate = new Date(f.accident_date);
                        const dayName = days[accidentDate.getDay() - 1]; // 월요일부터 시작
                        if (counts[dayName] !== undefined) counts[dayName]++;
                    });

                    data = days.map((name) => ({ name, fallsDetected: counts[name] }));
                } else if (timeRange === 'monthly') {
                    // group by week numbers for current month
                    const month = now.getMonth(),
                        year = now.getFullYear();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const weeks = Math.ceil(daysInMonth / 7);
                    const counts = {};
                    for (let w = 1; w <= weeks; w++) counts[`주${w}`] = 0;
                    all.filter((f) => f.accident_YN === 'Y').forEach((f) => {
                        const d = new Date(f.accident_date);
                        if (d.getMonth() === month && d.getFullYear() === year) {
                            const weekNum = Math.floor((d.getDate() - 1) / 7) + 1;
                            counts[`주${weekNum}`]++;
                        }
                    });
                    data = Object.entries(counts).map(([name, fallsDetected]) => ({ name, fallsDetected }));
                }
                console.log('FallsChart 데이터:', data);
                setChartData(data);
            } catch (e) {
                console.error(e);
                setError(e);
            } finally {
                setIsLoading(false);
            }
        }
        loadChart();
    }, [timeRange]);

    // X축의 3시간 간격 ticks 생성
    const xAxisTicks = Array.from({ length: 9 }, (_, i) => i * 3); // [0, 3, 6, 9, 12, 15, 18, 21, 24]

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-lg font-medium">기간별 낙상 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {/* 기간 선택 탭 */}
                <div className="chart-tabs">
                    <button
                        className={timeRange === 'daily' ? 'btn-small tab active' : 'btn-small tab'}
                        onClick={() => setTimeRange('daily')}
                    >
                        일간
                    </button>
                    <button
                        className={timeRange === 'weekly' ? 'btn-small tab active' : 'btn-small tab'}
                        onClick={() => setTimeRange('weekly')}
                    >
                        주간
                    </button>
                    <button
                        className={timeRange === 'monthly' ? 'btn-small tab active' : 'btn-small tab'}
                        onClick={() => setTimeRange('monthly')}
                    >
                        월간
                    </button>
                </div>
            </CardContent>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center p-6 h-[300px]">
                        <Skeleton className="w-full h-[250px]" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center p-6 h-[300px]">
                        <p className="text-red-500">차트 로딩 오류</p>
                    </div>
                ) : (
                    <div className="h-[300px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" ticks={xAxisTicks} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="fallsDetected"
                                    name="낙상 감지"
                                    stroke="#f56565"
                                    strokeWidth={5}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
