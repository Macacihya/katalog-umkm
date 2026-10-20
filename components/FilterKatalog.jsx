"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function FilterKatalog({
  daftarKategori = [],
  kategoriAktif = "",
  queryAktif = "",
  urutanAktif = "terbaru",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(queryAktif);

  function perbaruiFilter(perubahan) {
    const params = new URLSearchParams(searchParams.toString());

    // Selalu reset nomor halaman ke 1 ketika filter berubah
    params.delete("halaman");

    Object.entries(perubahan).forEach(([kunci, nilai]) => {
      if (!nilai || nilai === "semua" || (kunci === "urutan" && nilai === "terbaru")) {
        params.delete(kunci);
      } else {
        params.set(kunci, nilai);
      }
    });

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    perbaruiFilter({ q: searchTerm.trim() });
  }

  function handleResetAll() {
    setSearchTerm("");
    startTransition(() => {
      router.push(pathname);
    });
  }

  const adaFilterAktif = Boolean(
    queryAktif ||
      (kategoriAktif && kategoriAktif !== "semua") ||
      (urutanAktif && urutanAktif !== "terbaru")
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Baris Pencarian & Pengurutan */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 pr-20 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-utama px-3.5 text-xs font-semibold text-white hover:bg-utama-gelap transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Cari"}
          </button>
        </form>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="pilih-urutan" className="text-xs font-medium text-teks-lembut whitespace-nowrap">
            Urutkan:
          </label>
          <select
            id="pilih-urutan"
            value={urutanAktif}
            onChange={(e) => perbaruiFilter({ urutan: e.target.value })}
            className="rounded-xl border border-garis bg-latar px-3 py-2 text-sm font-medium text-teks focus:border-utama focus:outline-none"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga: Termurah</option>
            <option value="termahal">Harga: Termahal</option>
            <option value="nama">Nama (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Baris Kategori Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => perbaruiFilter({ kategori: "semua" })}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            !kategoriAktif || kategoriAktif === "semua"
              ? "bg-utama text-white"
              : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
          }`}
        >
          Semua
        </button>

        {daftarKategori.map((kat) => {
          const isActive = kategoriAktif === kat;
          return (
            <button
              key={kat}
              type="button"
              onClick={() => perbaruiFilter({ kategori: kat })}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              {kat}
            </button>
          );
        })}
      </div>

      {/* Status Filter Aktif */}
      {adaFilterAktif && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-permukaan px-3 py-2 text-xs text-teks-lembut">
          <div className="flex flex-wrap items-center gap-2">
            <span>Filter aktif:</span>
            {queryAktif && (
              <span className="rounded bg-latar px-2 py-0.5 border border-garis font-medium text-teks">
                Kata kunci: &ldquo;{queryAktif}&rdquo;
              </span>
            )}
            {kategoriAktif && kategoriAktif !== "semua" && (
              <span className="rounded bg-latar px-2 py-0.5 border border-garis font-medium text-teks">
                Kategori: {kategoriAktif}
              </span>
            )}
            {urutanAktif && urutanAktif !== "terbaru" && (
              <span className="rounded bg-latar px-2 py-0.5 border border-garis font-medium text-teks">
                Urutan:{" "}
                {urutanAktif === "termurah"
                  ? "Termurah"
                  : urutanAktif === "termahal"
                  ? "Termahal"
                  : "Nama (A–Z)"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleResetAll}
            className="font-semibold text-bahaya hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
