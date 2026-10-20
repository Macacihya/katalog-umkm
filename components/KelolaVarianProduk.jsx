"use client";

import { useActionState, useTransition } from "react";
import { formatRupiah } from "@/lib/format";
import { tambahVarian, hapusVarian } from "@/app/admin/actions";

export default function KelolaVarianProduk({ produkId, daftarVarian = [] }) {
  const [state, formAction, isPending] = useActionState(tambahVarian, null);
  const [isDeleting, startTransition] = useTransition();

  function onHapusVarian(id, nama) {
    if (!confirm(`Hapus varian "${nama}"?`)) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("produk_id", produkId);
      try {
        await hapusVarian(fd);
      } catch (err) {
        alert(err.message || "Gagal menghapus varian.");
      }
    });
  }

  return (
    <div className="flex max-w-xl flex-col gap-5 rounded-2xl border border-garis bg-latar p-6">
      <div>
        <h2 className="text-lg font-bold text-teks">Varian Ukuran & Harga (US-48)</h2>
        <p className="text-xs text-teks-lembut">
          Atur pilihan ukuran/berat beserta harga dan stok spesifik untuk produk ini.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-xs font-semibold text-bahaya">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-xs font-semibold text-utama">
          {state.success}
        </div>
      )}

      {/* Tabel / Daftar Varian Saat Ini */}
      {daftarVarian.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-garis">
          <table className="w-full text-left text-xs">
            <thead className="bg-permukaan font-semibold text-teks-lembut">
              <tr>
                <th className="px-3 py-2">Nama Varian</th>
                <th className="px-3 py-2">Harga</th>
                <th className="px-3 py-2">Stok</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarVarian.map((v) => (
                <tr key={v.id} className="border-t border-garis">
                  <td className="px-3 py-2.5 font-semibold text-teks">{v.nama}</td>
                  <td className="px-3 py-2.5 text-teks">{formatRupiah(v.harga)}</td>
                  <td className="px-3 py-2.5 text-teks-lembut">
                    {v.stok <= 0 ? (
                      <span className="font-semibold text-bahaya">Habis (0)</span>
                    ) : (
                      `${v.stok} pcs`
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => onHapusVarian(v.id, v.nama)}
                      className="text-xs font-semibold text-bahaya hover:underline disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-garis bg-permukaan p-4 text-center text-xs text-teks-lembut">
          Belum ada varian ukuran khusus. Produk ini menggunakan harga dasar toko.
        </p>
      )}

      {/* Form Tambah Varian Baru */}
      <form action={formAction} className="flex flex-col gap-3 border-t border-garis pt-4">
        <input type="hidden" name="produk_id" value={produkId} />
        <span className="text-xs font-bold text-teks">Tambah Varian Baru:</span>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            name="nama"
            placeholder="Nama (misal: 250 g / M)"
            required
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <input
            name="harga"
            type="number"
            min="0"
            placeholder="Harga (Rp)"
            required
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <input
            name="stok"
            type="number"
            min="0"
            defaultValue={10}
            placeholder="Stok"
            required
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap transition-colors disabled:opacity-50"
        >
          {isPending ? "Menambahkan..." : "Tambah Varian"}
        </button>
      </form>
    </div>
  );
}
