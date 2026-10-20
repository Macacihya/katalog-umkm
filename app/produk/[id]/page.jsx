import Link from "next/link";
import { notFound } from "next/navigation";
import PilihVarianDanJumlah from "@/components/PilihVarianDanJumlah";
import TombolBagikan from "@/components/TombolBagikan";
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

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url || "/produk/kopi.svg"}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <TombolBagikan namaProduk={produk.nama} />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
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
  );
}


