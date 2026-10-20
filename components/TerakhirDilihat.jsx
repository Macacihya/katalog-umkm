"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

// US-36: Menampilkan bagian "Terakhir dilihat" di beranda bila tidak kosong
export default function TerakhirDilihat() {
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [sudahDimuat, setSudahDimuat] = useState(false);

  useEffect(() => {
    try {
      const STORAGE_KEY = "umkm_terakhir_dilihat";
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDaftarProduk(parsed);
        }
      }
    } catch {
      // Abaikan jika error
    } finally {
      setSudahDimuat(true);
    }
  }, []);

  if (!sudahDimuat || daftarProduk.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 flex flex-col gap-4 border-t border-garis pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Terakhir dilihat</h2>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("umkm_terakhir_dilihat");
            setDaftarProduk([]);
          }}
          className="text-xs text-teks-lembut hover:text-bahaya underline"
        >
          Bersihkan riwayat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}
