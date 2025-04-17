import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getAiComfortMessage } from '@/lib/ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST() {
  try {
    // 1. 1분 이상 지난 일기 중, 아직 GPT 호출 안 된 것 찾기
    const { data: diaries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', new Date(Date.now() - 60 * 1000).toISOString())
      .limit(5);

    if (error) {
      console.error('Error fetching diaries:', error);
      return NextResponse.json({ message: 'Error fetching diaries' }, { status: 500 });
    }

    for (const diary of diaries) {
      try {
        // 2. GPT-4 API 호출
        const aiResponse = await getAiComfortMessage(diary.content);

        // 3. Supabase에 결과 저장
        await supabase
          .from('diaries')
          .update({
            ai_comment: aiResponse,
            ai_commented_at: new Date().toISOString(),
            status: 'completed',
          })
          .eq('id', diary.id);

        console.log(`✅ Updated diary ${diary.id}`);
      } catch (err) {
        console.error(`❌ Failed to process diary ${diary.id}`, err);
      }
    }

    return NextResponse.json({ message: 'AI comments processed' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 