import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Proposal = {
  id: string;
  user_id: string;
  job_brief: string;
  freelancer_bio: string;
  tone: string;
  proposal: string;
  created_at: string;
};

export type ScopeEstimate = {
  id: string;
  user_id: string;
  project_desc: string;
  hourly_rate: string;
  result: object;
  created_at: string;
};
