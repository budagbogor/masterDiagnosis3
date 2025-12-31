# AutoDiag Master AI

Sistem Diagnosa Otomotif Berbasis Artificial Intelligence untuk kendaraan di Indonesia.

## 🚗 Fitur Utama

### 1. Wizard Diagnosa Kendaraan
- **Database Kendaraan Lengkap**: Mencakup semua merek dan model kendaraan yang beredar di Indonesia dalam 15 tahun terakhir
- **Input Gejala Komprehensif**: Suara, getaran, bau, lampu indikator, dan kondisi munculnya masalah
- **Kode Error DTC**: Input dan analisis kode error dari scanner OBD-II
- **Riwayat Service**: Tracking service terakhir dan parts yang pernah diganti

### 2. AI Master Technician
- **Analisis Cerdas**: Menggunakan AI untuk menganalisis gejala dan memberikan diagnosis akurat
- **Confidence Level**: Tingkat kepercayaan AI terhadap diagnosis yang diberikan
- **Multiple Scenarios**: Memberikan kemungkinan penyebab utama dan alternatif
- **Estimasi Biaya**: Perhitungan estimasi biaya parts dan labor berdasarkan harga pasar Indonesia

### 3. Laporan Profesional
- **Desain Technical Dashboard**: Layout blok-blok profesional yang mudah dibaca
- **Export PDF**: Generate laporan PDF dengan desain compact dan professional
- **Tab Navigation**: Overview, Diagnosis, Theory, Repair, Cost Analysis
- **Visual Metrics**: Confidence meter, complexity rating, cost breakdown

### 4. DTC Library Professional
- **Database DTC Lengkap**: Kode error OBD-II dengan penjelasan detail
- **Search & Filter**: Pencarian berdasarkan kode atau deskripsi
- **Kategori Sistem**: Organized berdasarkan sistem kendaraan
- **Troubleshooting Guide**: Panduan langkah-langkah perbaikan

### 5. Riwayat Diagnosa
- **History Tracking**: Menyimpan semua diagnosa yang pernah dilakukan
- **Quick Access**: Akses cepat ke hasil diagnosa sebelumnya
- **Export Reports**: Generate ulang laporan dari riwayat

## 🛠️ Teknologi

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: SQLite dengan Prisma ORM
- **AI Integration**: OpenAI GPT untuk analisis diagnosa
- **PDF Generation**: jsPDF untuk laporan
- **Styling**: Professional technical design system

## 🚀 Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/budagbogor/kiro-1.git
cd kiro-1
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env dan tambahkan API keys yang diperlukan
```

4. **Setup Database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Run Development Server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Cara Penggunaan

### 1. Mulai Diagnosa Baru
- Klik "Mulai Diagnosa" di halaman utama
- Pilih merek, model, dan tahun kendaraan
- Input keluhan utama pelanggan
- Pilih gejala yang dialami (suara, getaran, bau, dll)
- Masukkan kode error DTC jika ada
- Submit untuk analisis AI

### 2. Lihat Hasil Diagnosa
- **Overview Tab**: Ringkasan diagnosis dengan metrics utama
- **Diagnosis Tab**: Langkah-langkah diagnosa sistematis
- **Theory Tab**: Penjelasan teori kerja komponen
- **Repair Tab**: Prosedur perbaikan detail dengan parts dan tools
- **Cost Tab**: Analisis biaya parts dan labor

### 3. Generate Laporan PDF
- Klik tombol "Export PDF" di halaman hasil diagnosa
- Laporan akan diunduh otomatis dengan desain professional
- Format compact dengan layout blok-blok yang menarik

### 4. Akses DTC Library
- Klik menu "Library DTC" untuk mengakses database kode error
- Search berdasarkan kode atau deskripsi
- Filter berdasarkan sistem kendaraan
- Lihat troubleshooting guide untuk setiap kode

## 🔧 Konfigurasi

### Environment Variables
```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL="file:./db/custom.db"

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Schema
Project menggunakan Prisma dengan schema yang mencakup:
- **Vehicle**: Data kendaraan (brand, model, engine, etc.)
- **Diagnosis**: Record diagnosa dengan AI analysis
- **Report**: Generated PDF reports
- **DTCCode**: Database kode error OBD-II

## 🎨 Design System

### Color Palette
- **Primary**: Blue-600 (#3B82F6) - untuk elemen utama
- **Success**: Green-500 (#10B981) - untuk status positif
- **Warning**: Amber-500 (#F59E0B) - untuk peringatan
- **Danger**: Red-500 (#EF4444) - untuk error dan masalah
- **Info**: Purple-600 (#9333EA) - untuk informasi tambahan

### Layout Principles
- **Block-based Design**: Setiap section menggunakan blok berwarna
- **Technical Dashboard**: Layout yang familiar untuk teknisi
- **Responsive**: Mobile-first approach
- **Professional**: Clean, modern, dan mudah dibaca

## 📊 Data Kendaraan

Database mencakup kendaraan yang beredar di Indonesia:
- **Toyota**: Avanza, Innova, Fortuner, Camry, Corolla, dll
- **Honda**: Brio, Jazz, City, Civic, CR-V, HR-V, dll
- **Mitsubishi**: Mirage, Xpander, Pajero, Outlander, dll
- **Suzuki**: Ertiga, Swift, Baleno, Jimny, dll
- **Daihatsu**: Ayla, Sigra, Terios, Xenia, dll
- **Nissan**: March, Livina, X-Trail, Serena, dll
- **Dan merek lainnya**: Mazda, Hyundai, KIA, Wuling, DFSK

Setiap model dilengkapi dengan:
- Varian lengkap (tipe, grade)
- Kode mesin yang akurat
- Tahun produksi
- Spesifikasi transmisi

## 🤖 AI Features

### Master Technician AI
- **Symptom Analysis**: Analisis gejala berdasarkan input user
- **Pattern Recognition**: Mengenali pola kerusakan umum
- **Cost Estimation**: Estimasi biaya berdasarkan harga pasar Indonesia
- **Repair Procedures**: Generate langkah perbaikan detail
- **Quality Assurance**: Checklist quality control

### Mock Mode
- Sistem otomatis beralih ke mock mode jika AI tidak tersedia
- Popup notification memberitahu user tentang status koneksi
- Data simulasi tetap memberikan hasil yang berguna

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic diagnosis wizard
- ✅ AI integration
- ✅ Professional report design
- ✅ DTC library
- ✅ Vehicle database Indonesia

### Phase 2 (Planned)
- 🔄 Advanced AI models
- 🔄 Image recognition untuk visual diagnosis
- 🔄 Integration dengan workshop management
- 🔄 Mobile app version
- 🔄 Multi-language support

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/budagbogor/kiro-1](https://github.com/budagbogor/kiro-1)

---

**AutoDiag Master AI** - Revolutionizing automotive diagnostics with artificial intelligence for Indonesian market.