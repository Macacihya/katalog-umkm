import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function buatClientSesi() {
  const cookieStore = await cookies();
  const rawUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diisi di environment variable."
    );
  }

  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

export const buatClientAuth = buatClientSesi;

