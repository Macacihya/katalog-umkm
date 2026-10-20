"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import { simpanKeKeranjang } from "@/components/Keranjang";

export default function PilihVarianDanJumlah({ produk, daftarVarian = [] }) {
  const [notifKeranjang, setNotifKeranjang] = useState(false);
  const adaVarian = daftarVarian.length > 0;

  // Pilih varian pertama yang masih memiliki stok, atau varian pertama jika semua habis
  const varianAwal = adaVarian
    ? daftarVarian.find((v) => (v.stok ?? 10) > 0) || daftarVarian[0]
    : null;

  const [varianTerpilih, setVarianTerpilih] = useState(varianAwal);
  const [jumlah, setJumlah] = useState(1);

  // Harga & stok
  const stokProduk =
    produk.stok !== undefined && produk.stok !== null ? Number(produk.stok) : 99;
  const isHabis = varianTerpilih
    ? (varianTerpilih.stok ?? 10) <= 0
    : stokProduk <= 0;
  const stokMaksimal = varianTerpilih
    ? (varianTerpilih.stok ?? 99)
    : Math.max(1, stokProduk);

  const adaDiskon =
    !varianTerpilih &&
    Boolean(produk.harga_diskon) &&
    Number(produk.harga_diskon) < Number(produk.harga);
  const hargaNormal = varianTerpilih ? varianTerpilih.harga : produk.harga;
  const hargaSatuan = adaDiskon ? Number(produk.harga_diskon) : hargaNormal;

  const totalHarga = hargaSatuan * (isHabis ? 0 : jumlah);

  function gantiVarian(varian) {
    setVarianTerpilih(varian);
    const stokBaru = varian.stok ?? 99;
    if (stokBaru <= 0) {
      setJumlah(0);
    } else if (jumlah === 0 || jumlah > stokBaru) {
      setJumlah(1);
    }
  }

  function kurangiJumlah() {
    if (jumlah > 1) {
      setJumlah((prev) => prev - 1);
    }
  }

  function tambahJumlah() {
    if (jumlah < stokMaksimal) {
      setJumlah((prev) => prev + 1);
    }
  }

  function handleTambahKeranjang() {
    if (isHabis) return;
    simpanKeKeranjang({
      id: produk.id,
      nama: produk.nama,
      harga: hargaSatuan,
      foto_url: produk.foto_url,
      varianId: varianTerpilih?.id || null,
      varianNama: varianTerpilih?.nama || null,
      jumlah: jumlah || 1,
    });
    setNotifKeranjang(true);
    setTimeout(() => setNotifKeranjang(false), 2000);
  }

  // Format pesan WhatsApp otomatis (US-12 & US-48)
  const nomor = toko.nomorWhatsApp?.replace(/\D/g, "") || "";
  const infoVarian = varianTerpilih ? ` (Varian: ${varianTerpilih.nama})` : "";
  const pesan = `Halo, saya ingin memesan ${produk.nama}${infoVarian} sebanyak ${jumlah} pcs seharga ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Harga Dinamis (US-20) */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="rounded-md bg-harga-latar px-3 py-1 text-2xl font-extrabold text-harga">
          {formatRupiah(totalHarga > 0 ? totalHarga : hargaSatuan)}
        </span>
        {adaDiskon && (
          <span className="text-base text-teks-lembut line-through">
            {formatRupiah(hargaNormal * (isHabis ? 1 : Math.max(1, jumlah)))}
          </span>
        )}
        {jumlah > 1 && !isHabis && (
          <span className="text-xs text-teks-lembut">
            ({jumlah} &times; {formatRupiah(hargaSatuan)})
          </span>
        )}
      </div>

      {/* Pilihan Varian / Ukuran (US-48) */}
      {adaVarian && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Pilih Ukuran / Varian:
          </label>
          <div className="flex flex-wrap gap-2">
            {daftarVarian.map((varian) => {
              const aktif = varianTerpilih?.id === varian.id;
              const habis = (varian.stok ?? 10) <= 0;

              return (
                <button
                  key={varian.id}
                  type="button"
                  disabled={habis}
                  onClick={() => gantiVarian(varian)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                    habis
                      ? "cursor-not-allowed border-garis/60 bg-permukaan text-teks-lembut/50 line-through"
                      : aktif
                      ? "border-utama bg-utama/10 text-utama ring-2 ring-utama"
                      : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  <span>{varian.nama}</span>
                  <span className="font-normal opacity-75">
                    {formatRupiah(varian.harga)}
                  </span>
                  {habis && (
                    <span className="rounded bg-bahaya/10 px-1.5 py-0.5 text-[10px] font-bold text-bahaya">
                      Habis
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pilihan Jumlah Pembelian (US-12) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Jumlah:
          </label>
          <span className="text-xs text-teks-lembut">
            {isHabis ? (
              <span className="font-semibold text-bahaya">Stok Habis</span>
            ) : varianTerpilih?.stok !== undefined ? (
              `Sisa stok: ${varianTerpilih.stok} pcs`
            ) : (
              "Stok tersedia"
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-garis bg-latar">
            <button
              type="button"
              disabled={jumlah <= 1 || isHabis}
              onClick={kurangiJumlah}
              aria-label="Kurangi jumlah"
              className="flex h-10 w-10 items-center justify-center rounded-l-xl text-lg font-bold text-teks transition-colors hover:bg-permukaan disabled:cursor-not-allowed disabled:text-teks-lembut/40"
            >
              &minus;
            </button>
            <span className="flex h-10 w-12 items-center justify-center text-sm font-bold text-teks">
              {isHabis ? 0 : jumlah}
            </span>
            <button
              type="button"
              disabled={jumlah >= stokMaksimal || isHabis}
              onClick={tambahJumlah}
              aria-label="Tambah jumlah"
              className="flex h-10 w-10 items-center justify-center rounded-r-xl text-lg font-bold text-teks transition-colors hover:bg-permukaan disabled:cursor-not-allowed disabled:text-teks-lembut/40"
            >
              &#43;
            </button>
          </div>
          <span className="text-xs text-teks-lembut">pcs</span>
        </div>
      </div>

      {/* Tombol Aksi: Pesan via WhatsApp & Tambah ke Keranjang (US-21) */}
      <div className="flex flex-wrap gap-3 pt-2">
        {isHabis ? (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-garis bg-permukaan px-5 py-3 font-semibold text-teks-lembut/60 sm:w-auto"
          >
            Stok Habis
          </button>
        ) : (
          <>
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap transition-colors text-center"
            >
              Pesan via WhatsApp
            </a>
            <button
              type="button"
              onClick={handleTambahKeranjang}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-utama bg-permukaan px-5 py-3 font-semibold text-utama hover:bg-utama/10 transition-colors"
            >
              {notifKeranjang ? "✓ Ditambahkan" : "🛒 Tambah ke Keranjang"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
