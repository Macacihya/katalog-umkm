import { buatClientSesi, buatClientServer } from "@/lib/supabase/server";

function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  // 1. Verifikasi login di server (US-35)
  const supabaseAuth = await buatClientSesi();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return new Response(
      "Unauthorized: Anda harus login sebagai admin untuk mengekspor data.",
      {
        status: 401,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  // 2. Ambil semua data produk dari database
  const supabase = buatClientServer();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, kategori, harga, deskripsi, created_at")
    .order("id", { ascending: true });

  if (error || !daftarProduk) {
    return new Response("Gagal mengambil data produk dari database.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 3. Format CSV dengan escape karakter aman
  const header = [
    "ID",
    "Nama Produk",
    "Kategori",
    "Harga (Rp)",
    "Deskripsi",
    "Tanggal Dibuat",
  ];
  const baris = daftarProduk.map((p) =>
    [
      escapeCSV(p.id),
      escapeCSV(p.nama),
      escapeCSV(p.kategori),
      escapeCSV(p.harga),
      escapeCSV(p.deskripsi),
      escapeCSV(p.created_at),
    ].join(",")
  );

  const csvContent = [header.join(","), ...baris].join("\r\n");

  return new Response("\uFEFF" + csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="produk-katalog-umkm.csv"',
      "Cache-Control": "no-store",
    },
  });
}
