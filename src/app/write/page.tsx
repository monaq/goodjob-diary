'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('diaries')
        .insert([
          {
            content: content.trim(),
            user_id: 'user-1', // TODO: 실제 사용자 ID로 변경
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      
      // 저장 성공 시 홈으로 이동
      router.push('/');
    } catch (error) {
      console.error('Error saving diary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">오늘의 일기</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 있었던 일을 자유롭게 적어보세요..."
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] min-h-[300px]"
              disabled={loading}
            />

            <button
              type="button"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <span className="text-2xl">+</span>
              이미지 첨부하기
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-orange)] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
} 