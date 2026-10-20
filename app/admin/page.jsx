import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin({ searchParams }) {
  const { q = "", hal = "1" } = (await searchParams) || {};
  const queryCari = typeof q === "string" ? q.trim() : "";
  const nomorHalaman = Math.max(1, parseInt(hal, 10) || 1);
  const perHalaman = 12;
  const dari = (nomorHalaman - 1) * perHalaman;
  const sampai = dari + perHalaman - 1;

  const supabase = buatClientServer();

  // US-30: Rekapitulasi jumlah produk dan produk per kategori dari database
  const { data: semuaProduk = [] } = await supabase
    .from("produk")
    .select("kategori");

  const totalProduk = semuaProduk.length;
  const rekapKategori = semuaProduk.reduce((acc, item) => {
    const k = item.kategori?.trim() || "Tanpa Kategori";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const daftarKategori = Object.entries(rekapKategori).sort((a, b) => b[1] - a[1]);

  // US-33: Query produk di admin dengan pencarian database dan paginasi
  let query = supabase
    .from("produk")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (queryCari) {
    query = query.ilike("nama", `%${queryCari}%`);
  }

  const { data: daftarProduk = [], count = 0 } = await query.range(dari, sampai);
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / perHalaman));

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* US-30: Dashboard Ringkasan Admin */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-garis bg-permukaan/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Total Produk
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-teks">
            {totalProduk}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">
            Produk terdaftar di database
          </p>
        </div>

        <div className="rounded-2xl border border-garis bg-permukaan/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Total Kategori
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-teks">
            {daftarKategori.length}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">
            Kelompok kategori aktif
          </p>
        </div>

        <div className="rounded-2xl border border-garis bg-permukaan/50 p-5 sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Kategori Terbanyak
          </p>
          <p className="mt-2 text-xl font-bold text-teks truncate">
            {daftarKategori[0] ? daftarKategori[0][0] : "-"}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">
            {daftarKategori[0] ? `${daftarKategori[0][1]} produk` : "Belum ada produk"}
          </p>
        </div>
      </section>

      {/* US-30: Breakdown Jumlah Produk per Kategori */}
      <section className="rounded-2xl border border-garis bg-latar p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-teks-lembut mb-3">
          Jumlah Produk per Kategori
        </h2>
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map(([kategori, jumlah]) => (
            <div
              key={kategori}
              className="flex items-center gap-2 rounded-xl border border-garis bg-permukaan/30 px-3 py-1.5 text-xs font-medium"
            >
              <span className="text-teks">{kategori}</span>
              <span className="rounded-full bg-utama/15 px-2 py-0.5 text-[11px] font-bold text-utama">
                {jumlah}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Header Aksi Tabel */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-teks">Daftar Produk</h1>
          <p className="text-xs text-teks-lembut">
            Kelola, ubah, atau hapus produk katalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* US-35: Tombol Ekspor CSV */}
          <a
            href="/admin/ekspor"
            download="produk-katalog-umkm.csv"
            id="tombol-ekspor-csv"
            className="inline-flex items-center gap-2 rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Ekspor CSV</span>
          </a>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* US-33: Kolom Cari Produk Admin */}
      <form method="GET" action="/admin" className="flex items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={queryCari}
          placeholder="Cari nama produk di admin..."
          className="w-full max-w-sm rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut/60 focus:border-utama focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap transition-colors"
        >
          Cari
        </button>
        {queryCari && (
          <Link
            href="/admin"
            className="flex items-center rounded-lg border border-garis px-3 py-2 text-xs font-semibold text-teks-lembut hover:text-utama"
          >
            Reset
          </Link>
        )}
      </form>

      {/* Tabel Produk */}
      <TabelProduk daftarProduk={daftarProduk} />

      {/* US-33: Paginasi Tabel Admin */}
      {totalHalaman > 1 && (
        <nav className="flex flex-col gap-3 border-t border-garis pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-teks-lembut">
            Menampilkan {daftarProduk.length} dari {count} produk (Halaman {nomorHalaman} dari {totalHalaman})
          </p>
          <div className="flex items-center gap-2">
            {nomorHalaman > 1 ? (
              <Link
                href={`/admin?${new URLSearchParams({ ...(queryCari ? { q: queryCari } : {}), hal: String(nomorHalaman - 1) }).toString()}`}
                className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
              >
                &larr; Sebelumnya
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-garis/50 bg-permukaan px-3 py-1.5 text-xs text-teks-lembut/40">
                &larr; Sebelumnya
              </span>
            )}

            <span className="px-2 text-xs font-semibold text-teks">
              {nomorHalaman} / {totalHalaman}
            </span>

            {nomorHalaman < totalHalaman ? (
              <Link
                href={`/admin?${new URLSearchParams({ ...(queryCari ? { q: queryCari } : {}), hal: String(nomorHalaman + 1) }).toString()}`}
                className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
              >
                Berikutnya &rarr;
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-garis/50 bg-permukaan px-3 py-1.5 text-xs text-teks-lembut/40">
                Berikutnya &rarr;
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
