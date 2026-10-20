"use client";

import { useEffect, useState } from "react";

export default function TombolFavorit({ produkId, className = "" }) {
  const [isFavorit, setIsFavorit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function checkFavorit() {
      try {
        const raw = localStorage.getItem("favorit_produk");
        const list = raw ? JSON.parse(raw) : [];
        setIsFavorit(list.includes(String(produkId)));
      } catch {
        setIsFavorit(false);
      }
    }

    checkFavorit();
    window.addEventListener("favorit-updated", checkFavorit);
    return () => window.removeEventListener("favorit-updated", checkFavorit);
  }, [produkId]);

  function toggleFavorit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const raw = localStorage.getItem("favorit_produk");
      let list = raw ? JSON.parse(raw) : [];
      const strId = String(produkId);

      if (list.includes(strId)) {
        list = list.filter((id) => id !== strId);
        setIsFavorit(false);
      } else {
        list.push(strId);
        setIsFavorit(true);
      }

      localStorage.setItem("favorit_produk", JSON.stringify(list));
      window.dispatchEvent(new Event("favorit-updated"));
    } catch {
      // Abaikan jika localStorage tidak aktif
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleFavorit}
      aria-label={isFavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
      title={isFavorit ? "Hapus dari Favorit" : "Simpan ke Favorit"}
      className={`group flex h-8 w-8 items-center justify-center rounded-full border border-garis bg-latar/90 backdrop-blur shadow-sm transition-transform hover:scale-110 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorit ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 transition-colors ${
          isFavorit ? "text-bahaya fill-bahaya" : "text-teks-lembut group-hover:text-bahaya"
        }`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
