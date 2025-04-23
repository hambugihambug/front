import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

export default function ActiveAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAlerts() {
            try {
                const res = await fetch(`${API_BASE_URL}/fall-incidents`);
                const json = await res.json();
                const data = json.data || [];
                const active = data
                    .filter(a => a.accident_YN === "Y")
                    .map(a => ({
                        id: a.accident_id,
                        patientName: a.patient_name,
                        timestamp: a.accident_date,
                        status: 'detected',
                    }));
                setAlerts(active);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        loadAlerts();
    }, []);

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
                <div className="flex items-center space-x-2">
                    <Badge variant="destructive" className="text-sm">
                        {alerts.length}개 활성
                    </Badge>
                    <button
                        style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer' }}
                        onClick={() => setExpanded(e => !e)}
                    >
                        {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                </div>
            </div>
            {isLoading && <p className="text-gray-500">알림 로딩 중...</p>}
            {error && <p className="text-red-500">알림 로딩 오류</p>}
            {!isLoading && !error && alerts.length === 0 && (
                <p className="text-gray-500">현재 활성화된 낙상 알림이 없습니다.</p>
            )}
            {!isLoading && !error && alerts.length > 0 && (
                <>
                <div className="grid gap-4 mt-2 sm:grid-cols-1 lg:grid-cols-2">
                    { (expanded ? alerts : alerts.slice(0,2)).map(alert => (
                        <Card key={alert.id} className="border-l-4 border-red-500">
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-red-500">낙상 감지</p>
                                        <p className="text-sm">환자: {alert.patientName}</p>
                                        <p className="text-sm">시간: {new Date(alert.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                </>
            )}
        </div>
    );
}
