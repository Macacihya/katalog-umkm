"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";

export default function DaftarFavorit({ daftarSemuaProduk = [] }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function loadFavorit() {
      try {
        const raw = localStorage.getItem("favorit_produk");
        setFavoritIds(raw ? JSON.parse(raw) : []);
      } catch {
        setFavoritIds([]);
      }
    }

    loadFavorit();
    window.addEventListener("favorit-updated", loadFavorit);
    return () => window.removeEventListener("favorit-updated", loadFavorit);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 text-center text-sm text-teks-lembut">
        Memuat daftar favorit...
      </div>
    );
  }

  const produkFavorit = daftarSemuaProduk.filter((p) =>
    favoritIds.includes(String(p.id))
  );

  if (produkFavorit.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-garis bg-permukaan/30 py-16 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-utama/10 text-utama mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-bahaya"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-teks">Belum Ada Produk Favorit</h2>
        <p className="mt-2 max-w-sm text-sm text-teks-lembut">
          Tandai produk yang kamu sukai dengan menekan ikon hati di katalog produk agar tersimpan di sini.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
        >
          Jelajahi Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-teks-lembut">
        Menampilkan {produkFavorit.length} produk favorit pilihan Anda.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {produkFavorit.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}
