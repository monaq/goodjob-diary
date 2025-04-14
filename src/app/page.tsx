'use client';

import { useState } from 'react';
import Image from "next/image";

interface Diary {
  id: string;
  content: string;
  createdAt: Date;
  aiComment?: string;
}

export default function Home() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newDiary: Diary = {
      id: Date.now().toString(),
      content: content.trim(),
      createdAt: new Date(),
    };

    setDiaries([newDiary, ...diaries]);
    setContent('');
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
          />
          <button type="submit" className="btn-primary">
            일기 저장하기
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
                  {new Date(diary.createdAt).toLocaleDateString('ko-KR')}
                </p>
                {diary.aiComment && (
                  <span className="bg-[var(--accent-green)] text-white px-2 py-1 rounded-full text-sm">
                    AI 응답 완료
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap">{diary.content}</p>
              {diary.aiComment && (
                <div className="mt-4 p-4 bg-[var(--accent-blue)] rounded-lg">
                  <p className="font-semibold mb-2">AI 선생님의 응답</p>
                  <p className="whitespace-pre-wrap">{diary.aiComment}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
