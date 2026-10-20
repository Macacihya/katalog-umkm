"use client";

import { useState } from "react";

// US-50: Kotak tanya jawab produk dengan asisten AI di halaman detail
export default function AsistenTanyaProdukAI({ produkId, namaProduk }) {
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [pesanError, setPesanError] = useState(null);

  const MAKS_KARAKTER = 150;

  async function handleTanya(e) {
    e.preventDefault();
    if (!pertanyaan.trim() || isPending) return;

    setIsPending(true);
    setPesanError(null);
    setJawaban(null);

    try {
      const res = await fetch("/api/tanya-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produkId,
          pertanyaan: pertanyaan.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setPesanError(data.error || "Gagal mendapatkan respon dari AI.");
      } else {
        setJawaban(data.jawaban);
      }
    } catch (err) {
      setPesanError("Koneksi gagal atau waktu tunggu habis. Coba lagi nanti.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-garis bg-permukaan p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-utama/15 text-sm">
          🤖
        </span>
        <h3 className="font-bold text-teks">
          Tanya Asisten AI tentang {namaProduk}
        </h3>
      </div>

      <p className="mt-1 text-xs text-teks-lembut">
        Dapatkan jawaban cepat seputar produk ini secara otomatis didukung oleh Gemini AI.
      </p>

      <form onSubmit={handleTanya} className="mt-4 flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            value={pertanyaan}
            maxLength={MAKS_KARAKTER}
            onChange={(e) => setPertanyaan(e.target.value)}
            placeholder="Contoh: Apakah produk ini cocok untuk kado?"
            className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 pr-16 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <span className="absolute right-3 top-3 text-[10px] text-teks-lembut">
            {pertanyaan.length}/{MAKS_KARAKTER}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !pertanyaan.trim()}
            className="rounded-lg bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Sedang menjawab..." : "Tanya AI"}
          </button>
        </div>
      </form>

      {pesanError && (
        <div className="mt-3 rounded-lg border border-bahaya/30 bg-bahaya/10 p-3 text-xs font-medium text-bahaya">
          {pesanError}
        </div>
      )}

      {jawaban && (
        <div className="mt-4 rounded-xl border border-utama/30 bg-utama/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-utama">
            Jawaban Asisten:
          </p>
          <p className="mt-1 text-sm leading-relaxed text-teks">
            {jawaban}
          </p>
        </div>
      )}
    </div>
  );
}
