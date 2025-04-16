import { useState } from 'react';
import { Shield, UserPlus, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

// 임시 데이터
const mockActivities = [
    {
        id: 1,
        type: 'fall_alert',
        description: '<strong>김영희</strong> 환자의 낙상이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        patientId: 101,
        patientName: '김영희',
        room: '302',
        status: 'detected',
    },
    {
        id: 2,
        type: 'patient_added',
        description: '<strong>이철수</strong> 환자가 등록되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        patientId: 102,
        patientName: '이철수',
    },
    {
        id: 3,
        type: 'risk_updated',
        description: '<strong>박지민</strong> 환자의 낙상 위험도가 <strong>높음</strong>으로 변경되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        patientId: 103,
        patientName: '박지민',
    },
    {
        id: 4,
        type: 'fall_alert',
        description: '<strong>최재현</strong> 환자의 낙상이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        patientId: 104,
        patientName: '최재현',
        room: '201',
        status: 'resolved',
    },
    {
        id: 5,
        type: 'patient_added',
        description: '<strong>정다혜</strong> 환자가 등록되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        patientId: 105,
        patientName: '정다혜',
    },
];

export default function RecentActivity() {
    const [activities] = useState(mockActivities);
    const [isLoading] = useState(false);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'fall_alert':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-8 ring-white">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                );
            case 'patient_added':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full ring-8 ring-white">
                        <UserPlus className="w-6 h-6 text-green-600" />
                    </div>
                );
            case 'risk_updated':
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full ring-8 ring-white">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full ring-8 ring-white">
                        <Shield className="w-6 h-6 text-gray-600" />
                    </div>
                );
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays === 1) return '어제';
        return `${diffDays}일 전`;
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">최근 활동</h3>
            <div className="flow-root mt-2">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex space-x-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="w-full h-4 mb-2" />
                                    <Skeleton className="w-1/3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="-mb-8">
                        {activities.slice(0, 5).map((activity, activityIdx) => (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {activityIdx !== activities.length - 1 ? (
                                        <span
                                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                    <div className="relative flex items-start space-x-3">
                                        <div className="relative">{getActivityIcon(activity.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-gray-500">
                                                <span dangerouslySetInnerHTML={{ __html: activity.description }} />
                                                {activity.room && (
                                                    <span className="whitespace-nowrap"> - {activity.room}호실</span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {formatTime(activity.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-6">
                <Button variant="outline" className="w-full">
                    모두 보기
                </Button>
            </div>
        </div>
    );
}
