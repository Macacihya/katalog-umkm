"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// US-34: Pesan error per field ditampilkan di bawah input yang salah.
export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, isPending] = useActionState(aksi, null);

  const namaAwal = state?.data?.nama ?? produk.nama ?? "";
  const hargaAwal = state?.data?.harga ?? produk.harga ?? "";
  const kategoriAwal = state?.data?.kategori ?? produk.kategori ?? "";
  const fotoAwal = state?.data?.foto_url ?? produk.foto_url ?? "";
  const deskripsiAwal = state?.data?.deskripsi ?? produk.deskripsi ?? "";

  const fe = state?.fieldErrors || {};

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && !state?.fieldErrors && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Input label="Nama produk" name="nama" defaultValue={namaAwal} required />
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
