"use client";

import { useState } from "react";

// US-18: Galeri beberapa foto produk
// Menerima foto_url utama dan opsional array/string foto
export default function GaleriFotoProduk({ fotoUrl, namaProduk, fotoTambahan }) {
  // Parsing semua foto yang tersedia
  let daftarFoto = [];

  if (Array.isArray(fotoTambahan) && fotoTambahan.length > 0) {
    daftarFoto = fotoTambahan;
  } else if (typeof fotoUrl === "string") {
    // Cek apakah fotoUrl berformat JSON array atau dipisahkan koma
    if (fotoUrl.startsWith("[") && fotoUrl.endsWith("]")) {
      try {
        const parsed = JSON.parse(fotoUrl);
        if (Array.isArray(parsed)) daftarFoto = parsed;
      } catch {
        daftarFoto = [fotoUrl];
      }
    } else if (fotoUrl.includes(",")) {
      daftarFoto = fotoUrl.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      daftarFoto = [fotoUrl];
    }
  }

  if (daftarFoto.length === 0) {
    daftarFoto = ["/produk/kopi.svg"];
  }

  const [fotoAktif, setFotoAktif] = useState(daftarFoto[0]);

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Utama */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={namaProduk}
          className="h-full w-full object-cover transition-all duration-200"
        />
      </div>

      {/* Gambar Kecil / Thumbnail (hanya jika ada lebih dari 1 foto) */}
      {daftarFoto.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {daftarFoto.map((foto, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFotoAktif(foto)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                fotoAktif === foto
                  ? "border-utama ring-2 ring-utama/30"
                  : "border-garis opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={foto}
                alt={`${namaProduk} foto ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
