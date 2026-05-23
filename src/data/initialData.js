export const defaultProfile = {
  name: "Luqman",
  role: "Mahasiswa",
  target: "Belajar 2 jam setiap hari",
  avatar: "https://i.pravatar.cc/80?img=12",
}

export const defaultMood = {
  mood: "Senang",
  energy: "Tinggi",
  note: "Siap belajar hari ini",
  updatedAt: new Date().toISOString(),
}

export const defaultTasks = [
  {
    id: crypto.randomUUID(),
    title: "Laporan Fisika",
    subject: "Fisika",
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    difficulty: "Sulit",
    estimatedMinutes: 90,
    status: "Belum Selesai",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Kuis Matematika",
    subject: "Matematika",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    difficulty: "Sedang",
    estimatedMinutes: 60,
    status: "Belum Selesai",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Revisi Essay Bahasa Indonesia",
    subject: "Bahasa Indonesia",
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    difficulty: "Mudah",
    estimatedMinutes: 45,
    status: "Belum Selesai",
    createdAt: new Date().toISOString(),
  },
]

export const defaultMoodLogs = [
  { id: crypto.randomUUID(), mood: "Netral", energy: "Sedang", note: "Belajar normal", date: "Senin" },
  { id: crypto.randomUUID(), mood: "Senang", energy: "Tinggi", note: "Produktif", date: "Selasa" },
  { id: crypto.randomUUID(), mood: "Lelah", energy: "Rendah", note: "Butuh istirahat", date: "Rabu" },
  { id: crypto.randomUUID(), mood: "Senang", energy: "Tinggi", note: "Fokus meningkat", date: "Kamis" },
]

export const defaultFocusSessions = [
  { id: crypto.randomUUID(), taskTitle: "Laporan Fisika", minutes: 25, date: "Senin", completedAt: new Date().toISOString() },
  { id: crypto.randomUUID(), taskTitle: "Kuis Matematika", minutes: 30, date: "Selasa", completedAt: new Date().toISOString() },
  { id: crypto.randomUUID(), taskTitle: "Laporan Fisika", minutes: 40, date: "Kamis", completedAt: new Date().toISOString() },
]
