import { OpenAI } from 'openai';
const client = new OpenAI();
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
}

// GPT-4 호출 함수
export async function getAiComfortMessage(content: string): Promise<string> {
  // TODO: 현재 모델이 gpt-3.5-turbo 이므로 모델 변경 시 수정 필요
  const res = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          '당신은 따뜻한 위로와 격려를 제공하는 상담가입니다. 사용자의 일기 내용을 읽고 해결 방법을 따뜻한 메시지로 전달해주세요.', 
      },
      {
        role: 'user',
        content,
      },
    ],
    temperature: 0.7,
  });

  return res.choices[0].message.content?.trim() ?? '오늘도 수고 많으셨어요.';
} 