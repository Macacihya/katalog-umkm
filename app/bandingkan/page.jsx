import Link from "next/link";
import { buatClientServer } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Bandingkan Produk | ${toko.nama.trim()}`,
  description: "Bandingkan 2 produk pilihan secara berdampingan",
};

export default async function HalamanBandingkan({ searchParams }) {
  const sp = await searchParams;
  const p1Id = sp?.p1;
  const p2Id = sp?.p2;

  const supabase = buatClientServer();

  // Ambil semua daftar produk untuk pilihan dropdown perbandingan
  const { data: semuaProduk } = await supabase
    .from("produk")
    .select("id, nama, harga, foto_url, kategori, deskripsi")
    .order("nama", { ascending: true });

  const listProduk = semuaProduk || [];

  let produk1 = null;
  let produk2 = null;
  let errorP1 = false;
  let errorP2 = false;

  if (p1Id) {
    const item = listProduk.find((p) => String(p.id) === String(p1Id));
    if (item) {
      produk1 = item;
    } else {
      errorP1 = true;
    }
  }

  if (p2Id) {
    const item = listProduk.find((p) => String(p.id) === String(p2Id));
    if (item) {
      produk2 = item;
    } else {
      errorP2 = true;
    }
  }

  return (
    <div className="py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke katalog
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Bandingkan 2 Produk
        </h1>
        <p className="text-sm text-teks-lembut">
          Pilih maksimal dua produk untuk melihat perbandingan spesifikasi dan harga secara berdampingan.
        </p>
      </div>

      {/* Form Pemilihan 2 Produk */}
      <form
        method="GET"
        action="/bandingkan"
        className="mb-8 grid gap-4 rounded-2xl border border-garis bg-permukaan p-5 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Produk Pertama:
          </label>
          <select
            name="p1"
            defaultValue={produk1?.id || ""}
            className="rounded-xl border border-garis bg-latar px-3 py-2 text-sm text-teks"
          >
            <option value="">-- Pilih Produk 1 --</option>
            {listProduk.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} ({formatRupiah(p.harga)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Produk Kedua:
          </label>
          <select
            name="p2"
            defaultValue={produk2?.id || ""}
            className="rounded-xl border border-garis bg-latar px-3 py-2 text-sm text-teks"
          >
            <option value="">-- Pilih Produk 2 --</option>
            {listProduk.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} ({formatRupiah(p.harga)})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-utama py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-utama-gelap transition-colors"
          >
            Bandingkan Sekarang
          </button>
        </div>
      </form>

      {/* Peringatan jika produk tidak ditemukan (US-37) */}
      {(errorP1 || errorP2) && (
        <div className="mb-6 rounded-xl border border-bahaya/40 bg-bahaya/10 p-4 text-sm font-medium text-bahaya">
          {errorP1 && errorP2
            ? "Kedua produk yang dicari tidak ditemukan."
            : errorP1
            ? "Produk pertama tidak ditemukan di database."
            : "Produk kedua tidak ditemukan di database."}
        </div>
      )}

      {/* Tabel Komparasi Berdampingan (US-37) */}
      {produk1 && produk2 ? (
        <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-garis bg-permukaan">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-teks-lembut w-1/4">
                  Spesifikasi
                </th>
                <th className="p-4 text-base font-bold text-teks w-3/8 border-l border-garis">
                  {produk1.nama}
                </th>
                <th className="p-4 text-base font-bold text-teks w-3/8 border-l border-garis">
                  {produk2.nama}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis text-sm">
              <tr>
                <td className="p-4 font-semibold text-teks-lembut">Foto Produk</td>
                <td className="p-4 border-l border-garis">
                  <img
                    src={produk1.foto_url || "/produk/kopi.svg"}
                    alt={produk1.nama}
                    className="h-40 w-40 rounded-xl object-cover bg-permukaan border border-garis"
                  />
                </td>
                <td className="p-4 border-l border-garis">
                  <img
                    src={produk2.foto_url || "/produk/kopi.svg"}
                    alt={produk2.nama}
                    className="h-40 w-40 rounded-xl object-cover bg-permukaan border border-garis"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-teks-lembut">Kategori</td>
                <td className="p-4 border-l border-garis">
                  <span className="rounded-md bg-permukaan px-2.5 py-1 text-xs font-medium text-teks">
                    {produk1.kategori || "-"}
                  </span>
                </td>
                <td className="p-4 border-l border-garis">
                  <span className="rounded-md bg-permukaan px-2.5 py-1 text-xs font-medium text-teks">
                    {produk2.kategori || "-"}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-teks-lembut">Harga</td>
                <td className="p-4 border-l border-garis">
                  <span className="text-lg font-extrabold text-harga">
                    {formatRupiah(produk1.harga)}
                  </span>
                </td>
                <td className="p-4 border-l border-garis">
                  <span className="text-lg font-extrabold text-harga">
                    {formatRupiah(produk2.harga)}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-teks-lembut">Deskripsi</td>
                <td className="p-4 border-l border-garis leading-relaxed text-teks-lembut">
                  {produk1.deskripsi || "Tidak ada deskripsi."}
                </td>
                <td className="p-4 border-l border-garis leading-relaxed text-teks-lembut">
                  {produk2.deskripsi || "Tidak ada deskripsi."}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-teks-lembut">Aksi</td>
                <td className="p-4 border-l border-garis">
                  <Link
                    href={`/produk/${produk1.id}`}
                    className="inline-flex rounded-lg bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap"
                  >
                    Lihat Detail & Pesan
                  </Link>
                </td>
                <td className="p-4 border-l border-garis">
                  <Link
                    href={`/produk/${produk2.id}`}
                    className="inline-flex rounded-lg bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap"
                  >
                    Lihat Detail & Pesan
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-garis bg-permukaan p-12 text-center text-teks-lembut">
          <p className="font-semibold text-teks">Belum ada 2 produk yang dipilih</p>
          <p className="mt-1 text-xs">
            Pilih dua produk dari dropdown di atas untuk memulai perbandingan.
          </p>
        </div>
      )}
    </div>
  );
}
