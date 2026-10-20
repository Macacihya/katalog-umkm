"use client";

import { useTransition } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const [isPending, startTransition] = useTransition();

  function handleHapus(id, nama) {
    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${nama}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!yakin) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      try {
        await hapusProduk(formData);
      } catch (err) {
        alert(err.message || "Gagal menghapus produk.");
      }
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-teks-lembut">
                Belum ada produk.
              </td>
            </tr>
          ) : (
            daftarProduk.map((produk) => (
              <tr key={produk.id} className="border-t border-garis">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={produk.foto_url || "/produk/kopi.svg"}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover bg-permukaan"
                    />
                    <span className="font-semibold">{produk.nama}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "-"}</td>
                <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                      Ubah
                    </Tombol>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleHapus(produk.id, produk.nama)}
                      className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-bahaya hover:border-bahaya transition-colors disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

