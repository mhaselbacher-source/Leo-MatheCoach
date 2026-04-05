import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null | undefined;

export function getSupabaseConfig() {
  return {
    url: (import.meta.env.VITE_SUPABASE_URL ?? "").trim(),
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim(),
  };
}

export function hasSupabaseConfig() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export function getSupabaseClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const { url, anonKey } = getSupabaseConfig();
  supabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}
