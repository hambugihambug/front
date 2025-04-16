import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Skeleton } from '../ui/skeleton';

// 임시 데이터 유지
const mockData = [
    { name: '낮음', value: 65, color: '#10B981' }, // 초록
    { name: '중간', value: 45, color: '#F59E0B' }, // 노랑
    { name: '높음', value: 27, color: '#EF4444' }, // 빨강
];

export default function RiskDistributionChart() {
    const [data] = useState(mockData);
    const [isLoading] = useState(false);
    const [error] = useState(null);

    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">환자 위험도 분포</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center p-6 h-[300px]">
                        <Skeleton className="w-full h-[250px]" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center p-6 h-[300px]">
                        <p className="text-red-500">차트 데이터 로딩 오류</p>
                    </div>
                ) : data ? (
                    <div className="h-[300px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color || COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, '환자 수']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
