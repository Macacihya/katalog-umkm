-- Migrasi Database: Tabel Varian Produk (US-48 & US-12)
-- Cara pakai: Supabase Dashboard > SQL Editor > Tempel seluruh isi file ini > Run.
-- Aman dijalankan ulang (idempotent).

-- 1. Buat tabel varian
create table if not exists public.varian (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  harga integer not null check (harga >= 0),
  stok integer not null default 10 check (stok >= 0),
  created_at timestamptz not null default now()
);

-- 2. Aktifkan Row Level Security
alter table public.varian enable row level security;

-- 3. Kebijakan RLS
-- Admin berhak mengelola seluruh varian (tambah, ubah, hapus)
drop policy if exists "admin_kelola_varian" on public.varian;
create policy "admin_kelola_varian" on public.varian
  for all to authenticated using (true) with check (true);

-- Pengunjung / publik berhak membaca varian (bila dipanggil publik)
drop policy if exists "publik_baca_varian" on public.varian;
create policy "publik_baca_varian" on public.varian
  for select to anon using (true);

-- 4. Contoh data varian awal untuk produk ID 1 (Kopi) jika belum ada
insert into public.varian (produk_id, nama, harga, stok)
select p.id, v.nama, v.harga, v.stok
from public.produk p
cross join (values
  ('Kemasan 250 g', 45000, 15),
  ('Kemasan 500 g', 85000, 10),
  ('Kemasan 1 kg', 160000, 0) -- Contoh varian stok habis
) as v(nama, harga, stok)
where p.id = 1
  and not exists (select 1 from public.varian where produk_id = p.id);
