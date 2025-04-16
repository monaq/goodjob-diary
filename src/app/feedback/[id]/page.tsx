'use client';

import { useState, useEffect } from 'react';
import { supabase, Diary } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDiary();
  }, [params.id]);

  const fetchDiary = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setDiary(data);
    } catch (error) {
      console.error('Error fetching diary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p>일기를 찾을 수 없습니다.</p>
        <Link href="/" className="text-[var(--primary-orange)] hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">✨참 잘했어요✨</h1>
        <div className="w-32 h-32 mx-auto bg-[var(--primary-orange)] rounded-full flex items-center justify-center text-6xl">
          🏆
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">일기 내용</h2>
          <p className="text-gray-700 whitespace-pre-wrap line-clamp-5">
            {diary.content}
          </p>
        </div>

        {diary.ai_comment && (
          <div className="p-4 bg-[var(--accent-blue)] rounded-lg">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              🤖 AI의 위로 한마디
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {diary.ai_comment}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/"
            className="bg-[var(--primary-orange)] text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 