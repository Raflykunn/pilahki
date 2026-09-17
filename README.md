# Pilahki Web App

Proyek ini merupakan Single Page Application (SPA) yang dibangun menggunakan Vue.js dan menggunakan [Supabase](https://supabase.com/) sebagai Backend-as-a-Service (BaaS) untuk database dan autentikasi.

## Prasyarat

Pastikan Anda sudah menginstal aplikasi berikut di komputer Anda:
- [Node.js](https://nodejs.org/) (versi 18 atau terbaru disarankan)
- [Git](https://git-scm.com/)

## Cara Instalasi (Clone dari GitHub)

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan proyek di lokal komputer Anda.

### 1. Clone Repository

Buka terminal/CMD dan jalankan perintah berikut:

```bash
git clone <URL_GITHUB_REPOSITORY_ANDA>
cd pilahki
```

*(Ganti `<URL_GITHUB_REPOSITORY_ANDA>` dengan URL repository Anda jika sudah diunggah).*

### 2. Instalasi Dependencies

Jalankan perintah berikut untuk menginstal semua library yang dibutuhkan (termasuk Vue dan Supabase):

```bash
npm install
```

### 3. Setup Environment Variables (Supabase)

Proyek ini membutuhkan konfigurasi variabel environment untuk terhubung ke Supabase.

1. Buat file baru bernama `.env` (tanpa nama tambahan) dari template `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan masukkan `URL` dan `ANON_KEY` dari project Supabase Anda:
   ```env
   VITE_SUPABASE_URL="https://xyzcompany.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR..."
   ```

*(Anda bisa mendapatkan nilai-nilai ini di dashboard Supabase proyek Anda pada bagian **Project Settings > API**).*

### 4. Jalankan Aplikasi

Jalankan development server dengan perintah:

```bash
npm run dev
```

Buka URL yang muncul di terminal (biasanya `http://localhost:5173`) di browser Anda.

---

## Struktur Proyek

- `src/` - Folder utama source code Vue.js.
- `.env.example` - Template file environment untuk referensi konfigurasi Supabase.
- `package.json` - Daftar dependency project.
