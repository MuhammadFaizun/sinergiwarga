# Sinergi Warga 🏡💡🛣️

**Sinergi Warga** adalah platform digital interaktif berbasis web yang dirancang untuk memudahkan warga melaporkan kerusakan fasilitas umum (Fasum) secara cepat dan transparan kepada pengurus RT/RW setempat. Dengan platform ini, koordinasi perbaikan fasilitas lingkungan menjadi lebih teratur, terpantau, dan akuntabel.

---

## 🚀 Fitur Utama

### 🙋‍♂️ Untuk Warga (Citizen Dashboard)
- **Lapor Kerusakan Fasum**: Laporkan kerusakan fasilitas umum seperti Lampu Jalan Penerangan mati, Jalan & Trotoar rusak, Saluran Air/Got mampet, dan fasilitas lainnya.
- **Unggah Foto Bukti**: Lampirkan foto bukti kondisi kerusakan fasilitas sebelum diperbaiki.
- **Pin Lokasi Peta Interaktif**: Tandai lokasi persis kerusakan di peta berbasis koordinat GPS (Latitude/Longitude) menggunakan Leaflet.
- **Pelacakan Status Laporan (Real-time Timeline)**: Pantau progres perbaikan dari status **Diterima (Pending)** ➔ **Terverifikasi** ➔ **Pengerjaan** ➔ **Selesai**.
- **Fitur Apresiasi**: Berikan apresiasi berupa pesan terima kasih kepada pengurus RT/RW dan tim lapangan setelah laporan selesai diperbaiki.

### 👨‍💼 Untuk Pengurus RT/RW (Admin Dashboard)
- **Ringkasan Statistik**: Dashboard pemantauan jumlah laporan yang masuk berdasarkan status (Baru, Diverifikasi, Diproses, Selesai).
- **Manajemen & Resolusi Laporan**:
  - Memberikan tanggapan/pesan balasan kepada pelapor terkait langkah tindak lanjut.
  - Mengunggah foto hasil pekerjaan setelah perbaikan selesai.
  - Memperbarui status pengerjaan secara real-time.

---

## 🛠️ Arsitektur & Teknologi

Proyek ini dibangun menggunakan teknologi modern:
- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router & Turbopack)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) & [React 19](https://react.dev/)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database Engine**: [SQLite](https://sqlite.org/) (Sangat cocok untuk kemudahan deployment dan development lokal)
- **Maps API**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) untuk visualisasi peta
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Validasi**: [Zod](https://zod.dev/) untuk validasi skema data
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) untuk pengetesan dan build otomatis

---

## ⚙️ Cara Memulai (Local Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di mesin lokal Anda:

### 1. Clone Repositori
```bash
git clone https://github.com/MuhammadFaizun/sinergiwarga.git
cd sinergiwarga
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Database (Prisma & SQLite)
Pastikan berkas `.env` sudah sesuai (secara bawaan database SQLite akan menggunakan berkas lokal `dev.db`):
```env
DATABASE_URL="file:./dev.db"
```

Jalankan perintah berikut untuk menyinkronkan skema database dengan SQLite dan membuat Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser Anda dan akses [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---

## 🧪 Pengujian & Pemeriksaan Kode

Untuk memastikan kualitas kode tetap baik dan tidak ada *bug*, Anda dapat menjalankan perintah uji coba berikut:

- **Menjalankan Unit Test (Validasi Skema)**:
  ```bash
  npm test
  ```
- **Menjalankan Pemeriksaan Linter (ESLint Check)**:
  ```bash
  npm run lint
  ```
- **Melakukan Build Produksi (Kompilasi Next.js & TS)**:
  ```bash
  npm run build
  ```

---

## 🤖 GitHub Actions CI Workflow

Aplikasi ini dilengkapi dengan alur otomatisasi Integrasi Berkelanjutan (CI) yang dikonfigurasi melalui `.github/workflows/ci.yml`. Setiap kali Anda melakukan `push` atau membuat `pull request` ke branch `main` atau `master`, GitHub Actions akan otomatis:
1. Memasang dependensi proyek (`npm ci`).
2. Membuat Prisma Client (`npx prisma generate`).
3. Menjalankan semua unit test (`npm test`).
4. Memeriksa kesalahan linter (`npm run lint`).
5. Memastikan proyek berhasil dikompilasi untuk produksi (`npm run build`).

Hasil pengujian otomatis ini dapat langsung dilihat pada tab **Actions** di repositori GitHub Anda.
