export const fiturMindMate = [
  {
    id: "beranda",
    nama: "Beranda",
    fungsi: "Menampilkan ringkasan kondisi belajar, rekomendasi utama AI, antrean prioritas, progres mingguan, dan lini masa hari ini.",
    kataKunci: ["beranda", "home", "ringkasan", "dashboard"],
  },
  {
    id: "tugas",
    nama: "Tugas Saya",
    fungsi: "Mencatat tugas, memberi skor AI, mengurutkan prioritas, memilih tugas untuk sesi fokus, dan menghapus tugas.",
    kataKunci: ["tugas", "deadline", "prioritas", "skor", "pekerjaan"],
  },
  {
    id: "mood",
    nama: "Check-In Mood",
    fungsi: "Membaca suasana hati dan energi pengguna agar AI bisa menyesuaikan durasi fokus, jeda, dan rencana belajar.",
    kataKunci: ["mood", "perasaan", "energi", "capek", "stres"],
  },
  {
    id: "rencana",
    nama: "Rencana AI",
    fungsi: "Menyusun jadwal belajar bertahap berdasarkan tugas prioritas, tingkat kesulitan, mood, energi, dan deadline.",
    kataKunci: ["rencana", "jadwal", "belajar", "timeline", "saran"],
  },
  {
    id: "fokus",
    nama: "Mode Fokus",
    fungsi: "Menjalankan timer belajar yang durasinya disesuaikan oleh AI berdasarkan kondisi pengguna dan tugas aktif.",
    kataKunci: ["fokus", "timer", "pomodoro", "mulai", "sesi"],
  },
  {
    id: "analitik",
    nama: "Analitik",
    fungsi: "Menampilkan statistik belajar, progres mingguan, heatmap jam fokus, tren mood, dan refleksi AI.",
    kataKunci: ["analitik", "statistik", "grafik", "progres", "laporan"],
  },
  {
    id: "ai",
    nama: "Asisten AI",
    fungsi: "Menjawab pertanyaan tentang fitur MindMate, memberi saran belajar, membaca tugas, memahami mood, dan mengarahkan pengguna ke menu yang tepat.",
    kataKunci: ["ai", "asisten", "bantu", "tanya", "rekomendasi"],
  },
  {
    id: "profil",
    nama: "Profil",
    fungsi: "Menyimpan preferensi belajar pengguna agar rekomendasi AI terasa lebih personal.",
    kataKunci: ["profil", "akun", "nama", "preferensi"],
  },
]

function normalisasi(teks = "") {
  return String(teks).toLowerCase().trim()
}

function skorDeadline(deadline = "") {
  const teks = normalisasi(deadline)
  if (!teks || teks.includes("belum")) return 8
  if (teks.includes("besok") || teks.includes("23:59") || teks.includes("hari ini")) return 45
  if (teks.includes("3 hari")) return 32
  if (teks.includes("minggu")) return 16

  const tanggal = Date.parse(deadline)
  if (!Number.isNaN(tanggal)) {
    const hari = Math.ceil((tanggal - Date.now()) / (1000 * 60 * 60 * 24))
    if (hari <= 1) return 45
    if (hari <= 3) return 34
    if (hari <= 7) return 22
    return 12
  }

  return 18
}

function skorKesulitan(sulit = "") {
  const teks = normalisasi(sulit)
  if (teks.includes("tinggi")) return 30
  if (teks.includes("sedang")) return 20
  return 10
}

function faktorKondisi(mood = "Biasa aja", energi = "Cukup") {
  const m = normalisasi(mood)
  const e = normalisasi(energi)
  let nilai = 15

  if (e.includes("tinggi")) nilai += 12
  if (e.includes("cukup")) nilai += 6
  if (e.includes("rendah")) nilai -= 8

  if (m.includes("semangat")) nilai += 8
  if (m.includes("normal") || m.includes("biasa")) nilai += 4
  if (m.includes("capek")) nilai -= 6
  if (m.includes("stres")) nilai -= 10

  return nilai
}

export function hitungSkorTugas(tugas, mood = "Biasa aja", energi = "Cukup") {
  const dasar = skorDeadline(tugas?.deadline) + skorKesulitan(tugas?.sulit) + faktorKondisi(mood, energi)
  const bonusTipe = normalisasi(tugas?.tipe).includes("coding") ? 5 : normalisasi(tugas?.tipe).includes("laporan") ? 4 : 2
  return Math.max(35, Math.min(100, Math.round(dasar + bonusTipe)))
}

export function urutkanPrioritasAI(tugas = [], mood = "Biasa aja", energi = "Cukup") {
  return [...tugas]
    .map((item) => ({ ...item, skor: hitungSkorTugas(item, mood, energi) }))
    .sort((a, b) => b.skor - a.skor)
}

export function analisisKondisi(mood = "Biasa aja", energi = "Cukup") {
  const m = normalisasi(mood)
  const e = normalisasi(energi)

  if (m.includes("stres") || e.includes("rendah")) {
    return {
      label: "Recovery Focus",
      durasiFokus: 20,
      durasiIstirahat: 10,
      nada: "ringan",
      pesan: "Kondisimu sedang butuh ritme lembut. AI menyarankan sesi pendek, target kecil, dan jeda lebih panjang agar tidak burnout.",
    }
  }

  if (m.includes("capek")) {
    return {
      label: "Gentle Focus",
      durasiFokus: 25,
      durasiIstirahat: 8,
      nada: "stabil",
      pesan: "Kamu masih bisa produktif, tapi jangan terlalu memaksa. AI menyarankan fokus sedang dengan istirahat cukup.",
    }
  }

  if (e.includes("tinggi") || m.includes("semangat")) {
    return {
      label: "Deep Focus AI",
      durasiFokus: 35,
      durasiIstirahat: 10,
      nada: "intensif",
      pesan: "Energi kamu bagus. AI menyarankan sesi fokus lebih panjang untuk menyelesaikan tugas prioritas.",
    }
  }

  return {
    label: "Balanced Focus",
    durasiFokus: 30,
    durasiIstirahat: 7,
    nada: "seimbang",
    pesan: "Kondisimu cukup stabil. AI menyarankan ritme belajar seimbang dan tetap memberi jeda singkat.",
  }
}

export function buatRekomendasiUtama(tugas = [], mood = "Biasa aja", energi = "Cukup") {
  const prioritas = urutkanPrioritasAI(tugas, mood, energi)
  const utama = prioritas[0]
  const kondisi = analisisKondisi(mood, energi)

  if (!utama) {
    return {
      judul: "Belum ada tugas",
      teks: "Tambahkan tugas terlebih dahulu agar AI bisa membuat prioritas belajar.",
      tugas: null,
      kondisi,
    }
  }

  return {
    judul: `Fokus pada ${utama.nama}`,
    teks: `${utama.nama} menjadi prioritas karena skor AI ${utama.skor}/100, tingkat kesulitan ${utama.sulit}, dan deadline ${utama.deadline}. Gunakan metode ${kondisi.label}: ${kondisi.durasiFokus} menit fokus + ${kondisi.durasiIstirahat} menit istirahat.`,
    tugas: utama,
    kondisi,
  }
}

export function buatRencanaBelajar(tugas = [], mood = "Biasa aja", energi = "Cukup") {
  const rekomendasi = buatRekomendasiUtama(tugas, mood, energi)
  const tugasUtama = rekomendasi.tugas
  const kondisi = rekomendasi.kondisi

  if (!tugasUtama) return []

  const sulit = normalisasi(tugasUtama.sulit)
  const langkahSulit = sulit.includes("tinggi")
    ? ["Pecah masalah utama", "Kerjakan bagian tersulit", "Uji atau revisi hasil", "Rapikan dan kumpulkan"]
    : sulit.includes("sedang")
      ? ["Baca instruksi", "Kerjakan inti tugas", "Periksa ulang", "Kumpulkan"]
      : ["Review materi", "Kerjakan cepat", "Cek jawaban", "Selesai"]

  const mulai = 19
  return langkahSulit.map((langkah, index) => ({
    jam: `${String(mulai + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "35"}`,
    judul: langkah,
    durasi: index === 1 ? kondisi.durasiFokus : Math.max(15, kondisi.durasiFokus - 10),
    tipe: index === langkahSulit.length - 1 ? "final" : "proses",
    tugas: tugasUtama.nama,
  }))
}

export function refleksiAnalitikAI({ tugas = [], mood = "Biasa aja", energi = "Cukup", fokusJam = 24.5 } = {}) {
  const prioritas = urutkanPrioritasAI(tugas, mood, energi)
  const kondisi = analisisKondisi(mood, energi)
  const tugasTinggi = prioritas.filter((item) => item.skor >= 80).length

  return {
    judul: "Refleksi AI",
    ringkas: `AI melihat kamu memiliki ${tugas.length} tugas aktif, ${tugasTinggi} tugas prioritas tinggi, mood dominan ${mood}, dan energi ${energi}.`,
    saran: `Pertahankan fokus utama pada ${prioritas[0]?.nama || "tugas utama"}. Dengan kondisi saat ini, gunakan pola ${kondisi.durasiFokus} menit fokus dan ${kondisi.durasiIstirahat} menit istirahat. Total fokus minggu ini sekitar ${fokusJam} jam, jadi target berikutnya adalah menjaga konsistensi, bukan memaksa durasi terlalu panjang.`,
    kondisi,
  }
}

export function deteksiFitur(pertanyaan = "") {
  const teks = normalisasi(pertanyaan)
  return fiturMindMate.find((fitur) => fitur.kataKunci.some((kata) => teks.includes(kata))) || null
}

export function jawabAsistenAI(pertanyaan, konteks) {
  const teks = normalisasi(pertanyaan)
  const fitur = deteksiFitur(teks)
  const prioritas = urutkanPrioritasAI(konteks.tugas, konteks.mood, konteks.energi)
  const rekomendasi = buatRekomendasiUtama(konteks.tugas, konteks.mood, konteks.energi)
  const kondisi = analisisKondisi(konteks.mood, konteks.energi)

  if (!teks) {
    return {
      teks: "Tulis pertanyaanmu dulu. Contoh: 'tugas apa yang harus saya kerjakan?', 'buatkan rencana belajar', atau 'jelaskan fitur mode fokus'.",
      aksi: null,
    }
  }

  if (teks.includes("struktur") || teks.includes("fitur") || teks.includes("menu")) {
    return {
      teks: `Aku memahami struktur fitur MindMate: ${fiturMindMate.map((item) => item.nama).join(", ")}. Beranda untuk ringkasan, Tugas Saya untuk prioritas, Check-In Mood untuk kondisi, Rencana AI untuk jadwal, Mode Fokus untuk timer, Analitik untuk wawasan, dan Profil untuk preferensi pengguna.`,
      aksi: "ai",
    }
  }

  if (teks.includes("prioritas") || teks.includes("kerjakan") || teks.includes("dulu")) {
    return {
      teks: `${rekomendasi.teks} Urutan 3 besar saat ini: ${prioritas.slice(0, 3).map((t, i) => `${i + 1}. ${t.nama} (${t.skor}/100)`).join("; ")}.`,
      aksi: "tugas",
    }
  }

  if (teks.includes("rencana") || teks.includes("jadwal")) {
    const rencana = buatRencanaBelajar(konteks.tugas, konteks.mood, konteks.energi)
    return {
      teks: `Rencana AI untuk ${rekomendasi.tugas?.nama || "tugas utama"}: ${rencana.map((r) => `${r.jam} ${r.judul}`).join(" → ")}.`,
      aksi: "rencana",
    }
  }

  if (teks.includes("fokus") || teks.includes("timer") || teks.includes("pomodoro")) {
    return {
      teks: `Untuk kondisi mood ${konteks.mood} dan energi ${konteks.energi}, AI menyarankan ${kondisi.label}: ${kondisi.durasiFokus} menit fokus + ${kondisi.durasiIstirahat} menit istirahat.`,
      aksi: "fokus",
    }
  }

  if (teks.includes("mood") || teks.includes("capek") || teks.includes("stres") || teks.includes("energi")) {
    return {
      teks: `${kondisi.pesan} Kamu bisa mengubah mood dan energi pada fitur Check-In Mood agar rekomendasi AI ikut berubah.`,
      aksi: "mood",
    }
  }

  if (teks.includes("analitik") || teks.includes("grafik") || teks.includes("laporan")) {
    const refleksi = refleksiAnalitikAI(konteks)
    return {
      teks: `${refleksi.ringkas} ${refleksi.saran}`,
      aksi: "analitik",
    }
  }

  if (fitur) {
    return {
      teks: `${fitur.nama}: ${fitur.fungsi}`,
      aksi: fitur.id,
    }
  }

  return {
    teks: `Aku sarankan kamu mulai dari ${prioritas[0]?.nama || "menambahkan tugas"}. ${rekomendasi.teks} Kalau ingin, aku juga bisa membawamu ke Tugas Saya, Rencana AI, Mode Fokus, atau Analitik.`,
    aksi: prioritas[0] ? "tugas" : "tugas",
  }
}
