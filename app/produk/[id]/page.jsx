import Link from "next/link";
import { notFound } from "next/navigation";
import PilihVarianDanJumlah from "@/components/PilihVarianDanJumlah";
import TombolBagikan from "@/components/TombolBagikan";
import TombolFavorit from "@/components/TombolFavorit";
import GaleriFotoProduk from "@/components/GaleriFotoProduk";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = buatClientServer();
  const { data: produk } = await supabase
    .from("produk")
    .select("nama, deskripsi, foto_url")
    .eq("id", id)
    .maybeSingle();

  if (!produk) {
    return {
      title: `Produk Tidak Ditemukan | ${toko.nama.trim()}`,
    };
  }

  const judul = `${produk.nama} | ${toko.nama.trim()}`;
  const deskripsi = produk.deskripsi || toko.tagline;
  const foto = produk.foto_url || "/produk/kopi.svg";

  return {
    title: judul,
    description: deskripsi,
    openGraph: {
      title: judul,
      description: deskripsi,
      images: [
        {
          url: foto,
          alt: produk.nama,
        },
      ],
    },
  };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = buatClientServer();

  const { data: produk } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!produk) {
    notFound();
  }

  // Ambil daftar varian produk jika tabel varian tersedia (US-48)
  let daftarVarian = [];
  try {
    const { data: varianData, error: errVarian } = await supabase
      .from("varian")
      .select("*")
      .eq("produk_id", id)
      .order("harga", { ascending: true });

    if (!errVarian && varianData) {
      daftarVarian = varianData;
    }
  } catch {
    daftarVarian = [];
  }

  // Ambil produk terkait dari kategori yang sama (US-17)
  let produkTerkait = [];
  if (produk.kategori) {
    try {
      const { data: terkait } = await supabase
        .from("produk")
        .select("*")
        .eq("kategori", produk.kategori)
        .neq("id", id)
        .limit(3);
      produkTerkait = terkait || [];
    } catch {
      produkTerkait = [];
    }
  }

  return (
    <>
      {/* Pencatat produk terakhir dilihat (US-36) */}
      <CatatTerakhirDilihat produk={produk} />

      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        {/* US-18: Galeri foto produk */}
        <GaleriFotoProduk fotoUrl={produk.foto_url} namaProduk={produk.nama} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
              Kembali ke katalog
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/bandingkan?p1=${produk.id}`}
                className="flex items-center gap-1 rounded-lg border border-garis bg-permukaan px-2.5 py-1.5 text-xs font-semibold text-teks-lembut hover:text-utama hover:border-utama transition-colors"
                title="Bandingkan produk ini"
              >
                ⚖️ Bandingkan
              </Link>
              <TombolFavorit produkId={produk.id} />
              <TombolBagikan namaProduk={produk.nama} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* US-49: Kategori tertaut ke /kategori/[slug] */}
            {produk.kategori ? (
              <Link
                href={`/kategori/${encodeURIComponent(produk.kategori)}`}
                className="text-sm font-medium text-utama underline underline-offset-2 hover:opacity-80"
              >
                {produk.kategori}
              </Link>
            ) : null}

            {produk.stok !== undefined && Number(produk.stok) <= 0 && (
              <span className="rounded bg-bahaya px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Habis
              </span>
            )}
            {Boolean(produk.harga_diskon) && Number(produk.harga_diskon) < Number(produk.harga) && (
              <span className="rounded bg-bahaya px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Promo
              </span>
            )}
            {Boolean(produk.is_terlaris) && (
              <span className="rounded bg-amber-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Terlaris
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          
          {/* Pemilihan Varian (US-48) dan Jumlah (US-12) */}
          <PilihVarianDanJumlah produk={produk} daftarVarian={daftarVarian} />
        </div>
      </article>

      {/* US-17: Produk terkait dari kategori yang sama */}
      {produkTerkait.length > 0 && (
        <section className="mt-8 border-t border-garis pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Produk terkait</h2>
            {produk.kategori && (
              <Link
                href={`/kategori/${encodeURIComponent(produk.kategori)}`}
                className="text-xs text-teks-lembut underline hover:text-utama"
              >
                Lihat semua {produk.kategori} &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}



