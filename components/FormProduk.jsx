"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, isPending] = useActionState(aksi, null);

  const namaAwal = state?.data?.nama ?? produk.nama ?? "";
  const hargaAwal = state?.data?.harga ?? produk.harga ?? "";
  const kategoriAwal = state?.data?.kategori ?? produk.kategori ?? "";
  const fotoAwal = state?.data?.foto_url ?? produk.foto_url ?? "";
  const deskripsiAwal = state?.data?.deskripsi ?? produk.deskripsi ?? "";

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {state.error}
        </div>
      )}

      <Input label="Nama produk" name="nama" defaultValue={namaAwal} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={hargaAwal}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={kategoriAwal} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={fotoAwal}
      />
      <Input label="Deskripsi" name="deskripsi" textarea defaultValue={deskripsiAwal} />
      <div className="flex gap-3">
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

