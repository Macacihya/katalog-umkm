"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get?.("password_baru") ?? "";
  const konfirmasiPassword = data?.get?.("konfirmasi_password") ?? "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir." };
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password berhasil diperbarui." };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const nama = String(data?.get?.("nama") ?? "").trim();
  const hargaRaw = data?.get?.("harga") ?? "";
  const kategori = String(data?.get?.("kategori") ?? "").trim();
  const foto_url = String(data?.get?.("foto_url") ?? "").trim() || "/produk/kopi.svg";
  const deskripsi = String(data?.get?.("deskripsi") ?? "").trim();

  // Validasi input server
  if (!nama) {
    return {
      error: "Nama produk wajib diisi.",
      data: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  const hargaInt = parseInt(hargaRaw, 10);
  if (isNaN(hargaInt) || hargaInt < 0) {
    return {
      error: "Harga harus berupa angka dan tidak boleh negatif.",
      data: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  // Verifikasi otorisasi admin
  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "Akses ditolak: Anda harus login sebagai admin.",
      data: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga: hargaInt,
      kategori: kategori || null,
      foto_url,
      deskripsi: deskripsi || null,
    },
  ]);

  if (error) {
    return {
      error: error.message,
      data: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const id = data?.get?.("id");
  const nama = String(data?.get?.("nama") ?? "").trim();
  const hargaRaw = data?.get?.("harga") ?? "";
  const kategori = String(data?.get?.("kategori") ?? "").trim();
  const foto_url = String(data?.get?.("foto_url") ?? "").trim() || "/produk/kopi.svg";
  const deskripsi = String(data?.get?.("deskripsi") ?? "").trim();

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Validasi input server
  if (!nama) {
    return {
      error: "Nama produk wajib diisi.",
      data: { id, nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  const hargaInt = parseInt(hargaRaw, 10);
  if (isNaN(hargaInt) || hargaInt < 0) {
    return {
      error: "Harga harus berupa angka dan tidak boleh negatif.",
      data: { id, nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  // Verifikasi otorisasi admin
  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "Akses ditolak: Anda harus login sebagai admin.",
      data: { id, nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga: hargaInt,
      kategori: kategori || null,
      foto_url,
      deskripsi: deskripsi || null,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
      data: { id, nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function hapusProduk(formData) {
  const id = formData?.get?.("id");
  if (!id) {
    throw new Error("ID produk tidak valid.");
  }

  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Akses ditolak: Anda harus login sebagai admin.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}


