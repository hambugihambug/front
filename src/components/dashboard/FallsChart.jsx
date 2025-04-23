import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';

const API_BASE_URL = 'http://localhost:3001';

export default function FallsChart() {
    const [timeRange, setTimeRange] = useState('daily');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadChart() {
            setIsLoading(true);
            try {
                // fetch all incidents
                const res = await fetch(`${API_BASE_URL}/fall-incidents`);
                const json = await res.json();
                const all = json.data || [];
                let data = [];
                const now = new Date();
                if (timeRange === 'daily') {
                    // hourly stats via API
                    const r = await fetch(`${API_BASE_URL}/fall-incidents/stats`);
                    const js = await r.json();
                    data = js.data.map(d => ({ name: `${d.hour}`, fallsDetected: d.count }));
                } else if (timeRange === 'weekly') {
                    // fixed order Mon-Sun
                    const days = ['월','화','수','목','금','토','일'];
                    const counts = days.reduce((obj, day) => { obj[day] = 0; return obj; }, {});
                    all.filter(f => f.accident_YN === "Y").forEach(f => {
                        const d = new Date(f.accident_date);
                        const names = ['일','월','화','수','목','금','토'];
                        const key = names[d.getDay()];
                        if (counts[key] !== undefined) counts[key]++;
                    });
                    data = days.map(name => ({ name, fallsDetected: counts[name] }));
                } else if (timeRange === 'monthly') {
                    // group by week numbers for current month
                    const month = now.getMonth(), year=now.getFullYear();
                    const daysInMonth = new Date(year, month+1,0).getDate();
                    const weeks = Math.ceil(daysInMonth/7);
                    const counts = {};
                    for (let w=1;w<=weeks;w++) counts[`주${w}`]=0;
                    all.filter(f=>f.accident_YN==="Y").forEach(f=>{
                        const d = new Date(f.accident_date);
                        if (d.getMonth()===month && d.getFullYear()===year) {
                            const weekNum = Math.floor((d.getDate()-1)/7)+1;
                            counts[`주${weekNum}`]++;
                        }
                    });
                    data = Object.entries(counts).map(([name, fallsDetected])=>({ name, fallsDetected }));
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

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-lg font-medium">기간별 낙상 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {/* 기간 선택 탭 */}
                <div className="chart-tabs">
                    <button className={timeRange==='daily'?'btn-small tab active':'btn-small tab'} onClick={()=>setTimeRange('daily')}>일간</button>
                    <button className={timeRange==='weekly'?'btn-small tab active':'btn-small tab'} onClick={()=>setTimeRange('weekly')}>주간</button>
                    <button className={timeRange==='monthly'?'btn-small tab active':'btn-small tab'} onClick={()=>setTimeRange('monthly')}>월간</button>
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
                                <XAxis dataKey="name" />
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
