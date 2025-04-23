import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, Label } from 'recharts';

// 임시 데이터 유지
const mockData = [
    { name: '낮음', value: 65, color: '#10B981' }, // 초록
    { name: '중간', value: 45, color: '#F59E0B' }, // 노랑
    { name: '높음', value: 27, color: '#EF4444' }, // 빨강
];

export default function RiskDistributionChart() {
    const [data] = useState(mockData);
    const isLoading = false;
    const error = null;

    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    // 데이터 총합 계산
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardHeader
                title={<Typography variant="h5" fontWeight={500}>환자 위험도 분포</Typography>}
            />
            <CardContent>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, p: 2 }}>
                        <Skeleton variant="rectangular" width="100%" height={250} />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, p: 2 }}>
                        <Typography color="error">차트 데이터 로딩 오류</Typography>
                    </Box>
                ) : data ? (
                    <Box sx={{ height: 300, position: 'relative', p: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    isAnimationActive={true}
                                    labelLine={false}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color || COLORS[index % COLORS.length]}
                                            stroke="#fff"
                                            strokeWidth={2}
                                        />
                                    ))}
                                    {/* 중앙 레이블 */}
                                    <Label
                                        value={`${total}명`}
                                        position="center"
                                        fill="#374151"
                                        fontSize={24}
                                        fontWeight={500}
                                    />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}명`, '환자 수']}
                                />
                                {/* 수직 범례를 차트 오른쪽에 배치 */}
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    iconSize={14}
                                    wrapperStyle={{ right: -20, top: '20%' }}
                                    formatter={(value) => <Typography variant="body1">{value}</Typography>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                ) : null}
            </CardContent>
        </Card>
    );
}
