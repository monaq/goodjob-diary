'use client';

import { useState } from 'react';
import { Diary } from '@/lib/supabase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

interface CalendarProps {
  diaries: Diary[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DiaryCalendar({ diaries, selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const hasDiary = (date: Date) => {
    return diaries.some(diary => {
      const diaryDate = new Date(diary.created_at);
      return diaryDate.toDateString() === date.toDateString();
    });
  };

  const hasFeedback = (date: Date) => {
    return diaries.some(diary => {
      const diaryDate = new Date(diary.created_at);
      return diaryDate.toDateString() === date.toDateString() && diary.ai_comment;
    });
  };

  const tileContent = ({ date }: { date: Date }) => {
    if (hasDiary(date)) {
      return (
        <div className={`
          absolute bottom-1 left-1/2 transform -translate-x-1/2
          w-1.5 h-1.5 rounded-full
          ${hasFeedback(date) ? 'bg-red-500' : 'bg-gray-400'}
        `} />
      );
    }
    return null;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const classes = [];
    if (date.toDateString() === selectedDate.toDateString()) {
      classes.push('selected-date');
    }
    if (hasDiary(date)) {
      classes.push('has-diary');
    }
    return classes.join(' ');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Calendar
        value={selectedDate}
        onChange={(date) => onDateSelect(date as Date)}
        locale="ko-KR"
        formatDay={(_, date) => date.getDate().toString()}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) {
            setCurrentMonth(activeStartDate);
          }
        }}
        next2Label={null}
        prev2Label={null}
        minDetail="month"
        maxDetail="month"
      />
    </div>
  );
} 