import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Diary = {
  id: number;
  created_at: string;
  content: string;
  ai_comment: string | null;
  ai_commented_at: string | null;
  status: 'pending' | 'completed';
  user_id: string;
}; 