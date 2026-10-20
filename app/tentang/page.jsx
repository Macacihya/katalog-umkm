import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami | ${toko.nama.trim()}`,
  description: `Profil dan kontak resmi ${toko.nama.trim()} - ${toko.tagline}`,
};

export default function HalamanTentang() {
  const nomorWA = toko.nomorWhatsApp?.replace(/\D/g, "") || "";
  const pesanHubungi = encodeURIComponent(
    `Halo ${toko.nama.trim()}, saya ingin bertanya mengenai produk di katalog Anda.`
  );
  const urlWhatsApp = `https://wa.me/${nomorWA}?text=${pesanHubungi}`;

  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke katalog
        </Link>
      </nav>

      {/* Profil Toko */}
      <section className="rounded-3xl border border-garis bg-permukaan/40 p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <span className="inline-flex self-start rounded-full bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
            Profil Resmi UMKM
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-teks sm:text-4xl">
            {toko.nama.trim()}
          </h1>
          <p className="text-lg font-medium text-teks-lembut">
            {toko.tagline}
          </p>
        </div>

        <div className="mt-8 border-t border-garis pt-8">
          <h2 className="text-base font-bold text-teks">Tentang Kami</h2>
          <p className="mt-2 text-sm leading-relaxed text-teks-lembut">
            Selamat datang di katalog resmi {toko.nama.trim()}. Kami berkomitmen
            menghadirkan produk berkualitas tinggi yang dikurasi khusus untuk
            memenuhi kebutuhan Anda. Setiap pesanan dilayani dengan cepat, aman, dan
            langsung terhubung dengan kami melalui layanan pelanggan WhatsApp.
          </p>
        </div>

        {/* Informasi Kontak & Operasional */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Alamat */}
          <div className="rounded-2xl border border-garis bg-latar p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-utama/10 text-utama">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
                  Alamat Toko
                </p>
                <p className="text-sm font-semibold text-teks">{toko.alamat}</p>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="rounded-2xl border border-garis bg-latar p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-utama/10 text-utama">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
                  Jam Buka
                </p>
                <p className="text-sm font-semibold text-teks">{toko.jamBuka}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action WhatsApp */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-utama/20 bg-utama/5 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-teks">Punya Pertanyaan?</h3>
            <p className="text-xs text-teks-lembut">
              Hubungi kami langsung via WhatsApp untuk pertanyaan seputar produk atau pemesanan.
            </p>
          </div>
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-utama px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
          >
            <span>Hubungi via WhatsApp</span>
            <span>&rarr;</span>
          </a>
        </div>
      </section>
    </div>
  );
}
