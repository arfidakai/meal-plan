# 🥗 CleanEat — Personal Healthy Meal Planner & Tracker

**CleanEat** adalah aplikasi web manajemen kesehatan dan perencanaan makan (*meal planner*) berbasis **Next.js (App Router)** dan **TypeScript** yang dirancang untuk membantu pengguna mengadopsi gaya hidup *clean eating* secara konsisten, personal, dan ramah di kantong. 

Berbeda dengan aplikasi diet konvensional yang rumit, CleanEat berfokus pada penyederhanaan alur pengguna (*user flow*) dengan menghitung preferensi nutrisi, estimasi anggaran harian, target BMI, hingga pembatasan bahan makanan tertentu langsung ke dalam jadwal menu harian pengguna.

---

### ✨ Fitur Utama
* **Personalized Onboarding & Stepper:** Alur pendaftaran data fisik (Berat Badan, Tinggi Badan, Usia) yang otomatis menghitung skor BMI (*Body Mass Index*) secara *real-time*, disusul dengan penentuan level aktivitas dan target utama (*weight loss, gain, or maintenance*).
* **Contextual Budget & Frequency Tracker:** Pengguna dapat menyesuaikan alokasi anggaran belanja makanan per hari beserta frekuensi makan yang diinginkan agar rencana makan tetap realistis untuk menjalani.
* **Interactive Food Preference Chips (+ Custom In-App Items):** Fitur pemilihan bahan makanan mentah (Suka/Tidak Suka) yang dibagi per kategori makro. Dilengkapi fitur penambahan makanan kustom (nama, kalori, estimasi harga) melalui *floating action interface* yang langsung tersinkronisasi dengan database preferensi pengguna.
* **Dynamic Smart Tips Engine:** Sistem *helper* pintar di halaman *Meal Plan* yang secara acak merotasi tips kesehatan dan *budget hacks* personal, disesuaikan secara dinamis berdasarkan kombinasi profil fisik, limit anggaran, dan tujuan kesehatan pengguna.
* **Clean & Scannable Mobile-First UI:** Menggunakan tata letak navigasi bawah (*bottom navigation*) 4-menu utama yang lega dan ergonomis, serta pemanfaatan *kebab-menu dropdown* modern untuk menyembunyikan pengaturan sekunder agar tampilan tetap rapi.

---

### 🛠️ Tech Stack & Arsitektur
* **Framework:** Next.js (App Router, React Server & Client Components)
* **Bahasa:** TypeScript (Strict Typing untuk Keamanan Data)
* **State Management:** React Hooks (`useState`, `useEffect`, `useMemo` untuk optimalisasi performa komputasi *tips engine*)
* **Styling:** Modular Custom CSS dengan *Design Tokens* bawaan demi konsistensi tema estetik natural/organik.
* **Data Handling:** RESTful API untuk memproses data preferensi kuliner berbasis *session tokens* lokal (`localStorage`).

---

### 📂 Struktur Komponen Hasil Refaktorisasi
Project ini menggunakan prinsip *Code Splitting* untuk memisahkan logika kalkulasi dengan elemen visual UI agar mudah dirawat (*maintainable*):
* `lib/tipsEngine.ts`: Pusat kalkulasi dan logika penentuan rekomendasi nutrisi personal.
* `components/ProfileScreen.tsx`: File utama profil pengguna yang mengadopsi struktur *dropdown menu*.
* `components/ProfileStep.tsx`: Pecahan sub-komponen form agar kode tetap ramping.