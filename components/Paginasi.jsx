import Link from "next/link";

export default function Paginasi({
  halamanSekarang = 1,
  totalHalaman = 1,
  totalProduk = 0,
  perHalaman = 9,
  q = "",
  kategori = "",
  urutan = "terbaru",
}) {
  if (totalHalaman <= 1) return null;

  function buatUrl(hal) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (kategori && kategori !== "semua") p.set("kategori", kategori);
    if (urutan && urutan !== "terbaru") p.set("urutan", urutan);
    if (hal > 1) p.set("halaman", String(hal));
    const qs = p.toString();
    return qs ? `/?${qs}` : "/";
  }

  // Bangun rentang nomor halaman dengan pagination window
  const rentangHalaman = [];
  for (let i = 1; i <= totalHalaman; i++) {
    if (
      i === 1 ||
      i === totalHalaman ||
      (i >= halamanSekarang - 1 && i <= halamanSekarang + 1)
    ) {
      rentangHalaman.push(i);
    } else if (
      (i === halamanSekarang - 2 && i > 1) ||
      (i === halamanSekarang + 2 && i < totalHalaman)
    ) {
      rentangHalaman.push("...");
    }
  }

  // Filter elipsis berurutan
  const halamanTampil = rentangHalaman.filter(
    (item, index) => item !== "..." || rentangHalaman[index - 1] !== "..."
  );

  const dariItem = Math.min((halamanSekarang - 1) * perHalaman + 1, totalProduk);
  const sampaiItem = Math.min(halamanSekarang * perHalaman, totalProduk);

  return (
    <nav
      aria-label="Paginasi produk"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-garis pt-6 sm:flex-row"
    >
      <p className="text-xs text-teks-lembut">
        Menampilkan{" "}
        <span className="font-semibold text-teks">
          {dariItem}–{sampaiItem}
        </span>{" "}
        dari <span className="font-semibold text-teks">{totalProduk}</span> produk
      </p>

      <div className="flex items-center gap-1.5">
        {/* Tombol Sebelumnya */}
        {halamanSekarang > 1 ? (
          <Link
            href={buatUrl(halamanSekarang - 1)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
          >
            Sebelumnya
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-garis/60 bg-permukaan px-3 text-xs font-semibold text-teks-lembut/50">
            Sebelumnya
          </span>
        )}

        {/* Nomor Halaman */}
        <div className="flex items-center gap-1">
          {halamanTampil.map((item, idx) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-xs text-teks-lembut"
                >
                  &hellip;
                </span>
              );
            }

            const aktif = item === halamanSekarang;
            return (
              <Link
                key={`page-${item}`}
                href={buatUrl(item)}
                aria-current={aktif ? "page" : undefined}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  aktif
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                }`}
              >
                {item}
              </Link>
            );
          })}
        </div>

        {/* Tombol Selanjutnya */}
        {halamanSekarang < totalHalaman ? (
          <Link
            href={buatUrl(halamanSekarang + 1)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
          >
            Selanjutnya
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-garis/60 bg-permukaan px-3 text-xs font-semibold text-teks-lembut/50">
            Selanjutnya
          </span>
        )}
      </div>
    </nav>
  );
}
