"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAIAction } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// US-34: Pesan error per field ditampilkan di bawah input yang salah.
// US-14: Deskripsi otomatis dibuat AI (Gemini) dari nama dan kategori produk.
export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, isPending] = useActionState(aksi, null);

  const namaAwal = state?.data?.nama ?? produk.nama ?? "";
  const hargaAwal = state?.data?.harga ?? produk.harga ?? "";
  const kategoriAwal = state?.data?.kategori ?? produk.kategori ?? "";
  const fotoAwal = state?.data?.foto_url ?? produk.foto_url ?? "";
  const deskripsiAwal = state?.data?.deskripsi ?? produk.deskripsi ?? "";

  const [nama, setNama] = useState(namaAwal);
  const [kategori, setKategori] = useState(kategoriAwal);
  const [deskripsi, setDeskripsi] = useState(deskripsiAwal);
  const [sedangBuatAI, setSedangBuatAI] = useState(false);
  const [pesanAI, setPesanAI] = useState(null);

  const fe = state?.fieldErrors || {};

  async function handleBuatDeskripsiAI() {
    if (!nama || !nama.trim()) {
      setPesanAI("Isi nama produk terlebih dahulu.");
      return;
    }
    setSedangBuatAI(true);
    setPesanAI(null);
    try {
      const res = await buatDeskripsiAIAction(nama, kategori);
      if (res.error) {
        setPesanAI(res.error);
      } else if (res.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI("Deskripsi berhasil dibuat dengan AI!");
      }
    } catch (err) {
      setPesanAI(err.message || "Gagal membuat deskripsi.");
    } finally {
      setSedangBuatAI(false);
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && !state?.fieldErrors && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Input
          label="Nama produk"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        {fe.nama && (
          <p className="text-xs font-medium text-bahaya">{fe.nama}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={hargaAwal}
          required
        />
        {fe.harga && (
          <p className="text-xs font-medium text-bahaya">{fe.harga}</p>
        )}
      </div>

      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />

      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={fotoAwal}
      />

      {/* Kolom Deskripsi dengan Generator AI (US-14) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={sedangBuatAI}
            className="flex items-center gap-1 rounded-md border border-utama/40 bg-utama/10 px-2.5 py-1 text-xs font-semibold text-utama hover:bg-utama/20 transition-colors disabled:opacity-50"
          >
            {sedangBuatAI ? "⏳ Menulis deskripsi..." : "✨ Buat Deskripsi dengan AI"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tulis deskripsi produk atau klik tombol 'Buat Deskripsi dengan AI' di atas..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {pesanAI && (
          <p className="text-xs text-teks-lembut font-medium">{pesanAI}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
