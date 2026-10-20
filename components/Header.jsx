import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolModeGelap from "@/components/TombolModeGelap";
import Keranjang from "@/components/Keranjang";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-4">
            <Link href="/" className="text-teks hover:text-utama transition-colors">
              Katalog
            </Link>
            <Link href="/favorit" className="text-teks-lembut hover:text-utama transition-colors">
              Favorit
            </Link>
            <Link href="/bandingkan" className="text-teks-lembut hover:text-utama transition-colors">
              Bandingkan
            </Link>
            <Link href="/tentang" className="text-teks-lembut hover:text-utama transition-colors">
              Tentang
            </Link>
          </nav>
          {/* US-21: Keranjang Belanja */}
          <Keranjang />
          {/* US-25: Toggle Mode Gelap */}
          <TombolModeGelap />
        </div>
      </div>
    </header>
  );
}
