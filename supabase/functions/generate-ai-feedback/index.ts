import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1분 전에 작성되고 아직 AI 코멘트가 없는 일기들 조회
    const { data: diaries, error: fetchError } = await supabaseClient
      .from('diaries')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', new Date(Date.now() - 60000).toISOString()) // 1분 전 이전에 작성된 일기
      .is('ai_comment', null)

    if (fetchError) throw fetchError
    if (!diaries || diaries.length === 0) {
      return new Response(
        JSON.stringify({ message: '처리할 일기가 없습니다.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // OpenAI 클라이언트 초기화
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // 각 일기에 대해 AI 피드백 생성
    for (const diary of diaries) {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `당신은 따뜻한 위로와 격려를 제공하는 상담가입니다. 
              사용자의 일기 내용을 읽고, 다음 형식으로 피드백을 제공해주세요:
              
              1. 장점: 일기에서 발견한 긍정적인 부분을 1-2문장으로 설명
              2. 개선점: 더 나은 방향으로 나아가기 위한 제안을 1-2문장으로 설명
              3. 격려: 마무리 격려 메시지를 1-2문장으로 작성
              
              모든 피드백은 한국어로 작성하고, 존댓말을 사용하며, 따뜻하고 공감하는 톤으로 작성해주세요.`
            },
            {
              role: "user",
              content: diary.content
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })

        const aiResponse = completion.data.choices[0].message?.content

        // AI 피드백 저장
        await supabaseClient
          .from('diaries')
          .update({
            ai_comment: aiResponse,
            ai_commented_at: new Date().toISOString(),
            status: 'completed'
          })
          .eq('id', diary.id)
      } catch (error) {
        console.error(`Error processing diary ${diary.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: diaries.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 