import { buatClientServer } from "@/lib/supabase/server";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = buatClientServer();

  let produkList = [];
  try {
    const { data } = await supabase.from("produk").select("id, created_at");
    if (data) produkList = data;
  } catch {
    produkList = [];
  }

  const ruteProduk = produkList.map((item) => ({
    url: `${baseUrl}/produk/${item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/favorit`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...ruteProduk,
  ];
}
