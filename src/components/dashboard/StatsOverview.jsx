import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Clock, Users, AlertTriangle, Activity } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

// 임시 데이터
const mockStats = {
    totalPatients: 137,
    highRiskPatients: 28,
    fallsThisMonth: 12,
    avgResponseTime: '2분 43초',
};

export default function StatsOverview() {
    const [data] = useState(mockStats);
    const [isLoading] = useState(false);

    const stats = [
        {
            name: '총 환자 수',
            value: data?.totalPatients,
            icon: Users,
        },
        {
            name: '낙상 위험 환자',
            value: data?.highRiskPatients,
            icon: AlertTriangle,
        },
        {
            name: '이번 달 낙상 횟수',
            value: data?.fallsThisMonth,
            icon: Activity,
        },
        {
            name: '평균 대응 시간',
            value: data?.avgResponseTime,
            icon: Clock,
        },
    ];

    return (
        <div className="pb-5 mt-2 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">개요</h3>
            <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="overflow-hidden shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center">
                                <div className="p-2 mr-2 rounded-full bg-blue-100">
                                    <stat.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-16 mt-1" />
                                    ) : (
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">
                                            {typeof stat.value === 'undefined' ? '—' : stat.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
