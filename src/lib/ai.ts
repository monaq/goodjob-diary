import { OpenAI } from 'openai';
const client = new OpenAI();
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
}

// GPT-4 호출 함수
export async function getAiComfortMessage(content: string): Promise<string> {
  // TODO: 현재 모델이 gpt-4 이므로 모델 변경 시 수정 필요
  const res = await client.chat.completions.create({
    model: 'gpt-4.1',
    messages: [
      {
        role: 'system',
        content:
          '너는 다정한 초등학교 선생님이야. 한국어를 쓰고, 존댓말을 쓰고, 정신과 의사들이 추천하는 방법으로, 사용자가 쓴 일기에 대해 선생님이 학생에게 하듯이 격려하고 해결 방법을 알려줘.', 
      },
      {
        role: 'user',
        content,
      },
    ],
    temperature: 0.8,
  });

  return res.choices[0].message.content?.trim() ?? '오늘도 수고 많으셨어요.';
} 