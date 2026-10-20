"use client";

import { useEffect } from "react";

// US-36: Catat produk yang sedang dibuka ke localStorage (maksimal 6 item)
export default function CatatTerakhirDilihat({ produk }) {
  useEffect(() => {
    if (!produk?.id) return;
    try {
      const STORAGE_KEY = "umkm_terakhir_dilihat";
      const tersimpanRaw = localStorage.getItem(STORAGE_KEY);
      let list = tersimpanRaw ? JSON.parse(tersimpanRaw) : [];

      // Hapus jika produk sudah ada agar posisinya berpindah ke paling depan
      list = list.filter((p) => String(p.id) !== String(produk.id));

      // Tambahkan ke paling depan
      list.unshift({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        harga_diskon: produk.harga_diskon,
        foto_url: produk.foto_url,
        kategori: produk.kategori,
        stok: produk.stok,
      });

      // Batasi maksimal 6 item
      if (list.length > 6) {
        list = list.slice(0, 6);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      // Abaikan jika localStorage tidak diizinkan
    }
  }, [produk]);

  return null;
}
