import { createClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          city: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          city?: string;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          city?: string;
        };
      };
      commute_profiles: {
        Row: {
          id: string;
          user_id: string;
          home_label: string;
          work_label: string;
          primary_transport: string;
          vehicle_model: string | null;
          salary_monthly_vnd: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          home_label: string;
          work_label: string;
          primary_transport: string;
          vehicle_model?: string | null;
          salary_monthly_vnd?: number | null;
          created_at?: string;
        };
        Update: {
          home_label?: string;
          work_label?: string;
          primary_transport?: string;
          vehicle_model?: string | null;
          salary_monthly_vnd?: number | null;
        };
      };
      commute_transactions: {
        Row: {
          id: string;
          commute_profile_id: string;
          category: string;
          merchant: string;
          amount_vnd: number;
          source: string;
          occurred_at: string;
          raw_payload: string | null;
        };
        Insert: {
          id?: string;
          commute_profile_id: string;
          category: string;
          merchant: string;
          amount_vnd: number;
          source?: string;
          occurred_at?: string;
          raw_payload?: string | null;
        };
        Update: {
          category?: string;
          merchant?: string;
          amount_vnd?: number;
          source?: string;
          occurred_at?: string;
          raw_payload?: string | null;
        };
      };
    };
  };
};

export function createBrowserSupabaseClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient<Database>(url, anonKey);
}

export function createServiceSupabaseClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
