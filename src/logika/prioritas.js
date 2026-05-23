function selisihHari(deadline) {
  if (!deadline) return 99

  const hariIni = new Date()
  const target = new Date(`${deadline}T00:00:00`)
  const mulaiHariIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())
  return Math.ceil((target - mulaiHariIni) / (1000 * 60 * 60 * 24))
}

export function hitungSkorPrioritas(tugas) {
  let skor = 0
  const hariTersisa = selisihHari(tugas.deadline)

  if (hariTersisa <= 0) skor += 50
  else if (hariTersisa === 1) skor += 40
  else if (hariTersisa <= 3) skor += 30
  else if (hariTersisa <= 7) skor += 20
  else skor += 10

  if (tugas.kesulitan === "sulit") skor += 30
  else if (tugas.kesulitan === "sedang") skor += 20
  else skor += 10

  if (tugas.estimasi === "3 jam") skor += 20
  else if (tugas.estimasi === "2 jam") skor += 15
  else if (tugas.estimasi === "1 jam") skor += 10
  else skor += 5

  if (tugas.status === "belum mulai") skor += 10
  else if (tugas.status === "sedang dikerjakan") skor += 5

  return skor
}

export function ambilLevelPrioritas(skor) {
  if (skor >= 80) return "PRIORITAS TINGGI"
  if (skor >= 50) return "SEDANG"
  return "PRIORITAS RENDAH"
}

export function urutkanTugas(tugas) {
  return [...tugas].sort(
    (a, b) => hitungSkorPrioritas(b) - hitungSkorPrioritas(a)
  )
}

export function buatAlasanAI(tugas, mood, energi) {
  const skor = hitungSkorPrioritas(tugas)
  const level = ambilLevelPrioritas(skor)
  const hariTersisa = selisihHari(tugas.deadline)

  let alasan = `Fokus pada ${tugas.nama} karena `
  const poin = []

  if (hariTersisa < 0) poin.push("deadline sudah lewat")
  else if (hariTersisa === 0) poin.push("deadline hari ini")
  else if (hariTersisa === 1) poin.push("deadline besok")
  else if (hariTersisa <= 3) poin.push("deadline sangat dekat")

  if (tugas.kesulitan === "sulit") poin.push("tingkat kesulitannya tinggi")
  if (tugas.estimasi === "3 jam" || tugas.estimasi === "2 jam") poin.push("estimasi pengerjaannya cukup lama")
  if (tugas.mood === "capek" || tugas.mood === "stres") poin.push("mood untuk tugas ini perlu diperhatikan")

  if (poin.length === 0) poin.push("tugas ini tetap perlu diperhatikan")

  alasan += poin.join(", ") + "."

  let strategi = ""

  if (energi === "tinggi" || mood === "semangat") {
    strategi =
      "Karena energimu sedang bagus, kamu bisa mulai dari bagian tersulit terlebih dahulu."
  } else if (energi === "rendah" || mood === "capek" || mood === "stres") {
    strategi =
      "Karena kondisimu sedang kurang optimal, pecah tugas menjadi langkah kecil agar tidak cepat lelah."
  } else {
    strategi =
      "Gunakan sesi belajar normal dan beri jeda istirahat setelah satu bagian selesai."
  }

  return {
    skor,
    level,
    alasan,
    strategi,
  }
}
