'use client';

import { useState, useEffect } from 'react';
import { supabase, Diary } from '@/lib/supabase';

export default function Home() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      console.log('Fetching diaries...');
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch result:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setDiaries(data || []);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diaries')
        .insert([
          {
            content: content.trim(),
            user_id: 'user-1', // TODO: 실제 사용자 ID로 변경
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      if (data) {
        setDiaries([data[0], ...diaries]);
        setContent('');
      }
    } catch (error) {
      console.error('Error saving diary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">오늘의 일기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 일을 자유롭게 적어보세요..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
            rows={5}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '저장 중...' : '일기 저장하기'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">내 일기</h2>
        {diaries.length === 0 ? (
          <p className="text-gray-500">아직 작성한 일기가 없어요.</p>
        ) : (
          diaries.map((diary) => (
            <div key={diary.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm">
                  {new Date(diary.created_at).toLocaleDateString('ko-KR')}
                </p>
                {diary.ai_comment && (
                  <span className="bg-[var(--accent-green)] text-white px-2 py-1 rounded-full text-sm">
                    AI 응답 완료
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap">{diary.content}</p>
              {diary.ai_comment && (
                <div className="mt-4 p-4 bg-[var(--accent-blue)] rounded-lg">
                  <p className="font-semibold mb-2">AI 선생님의 응답</p>
                  <p className="whitespace-pre-wrap">{diary.ai_comment}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
