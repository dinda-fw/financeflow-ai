# FinanceFlow AI 🚀

FinanceFlow AI adalah aplikasi pelacakan keuangan generasi berikutnya (Next-Gen Financial Tracker) yang berfokus pada analisis cerdas dan kemudahan penggunaan. Aplikasi ini dibangun untuk membantu anak kos, pelajar, hingga pekerja profesional dalam melacak pengeluaran, mengatur budget, dan mengoptimalkan tabungan dengan bantuan Kecerdasan Buatan (AI).

## ✨ Fitur Utama

- **📊 Dashboard & Budgeting**: Visualisasi kesehatan keuanganmu dengan rasio standar 50/30/20 (Needs/Wants/Savings). Terdapat fitur *Panic Mode* untuk mengunci pengeluaran saat dana sedang kritis.
- **📸 AI Receipt Scanner**: Tidak perlu lagi mencatat pengeluaran secara manual! Cukup unggah foto struk belanjamu atau screenshoot riwayat transaksi di hpmu, dan Google Gemini AI akan secara otomatis membaca total harga, nama toko, dan mengkategorikannya ke dalam pos pengeluaran yang tepat.
- **🎯 Goals & Plan**: Pasang target tabungan (seperti membeli laptop atau dana darurat) dan biarkan AI memberikan saran tabungan per bulan agar targetmu tercapai lebih cepat.
- **💳 Cashflow Accounts**: Lacak arus kas dari berbagai sumber seperti Bank (BCA, Mandiri, dll), e-Wallet (GoPay, OVO), dan Tabungan Tunai di satu tempat.
- **🤖 Reports & AI Insights**: Dapatkan laporan mendalam bergaya *statement* bank dengan saran-saran praktis langsung dari AI Financial Advisor yang menganalisis pola belanjamu (misal: kebocoran dana pada kategori hiburan).

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan *stack* teknologi modern terbaik untuk memastikan performa yang cepat dan pengalaman pengguna yang luar biasa:

- **Frontend**: React.js, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Recharts (untuk visualisasi data)
- **Kecerdasan Buatan (AI)**: Google Gemini 1.5 Flash (via API) untuk *Receipt Parsing* dan *Financial Advisor*.
- **Backend & Database**: **Supabase** ⚡
  - Aplikasi ini terintegrasi dengan arsitektur **Supabase** (PostgreSQL) sebagai *Backend-as-a-Service* (BaaS) utama untuk menyimpan data otentikasi pengguna, riwayat transaksi, limit budget, dan progres *goals* secara aman dan *real-time*.

## 🚀 Cara Menjalankan Aplikasi (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal:

### 1. Clone Repositori
```bash
git clone 
cd financeflow-ai
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat sebuah file bernama `.env` di root folder *project*, dan masukkan API Key Gemini kamu:
```env
VITE_GEMINI_API_KEY="AIzaSy_API_KEY_KAMU_DISINI"
```
*(Catatan: Untuk Supabase, pastikan juga kamu mengatur koneksi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` pada tahapan produksi jika dibutuhkan)*

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses URL yang tertera di terminal (biasanya `http://localhost:5173`).

---

