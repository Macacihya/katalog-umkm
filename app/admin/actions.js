"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatClientSesi } from "@/lib/supabase/server";
import { buatDeskripsiProdukAI } from "@/lib/gemini";

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

  // Validasi input server (US-34: per field)
  const fieldErrors = {};
  if (!nama) fieldErrors.nama = "Nama produk wajib diisi.";

  const hargaInt = parseInt(hargaRaw, 10);
  if (!hargaRaw && hargaRaw !== 0) {
    fieldErrors.harga = "Harga wajib diisi.";
  } else if (isNaN(hargaInt) || hargaInt < 0) {
    fieldErrors.harga = "Harga harus berupa angka positif.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Periksa kembali isian form.",
      fieldErrors,
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

  // Validasi input server (US-34: per field)
  const fieldErrors = {};
  if (!nama) fieldErrors.nama = "Nama produk wajib diisi.";

  const hargaInt = parseInt(hargaRaw, 10);
  if (!hargaRaw && hargaRaw !== 0) {
    fieldErrors.harga = "Harga wajib diisi.";
  } else if (isNaN(hargaInt) || hargaInt < 0) {
    fieldErrors.harga = "Harga harus berupa angka positif.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Periksa kembali isian form.",
      fieldErrors,
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

export async function tambahVarian(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const produk_id = data?.get?.("produk_id");
  const nama = String(data?.get?.("nama") ?? "").trim();
  const hargaRaw = data?.get?.("harga") ?? "";
  const stokRaw = data?.get?.("stok") ?? "10";

  if (!produk_id) {
    return { error: "ID produk tidak valid." };
  }
  if (!nama) {
    return { error: "Nama varian wajib diisi." };
  }

  const hargaInt = parseInt(hargaRaw, 10);
  if (isNaN(hargaInt) || hargaInt < 0) {
    return { error: "Harga varian harus berupa angka non-negatif." };
  }

  const stokInt = parseInt(stokRaw, 10);
  if (isNaN(stokInt) || stokInt < 0) {
    return { error: "Stok varian harus berupa angka non-negatif." };
  }

  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: Anda harus login sebagai admin." };
  }

  const { error } = await supabase.from("varian").insert([
    {
      produk_id,
      nama,
      harga: hargaInt,
      stok: stokInt,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/produk/${produk_id}/ubah`);
  revalidatePath(`/produk/${produk_id}`);
  return { success: "Varian berhasil ditambahkan." };
}

export async function hapusVarian(formData) {
  const id = formData?.get?.("id");
  const produk_id = formData?.get?.("produk_id");

  if (!id) {
    throw new Error("ID varian tidak valid.");
  }

  const supabase = await buatClientSesi();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Akses ditolak: Anda harus login sebagai admin.");
  }

  const { error } = await supabase.from("varian").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (produk_id) {
    revalidatePath(`/admin/produk/${produk_id}/ubah`);
    revalidatePath(`/produk/${produk_id}`);
  }
}

export async function validasiPesananServer({ produkId, varianId, jumlah }) {
  const jumlahInt = parseInt(jumlah, 10);
  if (isNaN(jumlahInt) || jumlahInt < 1) {
    return { valid: false, error: "Jumlah pembelian minimal 1 pcs." };
  }

  const supabase = await buatClientSesi();
  const { data: produk, error: errProduk } = await supabase
    .from("produk")
    .select("id, nama, harga")
    .eq("id", produkId)
    .maybeSingle();

  if (errProduk || !produk) {
    return { valid: false, error: "Produk tidak ditemukan." };
  }

  if (varianId) {
    const { data: varian, error: errVarian } = await supabase
      .from("varian")
      .select("id, nama, harga, stok")
      .eq("id", varianId)
      .eq("produk_id", produkId)
      .maybeSingle();

    if (errVarian || !varian) {
      return { valid: false, error: "Varian produk tidak ditemukan." };
    }

    if (varian.stok < jumlahInt) {
      return {
        valid: false,
        error: `Stok varian "${varian.nama}" tidak mencukupi (sisa ${varian.stok} pcs).`,
      };
    }

    const hargaTotal = varian.harga * jumlahInt;
    return {
      valid: true,
      produkId: produk.id,
      namaProduk: produk.nama,
      varianId: varian.id,
      namaVarian: varian.nama,
      hargaSatuan: varian.harga,
      jumlah: jumlahInt,
      hargaTotal,
    };
  }

  const hargaTotal = produk.harga * jumlahInt;
  return {
    valid: true,
    produkId: produk.id,
    namaProduk: produk.nama,
    varianId: null,
    namaVarian: null,
    hargaSatuan: produk.harga,
    jumlah: jumlahInt,
    hargaTotal,
  };
}

// US-14: Deskripsi produk otomatis dengan Gemini API di server
export async function buatDeskripsiAIAction(nama, kategori) {
  const supabase = await buatClientSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Akses ditolak: Hanya admin yang dapat menggunakan generator AI." };
  }

  if (!nama || !nama.trim()) {
    return { error: "Nama produk harus diisi terlebih dahulu sebelum membuat deskripsi AI." };
  }

  try {
    const hasil = await buatDeskripsiProdukAI(nama.trim(), (kategori || "").trim());
    return { deskripsi: hasil };
  } catch (err) {
    return { error: err.message || "Gagal membuat deskripsi dengan AI." };
  }
}




