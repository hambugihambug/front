import React, { useState, useEffect } from 'react';
import '../styles/components/schedule.css';

const Schedule = () => {
    const [schedules, setSchedules] = useState([{}, {}]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [newSchedule, setNewSchedule] = useState({
        title: '',
        date: '',
        time: '',
        type: '',
        description: '',
    });

    // 달력 관련 함수들
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 달력 날짜 배열 생성
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', isCurrentMonth: false });
        }

        // 현재 달의 날짜들
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
            const daySchedules = schedules.filter((schedule) => schedule.date === dateStr);
            days.push({
                day: i,
                isCurrentMonth: true,
                schedules: daySchedules,
                date: dateStr,
            });
        }

        return days;
    };

    // 월 이동 함수
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleAddSchedule = () => {
        if (selectedSchedule) {
            // 수정
            setSchedules(
                schedules.map((schedule) =>
                    schedule.id === selectedSchedule.id ? { ...newSchedule, id: schedule.id } : schedule
                )
            );
        } else {
            // 추가
            setSchedules([...schedules, { ...newSchedule, id: Date.now() }]);
        }
        handleCloseDialog();
    };

    const handleDeleteSchedule = (id) => {
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
    };

    const handleOpenDialog = (schedule = null) => {
        if (schedule) {
            setSelectedSchedule(schedule);
            setNewSchedule(schedule);
        } else {
            setSelectedSchedule(null);
            setNewSchedule({
                title: '',
                date: '',
                time: '',
                type: '',
                description: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedSchedule(null);
        setNewSchedule({
            title: '',
            date: '',
            time: '',
            type: '',
            description: '',
        });
    };

    return (
        <div className="schedule-container">
            <div className="calendar-header">
                <h1 className="schedule-title">일정 관리</h1>
                <div className="calendar-nav">
                    <button onClick={handlePrevMonth}>&lt;</button>
                    <h2>
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </h2>
                    <button onClick={handleNextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar">
                <div className="calendar-weekdays">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                        <div key={day} className="calendar-weekday">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar-days">
                    {generateCalendarDays().map((dayData, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${dayData.isCurrentMonth ? 'current' : 'other'}`}
                            style={{ height: '120px' }}
                        >
                            <div className="day-header">
                                <span className="day-number">{dayData.day}</span>
                                {dayData.isCurrentMonth && (
                                    <button
                                        className="add-schedule-btn"
                                        onClick={() => {
                                            setNewSchedule({
                                                ...newSchedule,
                                                date: dayData.date,
                                            });
                                            handleOpenDialog();
                                        }}
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                            <div
                                className="day-schedules"
                                style={{ maxHeight: 'calc(100% - 30px)', overflowY: 'auto' }}
                            >
                                {dayData.schedules?.map((schedule) => (
                                    <div key={schedule.id} className="day-schedule">
                                        <span className="schedule-time">{schedule.time}</span>
                                        <span className="schedule-title">{schedule.title}</span>
                                        <div className="schedule-actions">
                                            <button onClick={() => handleOpenDialog(schedule)}>✏️</button>
                                            <button onClick={() => handleDeleteSchedule(schedule.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isDialogOpen && (
                <div className="dialog-overlay" onClick={handleCloseDialog}>
                    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h2 className="dialog-title">{selectedSchedule ? '일정 수정' : '새 일정'}</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">제목</label>
                            <input
                                className="form-input"
                                value={newSchedule.title}
                                onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                            />
                        </div>
                        <div className="time-inputs">
                            <div className="form-group">
                                <label className="form-label">날짜</label>
                                <input
                                    className="form-input"
                                    type="date"
                                    value={newSchedule.date}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">시간</label>
                                <input
                                    className="form-input"
                                    type="time"
                                    value={newSchedule.time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">유형</label>
                            <select
                                className="form-select"
                                value={newSchedule.type}
                                onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                            >
                                <option value="">일정 유형 선택</option>
                                <option value="회의">회의</option>
                                <option value="점검">점검</option>
                                <option value="교육">교육</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">설명</label>
                            <input
                                className="form-input"
                                value={newSchedule.description}
                                onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                            />
                        </div>
                        <div className="dialog-footer">
                            <button className="button-cancel" onClick={handleCloseDialog}>
                                취소
                            </button>
                            <button className="button-submit" onClick={handleAddSchedule}>
                                {selectedSchedule ? '수정' : '추가'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
