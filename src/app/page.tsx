'use client';

import { useState, useEffect } from 'react';
import { supabase, Diary } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

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
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold">😊 오늘 하루 어땠나요?</h1>
        <Link 
          href="/write"
          className="inline-flex items-center gap-2 bg-[var(--primary-orange)] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          ✏️ 일기 쓰러 가기
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📘 최근 일기 목록
        </h2>
        
        {diaries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 작성한 일기가 없어요.</p>
        ) : (
          <div className="space-y-4">
            {diaries.map((diary) => (
              <Link 
                key={diary.id} 
                href={`/feedback/${diary.id}`}
                className="block p-4 border rounded-lg hover:border-[var(--primary-orange)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {new Date(diary.created_at).toLocaleDateString('ko-KR', {
                      month: 'numeric',
                      day: 'numeric'
                    })}
                  </span>
                  {diary.ai_comment ? (
                    <span className="text-green-500">✅</span>
                  ) : (
                    <span className="text-yellow-500">⏳</span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2">{diary.content}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
