# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca docs/user-stories.md bagian US-01. Hubungkan katalog produk ke tabel "produk" di Supabase di sisi server. Tampilkan daftar produk menggunakan data nyata dari sumber data aplikasi dan hapus CatatanBelumAktif setelah selesai.

**Hasil:**
`app/page.jsx` mengambil data produk langsung dari tabel Supabase `produk` secara server-side dan merendernya dalam grid kartu produk. CatatanBelumAktif berhasil dihapus.

**Perbaikan:**
Menambahkan fallback penanganan error koneksi Supabase agar halaman beranda tetap stabil saat server database mengalami gangguan.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Detail produk berhasil diambil secara dinamis di server berdasarkan `params.id`. Jika ID tidak ditemukan, otomatis memanggil `notFound()`.

**Perbaikan:**
Menyesuaikan pembacaan parameter rute dinamis dengan spesifikasi Next.js 16 (`const { id } = await params`).

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Komponen `TombolWhatsApp.jsx` menghasilkan tautan `wa.me` dengan sanitasi nomor telepon dan format pesan pesanan otomatis ter-encode rapi.

**Perbaikan:**
Menambahkan atribut `rel="noopener noreferrer"` dan `target="_blank"` untuk keamanan pembukaan tab baru.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Sistem autentikasi Supabase Auth dengan Server Action selesai. Session cookie tersimpan aman dengan `@supabase/ssr`, login berhasil redirect ke `/admin`, dan tombol Keluar berfungsi membersihkan sesi.

**Perbaikan:**
Menormalkan URL Supabase yang memiliki akhiran `/rest/v1` agar pemanggilan endpoint autentikasi Supabase GoTrue tidak menghasilkan 404.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Server Action `gantiPasswordAction` berhasil memvalidasi sesi admin login, panjang minimal 8 karakter, kecocokan konfirmasi password, serta menampilkan pesan status di form.

**Perbaikan:**
Memastikan pesan error server ditampilkan dalam alert UI yang mudah dibaca oleh admin.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Dibuat `proxy.js` di root proyek untuk memproteksi seluruh rute `/admin/*` kecuali `/admin/login`. Admin tanpa sesi valid langsung dialihkan ke login. Setiap aksi di `actions.js` juga memverifikasi sesi server.

**Perbaikan:**
Mengonfigurasi matcher proxy agar mengabaikan aset statis dan API internal Next.js.

## Debugging dan fitur bonus

### US-08, US-09, US-10 Pengelolaan Produk Admin **[SENDIRI]**

**Prompt:**
Implementasikan pengelolaan produk oleh admin: US-08: tambah produk baru di /admin/produk/baru, US-09: ubah produk di /admin/produk/[id]/ubah terisi data lama, US-10: hapus produk dari database dengan konfirmasi modal/dialog. Validasi input wajib, format harga, dan proteksi login di server.

**Hasil:**
CRUD produk lengkap di sisi admin dengan validasi server, konfirmasi hapus, notifikasi aman, dan redirect otomatis.

**Perbaikan:**
Mencegah injeksi format harga non-numerik di Server Action dan membersihkan cache rute dengan `revalidatePath`.

### US-11, US-15, US-16 Filter Kategori, Pengurutan, dan Paginasi **[SENDIRI]**

**Prompt:**
Implementasikan filter pencarian nama & filter kategori (US-11), dropdown pilihan urutan harga/terbaru (US-15), dan navigasi paginasi server-side (US-16) di halaman utama katalog.

**Hasil:**
Pengunjung dapat mencari nama produk, menyaring kategori, memilih urutan (terbaru, termurah, termahal, nama A-Z), dan berpindah halaman dengan paginasi berbasis query Supabase.

**Perbaikan:**
Mereset halaman kembali ke halaman 1 setiap kali query pencarian, filter kategori, atau pengurutan diubah oleh pengunjung.

### US-12 & US-48 Pemilihan Varian dan Kuantitas Pembelian **[SENDIRI]**

**Prompt:**
Implementasikan pemilihan jumlah produk (US-12) dan pemilihan varian ukuran/harga masing-masing (US-48). Pastikan counter kuantitas memiliki batas stok, dan teks pesan WhatsApp otomatis memuat nama produk, varian yang dipilih, jumlah pcs, serta total harga.

**Hasil:**
Komponen `PilihVarianDanJumlah.jsx` menyediakan pemilihan varian ukuran, counter jumlah +/- yang dinamis, perhitungan total harga seketika, dan pembuatan URL pesan WhatsApp yang otomatis ter-encode.

**Perbaikan:**
Menambahkan skrip migrasi database non-breaking di `docs/migrasi-varian.sql` dan fallback jika tabel varian belum dieksekusi di database Supabase.

### US-13 Progressive Web App (PWA) **[SENDIRI]**

**Prompt:**
Implementasikan PWA menggunakan ikon yang tersedia di public/icons (US-13). Buat web app manifest dan tautkan ke halaman dengan warna tema yang sesuai identitas toko.

**Hasil:**
Dibuat `app/manifest.js` dan `public/manifest.json` yang merujuk ke `/icons/icon-192.png` dan `/icons/icon-512.png` dengan display standalone dan theme color `#1f6b4f`.

**Perbaikan:**
Menambahkan `<link rel="apple-touch-icon">` dan export `viewport = { themeColor: "#1f6b4f" }` di `app/layout.jsx` untuk dukungan penuh perangkat iOS & Android.

### US-22 Halaman Tentang dan Kontak Toko **[SENDIRI]**

**Prompt:**
Buat halaman Tentang dan kontak resmi toko di /tentang sesuai identitas di lib/toko.js (US-22). Tampilkan profil toko, alamat, jam operasional, dan tombol WhatsApp. Tautkan halaman ini di Header dan Footer.

**Hasil:**
Halaman `/tentang` dibuat rapi dengan informasi profil, jam buka, alamat, serta tombol chat langsung ke WhatsApp toko. Header dan Footer kini memuat tautan menuju halaman Tentang.

**Perbaikan:**
Menyesuaikan styling selaras dengan tema toko dan memastikan nomor WhatsApp disanitasi sebelum dialihkan.

### US-23 Bagikan atau Salin Link Produk **[SENDIRI]**

**Prompt:**
Tambahkan tombol bagikan atau salin tautan produk di halaman detail produk (US-23) menggunakan Web Share API dengan fallback Clipboard API serta umpan balik teks "Link tersalin!".

**Hasil:**
Komponen `TombolBagikan.jsx` dipasang di halaman detail produk. Saat ditekan, link disalin dan tombol menampilkan feedback "Link tersalin!" selama 2,5 detik.

**Perbaikan:**
Menyediakan fallback textarea/input untuk browser atau iframe yang membatasi akses `navigator.clipboard`.

### US-26 & US-27 Metadata SEO, Open Graph, Sitemap & Robots **[SENDIRI]**

**Prompt:**
Implementasikan dynamic metadata SEO & Open Graph di halaman detail produk menggunakan generateMetadata (US-26). Buat sitemap.xml dinamis dari database dan robots.txt valid yang menunjuk ke sitemap (US-27).

**Hasil:**
`app/produk/[id]/page.jsx` mengekspor `generateMetadata` dengan judul spesifik dan tag Open Graph (nama, foto, deskripsi). `app/sitemap.js` menyajikan XML sitemap seluruh URL produk, dan `app/robots.js` memblokir crawling admin serta mengarahkan ke sitemap.

**Perbaikan:**
Mengonfigurasi URL dasar ramah lingkungan lokal maupun hosting Vercel (`NEXT_PUBLIC_SITE_URL`).

### US-28 Halaman 404 dan Skeleton Loading Kustom **[SENDIRI]**

**Prompt:**
Sediakan halaman 404 kustom dengan tautan kembali ke beranda dan komponen skeleton loading di halaman katalog produk (US-28).

**Hasil:**
`app/not-found.jsx` menampilkan ilustrasi pesan ramah dengan tombol kembali ke katalog. `app/loading.jsx` menampilkan animasi shimmer skeleton kartu produk saat data sedang diambil.

**Perbaikan:**
Menambahkan status 404 yang tepat pada response HTTP Next.js saat produk dengan ID tidak valid diakses.

### US-19 & US-20 Status Stok, Harga Coret, dan Badge Produk **[SENDIRI]**

**Prompt:**
Tambahkan penanganan status stok habis dengan menonaktifkan tombol pemesanan WhatsApp (US-19). Tampilkan harga normal tercoret di samping harga diskon serta badge "Promo", "Baru", dan "Terlaris" pada kartu katalog dan detail produk (US-20).

**Hasil:**
`KartuProduk.jsx` dan `PilihVarianDanJumlah.jsx` kini mendukung rendering badge visual, harga coret diskon, dan status stok habis yang menonaktifkan pemesanan.

**Perbaikan:**
Menyediakan kalkulasi usia produk (`created_at`) untuk otomatis menampilkan badge "Baru" bila produk dirilis dalam 14 hari terakhir.

### US-30 Dashboard Ringkasan Admin **[SENDIRI]**

**Prompt:**
Buat ringkasan statistik toko di halaman /admin (US-30). Tampilkan total jumlah produk, total kategori unik, kategori terbanyak, dan rincian jumlah produk per kategori dari database yang hanya bisa diakses setelah login.

**Hasil:**
`app/admin/page.jsx` menyajikan kartu ringkasan Total Produk, Total Kategori, dan breakdown chip per kategori dari query tabel produk Supabase secara dinamis.

**Perbaikan:**
Mengurutkan kategori terbanyak ke terendah secara otomatis pada panel ringkasan admin.

### US-35 Ekspor Produk ke CSV **[SENDIRI]**

**Prompt:**
Buat fitur ekspor data seluruh produk ke format CSV di halaman admin (US-35). Buat Route Handler di server dengan verifikasi login admin, escaping karakter khusus yang aman, dan tombol unduh di /admin.

**Hasil:**
Route handler `app/admin/ekspor/route.js` menghasilkan file CSV dengan header Content-Disposition `attachment; filename="produk-katalog-umkm.csv"` dan escape tanda kutip/koma yang aman. Tanpa login sesi admin, endpoint menolak akses dengan status 401/307.

**Perbaikan:**
Menambahkan Byte Order Mark (BOM) UTF-8 (`\uFEFF`) agar file CSV terbuka sempurna di Microsoft Excel tanpa masalah encoding teks.

### US-33 Cari dan Paginasi di List Admin **[SENDIRI]**

**Prompt:**
Implementasikan kolom pencarian nama produk dan navigasi paginasi di tabel admin /admin (US-33). Simpan kata kunci pencarian (q) dan nomor halaman (hal) di parameter URL browser.

**Hasil:**
Admin dapat memfilter nama produk langsung ke database menggunakan parameter URL `?q=...` dan berpindah halaman dengan kontrol paginasi `?hal=...`.

**Perbaikan:**
Menambahkan tombol Reset pencarian dan memastikan filter pencarian tetap terjaga saat berpindah halaman.

### US-24 Favorit Tersimpan di Browser **[SENDIRI]**

**Prompt:**
Tambahkan fitur produk favorit (US-24). Berikan tombol hati (love) di kartu katalog dan detail produk yang tersimpan di localStorage browser, serta buat tampilan halaman khusus di /favorit yang hanya menampilkan produk favorit.

**Hasil:**
Komponen `TombolFavorit.jsx` mengelola status favorit secara reaktif via CustomEvent dan localStorage. Halaman `/favorit` menyaring daftar produk pilihan pengunjung dan menyediakan empty state jika belum ada produk tersimpan.

**Perbaikan:**
Mencegah event bubbling pada kartu produk agar menekan tombol favorit tidak langsung memicu navigasi ke halaman detail.

### US-25 Mode Gelap **[SENDIRI]**

**Prompt:**
Buat fitur Mode Gelap (Dark Mode) dengan toggle switch di Header (US-25). Pastikan pilihan mode tersimpan di localStorage, CSS token warna mudah dibaca, dan tema bertahan setelah halaman dimuat ulang.

**Hasil:**
`app/globals.css` memiliki variasi token warna CSS untuk `html.dark`. Komponen `TombolModeGelap.jsx` di Header memungkinkan peralihan instan antara tema terang dan gelap dengan persistensi localStorage.

**Perbaikan:**
Menambahkan properti CSS `color-scheme: dark` dan transisi halus pada elemen `html` untuk kenyamanan visual pengguna.

