"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

const STORAGE_KEY = "umkm_keranjang";

export function simpanKeKeranjang(item) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];

    // Cari apakah item dengan id dan varian yang sama sudah ada
    const indexAda = list.findIndex(
      (i) => i.id === item.id && (i.varianId ?? null) === (item.varianId ?? null)
    );

    if (indexAda > -1) {
      list[indexAda].jumlah += item.jumlah || 1;
    } else {
      list.push(item);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("umkm:keranjang-berubah"));
  } catch (err) {
    console.error("Gagal menyimpan keranjang:", err);
  }
}

export default function Keranjang() {
  const [buka, setBuka] = useState(false);
  const [items, setItems] = useState([]);
  const [sudahDimuat, setSudahDimuat] = useState(false);

  function muatKeranjang() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    muatKeranjang();
    setSudahDimuat(true);

    function onUpdate() {
      muatKeranjang();
    }

    window.addEventListener("umkm:keranjang-berubah", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("umkm:keranjang-berubah", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  function ubahJumlah(index, perubahan) {
    const baru = [...items];
    const jumlahBaru = baru[index].jumlah + perubahan;
    if (jumlahBaru <= 0) {
      baru.splice(index, 1);
    } else {
      baru[index].jumlah = jumlahBaru;
    }
    setItems(baru);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(baru));
    window.dispatchEvent(new CustomEvent("umkm:keranjang-berubah"));
  }

  function hapusItem(index) {
    const baru = items.filter((_, i) => i !== index);
    setItems(baru);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(baru));
    window.dispatchEvent(new CustomEvent("umkm:keranjang-berubah"));
  }

  function kosongkanKeranjang() {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("umkm:keranjang-berubah"));
  }

  const totalJumlah = items.reduce((acc, curr) => acc + (curr.jumlah || 1), 0);
  const totalHarga = items.reduce(
    (acc, curr) => acc + (curr.harga || 0) * (curr.jumlah || 1),
    0
  );

  // US-21: Satu tombol mengirim seluruh isi keranjang dalam satu pesan WhatsApp
  const nomor = toko.nomorWhatsApp?.replace(/\D/g, "") || "";
  let barisItem = items
    .map((item, idx) => {
      const infoVarian = item.varianNama ? ` (Varian: ${item.varianNama})` : "";
      const subtotal = (item.harga || 0) * item.jumlah;
      return `${idx + 1}. ${item.nama}${infoVarian} - ${item.jumlah} pcs (${formatRupiah(subtotal)})`;
    })
    .join("\n");

  const pesanWhatsApp = `Halo ${toko.nama.trim()}, saya ingin memesan daftar produk berikut:\n\n${barisItem}\n\n*Total Belanja: ${formatRupiah(totalHarga)}*\n\nMohon diproses. Terima kasih!`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesanWhatsApp)}`;

  return (
    <>
      {/* Tombol pemicu keranjang di Header */}
      <button
        type="button"
        onClick={() => setBuka(true)}
        aria-label="Buka Keranjang Belanja"
        className="relative flex items-center justify-center rounded-lg border border-garis bg-permukaan p-2 text-teks hover:bg-latar transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {sudahDimuat && totalJumlah > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-bahaya text-[11px] font-bold text-white shadow">
            {totalJumlah}
          </span>
        )}
      </button>

      {/* Modal Drawer Keranjang */}
      {buka && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div
            className="flex h-full w-full max-w-md flex-col bg-latar border-l border-garis shadow-2xl p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-keranjang"
          >
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-garis pb-4">
              <div className="flex items-center gap-2">
                <h2 id="judul-keranjang" className="text-xl font-bold">
                  Keranjang Belanja
                </h2>
                <span className="rounded-full bg-permukaan px-2 py-0.5 text-xs font-semibold text-teks-lembut">
                  {totalJumlah} item
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBuka(false)}
                className="rounded-lg p-1 text-teks-lembut hover:bg-permukaan hover:text-teks"
                aria-label="Tutup keranjang"
              >
                ✕
              </button>
            </div>

            {/* List Item */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm font-medium text-teks-lembut">
                    Keranjang belanjamu masih kosong
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.varianId || idx}`}
                      className="flex items-center gap-3 rounded-xl border border-garis bg-permukaan p-3"
                    >
                      <img
                        src={item.foto_url || "/produk/kopi.svg"}
                        alt={item.nama}
                        className="h-14 w-14 rounded-lg object-cover bg-latar shrink-0 border border-garis"
                      />
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-sm font-bold leading-tight text-teks line-clamp-1">
                          {item.nama}
                        </h3>
                        {item.varianNama && (
                          <p className="text-xs text-teks-lembut">
                            Varian: {item.varianNama}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-harga mt-1">
                          {formatRupiah(item.harga)}
                        </p>
                      </div>

                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => ubahJumlah(idx, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:bg-permukaan"
                        >
                          &minus;
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.jumlah}
                        </span>
                        <button
                          type="button"
                          onClick={() => ubahJumlah(idx, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:bg-permukaan"
                        >
                          &#43;
                        </button>
                        <button
                          type="button"
                          onClick={() => hapusItem(idx)}
                          aria-label="Hapus item"
                          className="ml-2 text-teks-lembut hover:text-bahaya text-sm"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Total & WhatsApp Checkout */}
            {items.length > 0 && (
              <div className="border-t border-garis pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Total Harga:</span>
                  <span className="text-lg text-harga">{formatRupiah(totalHarga)}</span>
                </div>

                <a
                  href={urlWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-utama py-3 text-center font-bold text-white shadow-md hover:bg-utama-gelap transition-colors"
                >
                  Pesan Semua via WhatsApp
                </a>

                <button
                  type="button"
                  onClick={kosongkanKeranjang}
                  className="text-center text-xs text-teks-lembut hover:text-bahaya underline"
                >
                  Kosongkan keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
