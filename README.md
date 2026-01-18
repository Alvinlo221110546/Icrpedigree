# 🐱 ICR Pedigree (CatLine)

**Sistem Pengelolaan Silsilah Kucing Digital**

---

## 👥 Disusun Oleh

| No | Nama Lengkap         | NIM        |
|----|----------------------|------------|
| 1  | ALVIN . LO           | 221110546  |
| 2  | Kenrick Fylan        | 221110113  |
| 3  | Sandy Agre Nicola    | 221110040  |
| 4  | Felicia              | 221111205  |
| 5  | Irfandi              | 221110290  |

**Universitas Mikroskil**  
Jl. M.H Thamrin No.140, Kec. Medan Kota, Kota Medan, Sumatera Utara 20212  
**TA 2025/2026**

---

## 📋 Daftar Isi

1. [Deskripsi Aplikasi](#-deskripsi-aplikasi)
2. [Langkah-Langkah Penggunaan](#-langkah-langkah-penggunaan)
3. [Informasi mengenai Aplikasi CatLine](#-informasi-mengenai-aplikasi-catline)
4. [Aplikasi atau File Tambahan](#-aplikasi-atau-file-tambahan-yang-digunakan-dalam-aplikasi)

---

## 📝 Deskripsi Aplikasi

**CatLine** adalah aplikasi web yang dirancang untuk mencatat, menyimpan, dan mengelola silsilah kucing secara digital. Aplikasi ini dibangun menggunakan arsitektur **Full Stack JavaScript**, dengan backend Express.js untuk logika bisnis dan API, frontend React + Vite untuk antarmuka yang responsif, serta MySQL untuk penyimpanan data. Seluruh komponen aplikasi dijalankan secara terintegrasi menggunakan Docker Compose untuk pengembangan lokal, dan Kubernetes dengan Minikube untuk manajemen container di lingkungan terdistribusi. Sistem ini juga dilengkapi monitoring menggunakan Prometheus dan Grafana, sehingga performa aplikasi dan status layanan dapat dipantau secara real-time, mendukung pengelolaan sistem yang stabil dan efisien.

---

## 🏗️ Arsitektur & Teknologi

**Arsitektur Sistem:**
```
[Frontend (React + Vite)] <-> [Backend (Node.js + Express)] <-> [Database (MySQL)] <-> [Docker + GitHub Actions]
```

**Stack Teknologi:**
- **Frontend:** React.js + Vite + Axios  
- **Backend:** Node.js + Express.js  
- **Database:** MySQL  
- **Containerization:** Docker & Docker Compose  
- **Orchestration:** Kubernetes + Minikube
- **Monitoring:** Prometheus + Grafana
- **CI/CD:** GitHub Actions

---

## ⚙️ Petunjuk Instalasi Lokal

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Alvinlo221110546/CatLine.git
cd CatLine
```

### 2️⃣ Konfigurasi Environment  
Salin file environment contoh dan sesuaikan nilainya:
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

---

#### �️ **Local Development (Docker Compose)**

�🔹 **Frontend** (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

🔹 **Backend** (`/backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - Local Docker
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASS=root123
DB_NAME=catline_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
SECRET_KEY_BASE64=your_secret_key_base64_here
# Gunakan perintah ini untuk generate key baru:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Cookie & CORS - Local
COOKIE_NAME=icr_token
CORS_ORIGIN=http://localhost:5173
```

---

#### ☁️ **Production (Railway)**

🔹 **Frontend** (`/frontend/.env`)
```env
VITE_API_URL=https://icrpedigreebe-production.up.railway.app
# Ganti dengan URL backend Railway Anda
```

🔹 **Backend** (`/backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration - Railway
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASS=your_railway_database_password_here
DB_NAME=railway

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_here
SECRET_KEY_BASE64=your_production_secret_key_base64_here

# Cookie & CORS - Production
COOKIE_NAME=icr_token
CORS_ORIGIN=https://ipicr.vercel.app
```

### 3️⃣ Jalankan Aplikasi dengan Docker Compose
```bash
docker-compose up --build
```

Aplikasi akan otomatis berjalan di:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 💻 Langkah-Langkah Penggunaan

### 1. Melihat Daftar Kucing

Setelah login, pengguna akan diarahkan ke **Dashboard Kucing Anda**, yang menampilkan daftar kucing secara terstruktur dalam tabel. Setiap baris memuat informasi penting seperti kode kucing, nama, ras, jenis kelamin, tanggal lahir, induk jantan (sire), induk betina (dam), peternak, dan catatan tambahan. Di bagian kanan tabel terdapat tiga tombol aksi:
- **Edit** (kuning) - mengubah data kucing
- **Hapus** (merah) - menghapus data
- **Scan Pedigree Certificate** (biru) - melihat sertifikat silsilah kucing

### 2. Menambah Kucing Baru

Klik tombol biru **"Tambah Hewan"** di bagian atas dashboard dan isi formulir:
- **Unique Code** (opsional), **Nama Kucing** (wajib), **Breed**, **Jenis Kelamin**
- **Tanggal Lahir** (DD/MM/YYYY), **Ayah (Sire)**, **Ibu (Dam)**
- **Catatan** dan **Birth Certificate** (upload dokumen)

### 3. Menyimpan Data Kucing Baru

Klik tombol **"Scan Pedigree Certificate"**. Sistem akan validasi dan menyimpan data. Notifikasi **"Hewan berhasil ditambahkan"** akan muncul.

### 4. Mengedit Data Kucing

Klik tombol kuning **"Edit"**, ubah field yang diperlukan, lalu klik **"Perbarui"** atau **"Batal"**.

### 5. Menghapus Kucing

Klik tombol merah **"Hapus"**, konfirmasi dengan **"Ya, hapus"** atau batalkan dengan **"Cancel"**.

> ⚠️ **Perhatian:** Tindakan penghapusan tidak dapat dibatalkan!

### 6. Melihat Visualisasi Pohon Keluarga

Klik tombol hijau **"Lihat Pedigree"** untuk menampilkan struktur silsilah kucing:
- **Kartu putih** - generasi induk langsung (parents)
- **Kartu biru muda** - generasi kakek-nenek (grandparents)

### 7. Melihat Halaman Daftar Kucing Breeder

Akses melalui menu **"Breeder Cats"** (memerlukan profil lengkap). Menampilkan katalog kucing dengan tombol **"Request Breeding via WhatsApp"**.

### 8. Melihat & Mengedit Profile Breeder

Akses melalui menu **"Profile"**. Klik **"Edit Profil"** untuk mengubah nama, nomor telepon, email, alamat, dan foto profil.

---

## 🏗️ Informasi mengenai Aplikasi CatLine

Aplikasi CatLine dibangun menggunakan arsitektur modern:

- **Frontend (React):** Antarmuka pengguna interaktif dan responsif dengan komponen UI reusable
- **Backend (Express.js):** REST API, autentikasi, validasi data, enkripsi, CRUD operations, dan integrasi ICR
- **Database (MySQL):** Manajemen database relational dengan dukungan transaksi ACID

### CI/CD Pipeline (GitHub Actions)

Setiap push ke branch `main`:
1. Checkout repository dan setup Docker Buildx
2. Login ke Docker Hub
3. Build dan push image (`alvinlo221110546/ipicr-backend:latest`, `alvinlo221110546/ipicr-frontend:latest`)
4. Deploy ke Kubernetes cluster

**Sumber Referensi:** [https://icrpedigree.com/frontend/Beranda](https://icrpedigree.com/frontend/Beranda)

---

## 📦 Aplikasi atau File Tambahan yang Digunakan dalam Aplikasi

### Cloudinary (Cloud Storage)

Menyimpan file media: foto profil kucing, foto profil breeder, dokumen birth certificate dan sertifikat pedigree.

**Keuntungan:** Optimasi otomatis gambar, penyimpanan scalable, backup terjamin, transformasi on-the-fly.

### Argo CD (Continuous Deployment)

Mengotomatisasi deployment ke Kubernetes dengan pendekatan GitOps.

---

## 🔗 Link Penting

- **GitHub:** [https://github.com/Alvinlo221110546/CatLine.git](https://github.com/Alvinlo221110546/CatLine.git)

### Video Implementasi

📹 **Video Dokumentasi Lengkap:**  
[Klik di sini untuk melihat video](https://mikroskilacid-my.sharepoint.com/:f:/g/personal/221110546_students_mikroskil_ac_id/IgDx7OtMc5Q5T5Q5bG72J8GnAd1hBB_ZH9gI4a142W9Vj5k?e=ODm433)

Video mencakup:
- **Implementasi Kubernetes** - Setup cluster, deployment, dan services
- **HPA (Horizontal Pod Autoscaler)** - Auto-scaling berdasarkan load
- **CI/CD Pipeline** - GitHub Actions untuk automated deployment
- **Monitoring Tool** - Prometheus & Grafana untuk pemantauan real-time

---

## � Fitur Tambahan — Contact (Kirim ke WhatsApp)

Pengguna dapat mengirimkan pesan langsung ke pengembang melalui form Contact dengan input nama, email, dan catatan.

---

© 2026 ICR Pedigree | All Rights Reserved  
**Universitas Mikroskil** - TA 2025/2026
