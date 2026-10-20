import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import Paginasi from "@/components/Paginasi";
import Tombol from "@/components/Tombol";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import { buatClientServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

const PER_HALAMAN = 9;

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const kategori = typeof sp?.kategori === "string" ? sp.kategori.trim() : "";
  const urutan = typeof sp?.urutan === "string" ? sp.urutan.trim() : "terbaru";
  const halamanRaw = typeof sp?.halaman === "string" ? sp.halaman.trim() : "1";
  const halaman = Math.max(1, parseInt(halamanRaw, 10) || 1);

  let daftarProduk = [];
  let daftarKategori = [];
  let totalProduk = 0;
  let totalHalaman = 1;
  let pesanError = null;

  try {
    const supabase = buatClientServer();

    // Ambil daftar kategori unik untuk tab filter (US-11)
    const { data: dataKategori, error: errKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (!errKategori && dataKategori) {
      daftarKategori = Array.from(
        new Set(dataKategori.map((item) => item.kategori).filter(Boolean))
      ).sort();
    }

    // Bangun query produk utama
    let query = supabase.from("produk").select("*", { count: "exact" });

    // US-11: Filter pencarian nama
    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    // US-11: Filter kategori
    if (kategori && kategori !== "semua") {
      query = query.eq("kategori", kategori);
    }

    // US-15: Pengurutan query database
    switch (urutan) {
      case "termurah":
        query = query.order("harga", { ascending: true });
        break;
      case "termahal":
        query = query.order("harga", { ascending: false });
        break;
      case "nama":
        query = query.order("nama", { ascending: true });
        break;
      case "terbaru":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // US-16: Paginasi database query
    const dari = (halaman - 1) * PER_HALAMAN;
    const sampai = dari + PER_HALAMAN - 1;
    query = query.range(dari, sampai);

    const { data, count, error } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalProduk = count || 0;
      totalHalaman = Math.max(1, Math.ceil(totalProduk / PER_HALAMAN));
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data produk dari server.";
  }

  const adaFilterAktif = Boolean(
    q || (kategori && kategori !== "semua") || (urutan && urutan !== "terbaru")
  );

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          <FilterKatalog
            daftarKategori={daftarKategori}
            kategoriAktif={kategori}
            queryAktif={q}
            urutanAktif={urutan}
          />
        </div>

        {pesanError ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
            <Tombol href="/" className="mt-4 inline-flex" varian="garis">
              Muat ulang katalog
            </Tombol>
          </div>
        ) : daftarProduk.length === 0 ? (
          adaFilterAktif ? (
            <div className="rounded-2xl border border-dashed border-garis bg-permukaan p-10 text-center">
              <p className="text-base font-semibold text-teks">Tidak ada produk yang cocok</p>
              <p className="mt-1 text-sm text-teks-lembut">
                Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
              </p>
              <div className="mt-5">
                <Tombol href="/" varian="garis">
                  Reset semua filter
                </Tombol>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-garis bg-permukaan p-8 text-center text-teks-lembut">
              Belum ada produk
            </p>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            <Paginasi
              halamanSekarang={halaman}
              totalHalaman={totalHalaman}
              totalProduk={totalProduk}
              perHalaman={PER_HALAMAN}
              q={q}
              kategori={kategori}
              urutan={urutan}
            />
          </>
        )}
      </section>

      {/* Bagian Terakhir Dilihat (US-36) */}
      <TerakhirDilihat />
    </>
  );
}


