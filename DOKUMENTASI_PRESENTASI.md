# Dokumentasi Presentasi MindMate AI

## 1. Deskripsi Program

MindMate AI adalah aplikasi pendamping belajar untuk membantu mahasiswa mengatur tugas, membaca mood, membuat rencana belajar, memantau jadwal deadline, memberi alarm peringatan, dan melihat analitik produktivitas.

Program ini menggunakan React + Vite + Tailwind CSS. AI yang digunakan adalah **rule-based AI** atau sistem rekomendasi cerdas berbasis aturan, sehingga dapat berjalan tanpa API berbayar dan mudah dijelaskan saat presentasi.

## 2. Tujuan Program

Tujuan MindMate AI adalah membantu user menentukan tugas mana yang harus dikerjakan terlebih dahulu berdasarkan:

1. Deadline tugas.
2. Tingkat kesulitan tugas.
3. Mood user.
4. Energi user.
5. Status tugas.
6. Alarm deadline yang hampir tiba.

## 3. Struktur Folder

```txt
src/
├── App.jsx
├── main.jsx
├── index.css
│
├── components/
│   ├── Button.jsx
│   ├── Header.jsx
│   ├── Modal.jsx
│   ├── Sidebar.jsx
│   └── StatCard.jsx
│
├── data/
│   └── initialData.js
│
├── lib/
│   ├── mindmateAI.js
│   └── storage.js
│
└── pages/
    ├── Landing.jsx
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── Beranda.jsx
    ├── TugasSaya.jsx
    ├── CheckInMood.jsx
    ├── RencanaAI.jsx
    ├── Jadwal.jsx
    ├── Analitik.jsx
    ├── AsistenAI.jsx
    └── Profil.jsx
```

## 4. Fitur Utama

| Fitur | Fungsi |
|---|---|
| Beranda | Menampilkan ringkasan tugas, mood, alarm deadline, dan rekomendasi AI |
| Tugas Saya | Menambahkan, menghapus, memfilter, mengurutkan, dan menyelesaikan tugas |
| Check-In Mood | Menyimpan mood dan energi user |
| Rencana AI | Membuat rencana belajar otomatis berdasarkan prioritas |
| Jadwal | Menampilkan tugas pada kalender sesuai deadline |
| Alarm Deadline | Memberi peringatan jika deadline hari ini atau besok |
| Analitik | Menampilkan progres tugas, alarm aktif, tren mood, dan refleksi AI |
| Asisten AI | Menjawab pertanyaan user berdasarkan data tugas, mood, jadwal, dan analitik |
| Profil | Mengelola data profil dan reset data aplikasi |

## 5. Alur Data Program

1. User menambahkan tugas di fitur **Tugas Saya**.
2. Data tugas disimpan ke state utama di `Dashboard.jsx`.
3. Deadline tugas otomatis dibaca oleh fitur **Jadwal**.
4. Jika deadline hari ini atau besok, sistem membuat **alarm peringatan**.
5. AI menghitung skor prioritas di `mindmateAI.js`.
6. Hasil AI muncul di Beranda, Rencana AI, Jadwal, Analitik, dan Asisten AI.

## 6. Cara Kerja AI

AI berada di file:

```txt
src/lib/mindmateAI.js
```

AI menghitung prioritas tugas menggunakan aturan:

```txt
Skor Prioritas = Skor Deadline + Skor Kesulitan + Skor Energi + Bonus Status
```

Contoh logika:

```txt
Jika deadline hari ini, skor deadline tinggi.
Jika tugas sulit, skor kesulitan bertambah.
Jika energi tinggi, AI lebih berani menyarankan tugas berat.
Jika tugas sudah selesai, skor prioritas turun.
```

## 7. Fitur Jadwal dan Alarm

Fitur Jadwal menggantikan Mode Fokus. Fungsi utamanya:

1. Menampilkan kalender bulanan.
2. Tugas otomatis muncul pada tanggal deadline.
3. User bisa klik tanggal untuk melihat detail tugas.
4. Detail berisi nama tugas, mata kuliah, tingkat kesulitan, mood, energi, deadline, dan skor AI.
5. Sistem memberi alarm jika deadline hari ini atau besok.
6. Tombol **Aktifkan Alarm** dapat menampilkan notifikasi browser jika izin diberikan.

## 8. Penjelasan Singkat untuk Presentasi

MindMate AI menggunakan pendekatan rule-based AI untuk memberi rekomendasi belajar. Program membaca data tugas, deadline, tingkat kesulitan, mood, dan energi user. Berdasarkan data tersebut, AI menentukan tugas prioritas, membuat rencana belajar otomatis, menampilkan jadwal deadline, dan memberi alarm ketika deadline hampir tiba.

## 9. Cara Menjalankan Program

```bash
npm install
npm run dev
```

Untuk build:

```bash
npm run build
```
