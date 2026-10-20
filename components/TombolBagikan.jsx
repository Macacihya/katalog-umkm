"use client";

import { useState } from "react";

export default function TombolBagikan({ namaProduk }) {
  const [disalin, setDisalin] = useState(false);

  async function bagikanLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    // Selalu salin ke clipboard agar umpan balik "Link tersalin!" selalu muncul
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch {
      // Abaikan jika browser membatasi izin clipboard tanpa interaksi langsung
    }

    setDisalin(true);
    setTimeout(() => setDisalin(false), 2500);

    // Jika Web Share API didukung, panggil juga share dialog
    if (navigator.share) {
      try {
        await navigator.share({
          title: namaProduk,
          text: `Lihat produk ${namaProduk}`,
          url: url,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
  }

  return (
    <button
      type="button"
      onClick={bagikanLink}
      id="tombol-bagikan-produk"
      className="inline-flex items-center gap-2 rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      aria-label="Bagikan atau salin tautan produk"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-teks-lembut"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <span>{disalin ? "Link tersalin!" : "Bagikan link"}</span>
    </button>
  );
}
