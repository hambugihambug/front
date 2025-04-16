import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// 임시 데이터
const mockWeekData = [
    { name: '월', fallsDetected: 2 },
    { name: '화', fallsDetected: 1 },
    { name: '수', fallsDetected: 3 },
    { name: '목', fallsDetected: 0 },
    { name: '금', fallsDetected: 2 },
    { name: '토', fallsDetected: 1 },
    { name: '일', fallsDetected: 0 },
];

const mockMonthData = [
    { name: '1주', fallsDetected: 8 },
    { name: '2주', fallsDetected: 6 },
    { name: '3주', fallsDetected: 10 },
    { name: '4주', fallsDetected: 9 },
];

const mockYearData = [
    { name: '1월', fallsDetected: 30 },
    { name: '2월', fallsDetected: 28 },
    { name: '3월', fallsDetected: 32 },
    { name: '4월', fallsDetected: 25 },
    { name: '5월', fallsDetected: 22 },
    { name: '6월', fallsDetected: 18 },
    { name: '7월', fallsDetected: 20 },
    { name: '8월', fallsDetected: 15 },
    { name: '9월', fallsDetected: 22 },
    { name: '10월', fallsDetected: 26 },
    { name: '11월', fallsDetected: 30 },
    { name: '12월', fallsDetected: 32 },
];

export default function FallsChart() {
    const [timeRange, setTimeRange] = useState('year');
    const [isLoading] = useState(false); // 로딩 상태 관리

    // 시간 범위에 따라 다른 데이터 사용
    const getData = (range) => {
        switch (range) {
            case 'week':
                return mockWeekData;
            case 'month':
                return mockMonthData;
            case 'year':
            default:
                return mockYearData;
        }
    };

    const data = getData(timeRange);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">기간별 낙상 현황</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">이번 주</SelectItem>
                        <SelectItem value="month">이번 달</SelectItem>
                        <SelectItem value="year">올해</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center p-6 h-[300px]">
                        <Skeleton className="w-full h-[250px]" />
                    </div>
                ) : data ? (
                    <div className="h-[300px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="fallsDetected"
                                    name="낙상 감지"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
