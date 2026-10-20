import Link from "next/link";
import DaftarFavorit from "@/components/DaftarFavorit";
import { buatClientServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Produk Favorit | ${toko.nama.trim()}`,
  description: "Daftar produk favorit yang Anda simpan di katalog toko.",
};

export const dynamic = "force-dynamic";

export default async function HalamanFavorit() {
  const supabase = buatClientServer();
  const { data: daftarSemuaProduk = [] } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-2">
        <Link
          href="/"
          className="text-xs text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
        >
          &larr; Kembali ke semua produk
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-teks sm:text-3xl">
          Produk Favorit
        </h1>
        <p className="text-sm text-teks-lembut">
          Koleksi produk yang telah Anda tandai untuk dilihat kembali nanti.
        </p>
      </div>

      <DaftarFavorit daftarSemuaProduk={daftarSemuaProduk} />
    </div>
  );
}
