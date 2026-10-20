import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import KelolaVarianProduk from "@/components/KelolaVarianProduk";
import { ubahProduk } from "@/app/admin/actions";
import { buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
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

  let daftarVarian = [];
  try {
    const { data: vData } = await supabase
      .from("varian")
      .select("*")
      .eq("produk_id", id)
      .order("harga", { ascending: true });
    if (vData) daftarVarian = vData;
  } catch {
    daftarVarian = [];
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" aksi={ubahProduk} />
      <KelolaVarianProduk produkId={produk.id} daftarVarian={daftarVarian} />
    </div>
  );
}


