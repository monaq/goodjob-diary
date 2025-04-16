'use client';

import { useState, useEffect } from 'react';
import { supabase, Diary } from '@/lib/supabase';
import Calendar from '@/components/Calendar';
import Link from 'next/link';

export default function CalendarPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    const diary = diaries.find(d => {
      const diaryDate = new Date(d.created_at);
      return diaryDate.toDateString() === selectedDate.toDateString();
    });
    setSelectedDiary(diary || null);
  }, [selectedDate, diaries]);

  const fetchDiaries = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiaries(data || []);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <Calendar
          diaries={diaries}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <div className="mt-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ◀️ 어제
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              내일 ▶️
            </button>
          </div>
        </div>

        {selectedDiary ? (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <p className="whitespace-pre-wrap">{selectedDiary.content}</p>
            </div>

            {selectedDiary.ai_comment && (
              <div className="p-4 bg-[var(--accent-blue)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-semibold">AI 피드백 도장</h3>
                </div>
                <p className="whitespace-pre-wrap">{selectedDiary.ai_comment}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">이 날짜의 일기가 없어요.</p>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 bg-[var(--primary-orange)] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              ✏️ 일기 쓰러 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 