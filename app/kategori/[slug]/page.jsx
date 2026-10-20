import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { buatClientServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  return {
    title: `Kategori: ${decodedSlug} | ${toko.nama.trim()}`,
    description: `Daftar produk kategori ${decodedSlug} di katalog ${toko.nama.trim()}`,
  };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "").trim();

  if (!decodedSlug) {
    notFound();
  }

  const supabase = buatClientServer();

  // Query produk dari kategori yang diminta (case-insensitive)
  const { data: produkList, error } = await supabase
    .from("produk")
    .select("*")
    .ilike("kategori", decodedSlug)
    .order("created_at", { ascending: false });

  if (error || !produkList || produkList.length === 0) {
    notFound();
  }

  const namaKategori = produkList[0]?.kategori || decodedSlug;

  return (
    <div className="py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke semua produk
        </Link>
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Kategori: {namaKategori}
          </h1>
          <span className="text-sm text-teks-lembut">
            {produkList.length} produk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {produkList.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}
