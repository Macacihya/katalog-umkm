// lib/gemini.js
// Dipanggil HANYA dari server (Server Action / Route Handler)

export async function buatDeskripsiProdukAI(nama, kategori) {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Kamu adalah copywriter profesional untuk katalog produk UMKM. Buatkan deskripsi produk yang menarik, ramah, dan ringkas (2-3 kalimat) dalam bahasa Indonesia untuk produk berikut:
Nama Produk: ${nama || "Produk UMKM"}
Kategori: ${kategori || "Umum"}

Jawab hanya dengan teks deskripsi produk saja, tanpa tanda kutip dan tanpa basa-basi.`;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gagal memanggil Gemini API:", err.message);
    }
  }

  // Fallback cerdas jika API key bermasalah atau kuota habis
  return `${nama || "Produk berkualitas"} merupakan produk pilihan unggulan dalam kategori ${kategori || "terbaik"} kami. Dibuat dengan bahan baku berkualitas tinggi dan proses yang teliti untuk memberikan pengalaman terbaik bagi Anda. Sangat cocok dinikmati atau digunakan sehari-hari.`;
}

export async function tanyaAsistenAI(pertanyaan, produk) {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Kamu adalah asisten layanan pelanggan ramah untuk produk toko UMKM. Jawab pertanyaan pengunjung HANYA berdasarkan informasi produk berikut. Jika informasinya tidak ada pada data produk, jawab dengan jujur bahwa pembeli dapat menghubungi penjual melalui WhatsApp.

Data Produk:
- Nama: ${produk.nama}
- Harga: Rp ${produk.harga}
- Kategori: ${produk.kategori || "-"}
- Deskripsi: ${produk.deskripsi || "-"}

Pertanyaan Pengunjung:
"${pertanyaan}"

Jawab dengan singkat, sopan, dan jelas (maksimal 3 kalimat).`;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gagal memanggil Gemini API tanya jawab:", err.message);
    }
  }

  // Fallback cerdas
  const qLower = pertanyaan.toLowerCase();
  if (qLower.includes("harga")) {
    return `Harga produk ${produk.nama} adalah Rp ${Number(produk.harga).toLocaleString("id-ID")}. Silakan pesan langsung via WhatsApp!`;
  }
  if (qLower.includes("kategori") || qLower.includes("jenis")) {
    return `Produk ${produk.nama} termasuk ke dalam kategori ${produk.kategori || "umum"}.`;
  }
  return `${produk.nama} adalah produk pilihan terbaik kami. Untuk pertanyaan lebih lanjut, silakan tanyakan langsung ke admin kami melalui tombol WhatsApp!`;
}
