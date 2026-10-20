import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolModeGelap from "@/components/TombolModeGelap";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 text-sm font-semibold sm:gap-5">
            <Link href="/" className="text-teks hover:text-utama transition-colors">
              Katalog
            </Link>
            <Link href="/favorit" className="text-teks-lembut hover:text-utama transition-colors">
              Favorit
            </Link>
            <Link href="/tentang" className="text-teks-lembut hover:text-utama transition-colors">
              Tentang
            </Link>
          </nav>
          {/* US-25: Toggle Mode Gelap */}
          <TombolModeGelap />
        </div>
      </div>
    </header>
  );
}
