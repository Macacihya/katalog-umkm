import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function buatClientServer() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di environment variable."
    );
  }

  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createSupabaseClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createClientServer = buatClientServer;
export const createClient = buatClientServer;
