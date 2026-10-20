import { NextResponse } from "next/server";
import { tanyaAsistenAI } from "@/lib/gemini";
import { buatClientServer } from "@/lib/supabase/server";

// Simpan timestamp kiriman terakhir untuk pembatasan spam (rate limit dasar)
const mapCooldown = new Map();

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown-ip";

    const sekarang = Date.now();
    const waktuTerakhir = mapCooldown.get(ip) || 0;

    // Pembatasan kiriman dasar: minimal 3 detik antar pertanyaan
    if (sekarang - waktuTerakhir < 3000) {
      return NextResponse.json(
        { error: "Mohon tunggu beberapa detik sebelum mengajukan pertanyaan baru." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { produkId, pertanyaan } = body || {};

    if (!pertanyaan || typeof pertanyaan !== "string" || !pertanyaan.trim()) {
      return NextResponse.json(
        { error: "Pertanyaan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const qClean = pertanyaan.trim();

    // Batasi panjang pertanyaan (maksimal 150 karakter)
    if (qClean.length > 150) {
      return NextResponse.json(
        { error: "Panjang pertanyaan maksimal 150 karakter." },
        { status: 400 }
      );
    }

    // Ambil data produk dari database di server
    const supabase = buatClientServer();
    const { data: produk, error: errProduk } = await supabase
      .from("produk")
      .select("nama, harga, kategori, deskripsi")
      .eq("id", produkId)
      .maybeSingle();

    if (errProduk || !produk) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    // Catat waktu kiriman
    mapCooldown.set(ip, sekarang);

    // Panggil LLM dari server
    const jawaban = await tanyaAsistenAI(qClean, produk);

    return NextResponse.json({ jawaban });
  } catch (err) {
    console.error("Tanya AI Error:", err);
    return NextResponse.json(
      { error: err.message || "Maaf, terjadi kendala saat menghubungkan ke asisten AI." },
      { status: 500 }
    );
  }
}
