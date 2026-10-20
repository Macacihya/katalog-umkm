import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import TombolFavorit from "@/components/TombolFavorit";

export default function KartuProduk({ produk }) {
  const isHabis =
    produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0;
  const adaDiskon =
    produk.harga_diskon && Number(produk.harga_diskon) < Number(produk.harga);
  const hargaTampil = adaDiskon ? produk.harga_diskon : produk.harga;

  // Logika badge (US-20): "Baru", "Terlaris", atau "Promo"
  const empatBelasHariLalu = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const isBaru =
    produk.badge === "Baru" ||
    (produk.created_at && new Date(produk.created_at).getTime() > empatBelasHariLalu);
  const isTerlaris = produk.badge === "Terlaris" || Boolean(produk.is_terlaris);

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-sm"
    >
      {/* Badge container di atas gambar (US-19 & US-20) */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
        {isHabis && (
          <span className="rounded-md bg-bahaya px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            Habis
          </span>
        )}
        {!isHabis && adaDiskon && (
          <span className="rounded-md bg-bahaya px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            Promo
          </span>
        )}
        {!isHabis && !adaDiskon && isTerlaris && (
          <span className="rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            Terlaris
          </span>
        )}
        {!isHabis && !adaDiskon && !isTerlaris && isBaru && (
          <span className="rounded-md bg-utama px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            Baru
          </span>
        )}
      </div>

      {/* Tombol Favorit (US-24) */}
      <div className="absolute right-2.5 top-2.5 z-10">
        <TombolFavorit produkId={produk.id} />
      </div>

      <img
        src={produk.foto_url || "/produk/kopi.svg"}
        alt={produk.nama}
        className={`aspect-square w-full bg-permukaan object-cover transition-opacity ${
          isHabis ? "opacity-60 grayscale" : ""
        }`}
      />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">
          {produk.nama}
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(hargaTampil)}
          </p>
          {adaDiskon && (
            <span className="text-xs text-teks-lembut line-through">
              {formatRupiah(produk.harga)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
