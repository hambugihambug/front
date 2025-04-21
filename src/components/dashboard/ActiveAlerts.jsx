import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle } from 'lucide-react';

// 임시 데이터
const mockAlerts = [
    {
        id: 1,
        patientName: '김영희',
        room: '302',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        status: 'detected',
        confidence: 0.92,
    },
    {
        id: 2,
        patientName: '박지민',
        room: '201',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'responding',
        confidence: 0.88,
    },
];

export default function ActiveAlerts() {
    const [alerts, setAlerts] = useState(mockAlerts);
    const [isLoading] = useState(false);
    const [error] = useState(null);

    const handleRespondClick = (id) => {
        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) => (alert.id === id ? { ...alert, status: 'responding' } : alert))
        );
    };

    const handleResolveClick = (id) => {
        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) => (alert.id === id ? { ...alert, status: 'resolved' } : alert))
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'detected':
                return 'text-red-600';
            case 'responding':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'detected':
                return '즉시 조치 필요';
            case 'responding':
                return '조치 중';
            case 'resolved':
                return '해결됨';
            default:
                return '알 수 없음';
        }
    };

    return (
        <div className="py-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">활성 알림</h2>
                <Badge variant="destructive" className="text-sm">
                    {alerts.length}개 활성
                </Badge>
            </div>

            {isLoading ? (
                <div className="py-8 text-center">
                    <p className="text-gray-500">알림 로딩 중...</p>
                </div>
            ) : error ? (
                <div className="py-8 text-center">
                    <p className="text-red-500">알림 로딩 오류</p>
                </div>
            ) : alerts.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-md shadow-sm">
                    <p className="text-gray-500">현재 활성화된 낙상 알림이 없습니다.</p>
                </div>
            ) : (
                <div className="grid gap-4 mt-2 sm:grid-cols-1 lg:grid-cols-2">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className="border-l-4 border-red-500">
                            <CardContent className="p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-500">낙상 감지</h3>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p>
                                                환자: <span className="font-medium">{alert.patientName}</span>
                                            </p>
                                            <p>
                                                병실: <span className="font-medium">{alert.room}</span>
                                            </p>
                                            <p>
                                                시간:{' '}
                                                <span className="font-medium">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </span>
                                            </p>
                                            <p>
                                                상태:{' '}
                                                <span className={`font-medium ${getStatusColor(alert.status)}`}>
                                                    {getStatusText(alert.status)}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex space-x-3">
                                                <Button variant="outline" size="sm">
                                                    상세 보기
                                                </Button>
                                                {alert.status === 'detected' ? (
                                                    <Button
                                                        onClick={() => handleRespondClick(alert.id)}
                                                        variant="default"
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        조치 시작
                                                    </Button>
                                                ) : alert.status === 'responding' ? (
                                                    <Button
                                                        onClick={() => handleResolveClick(alert.id)}
                                                        variant="default"
                                                        size="sm"
                                                        className="bg-yellow-500 hover:bg-yellow-600"
                                                    >
                                                        해결 완료
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
