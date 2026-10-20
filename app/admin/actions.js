"use server";

import { redirect } from "next/navigation";
import { buatClientSesi } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email") ?? "";
  const password = data?.get?.("password") ?? "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatClientSesi();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    const pesan =
      error.message === "Invalid login credentials"
        ? "Email atau password salah."
        : error.message;
    return { error: pesan };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatClientSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
