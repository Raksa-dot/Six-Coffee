const difficultyScore = {
  Mudah: 10,
  Sedang: 20,
  Sulit: 30,
}

const energyModifier = {
  Rendah: -8,
  Sedang: 0,
  Tinggi: 8,
}

export function daysUntil(deadline) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export function calculatePriorityScore(task, mood) {
  const remainingDays = daysUntil(task.deadline)
  const deadlineScore = remainingDays <= 0 ? 45 : Math.max(5, 45 - remainingDays * 6)
  const difficulty = difficultyScore[task.difficulty] ?? 15
  const energy = energyModifier[mood?.energy] ?? 0
  const unfinishedBonus = task.status === "Selesai" ? -50 : 10
  const score = deadlineScore + difficulty + energy + unfinishedBonus
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function getPriorityLabel(score) {
  if (score >= 75) return "Prioritas Tinggi"
  if (score >= 45) return "Prioritas Sedang"
  return "Prioritas Rendah"
}

export function getDeadlineStatus(task) {
  const remainingDays = daysUntil(task.deadline)

  if (task.status === "Selesai") {
    return {
      label: "Selesai",
      tone: "green",
      text: "Tugas sudah selesai.",
      remainingDays,
    }
  }

  if (remainingDays < 0) {
    return {
      label: "Terlambat",
      tone: "red",
      text: `Terlambat ${Math.abs(remainingDays)} hari. Segera kerjakan atau revisi jadwal.`,
      remainingDays,
    }
  }

  if (remainingDays === 0) {
    return {
      label: "Deadline Hari Ini",
      tone: "red",
      text: "Deadline hari ini. Alarm prioritas tinggi aktif.",
      remainingDays,
    }
  }

  if (remainingDays === 1) {
    return {
      label: "Hampir Tiba",
      tone: "amber",
      text: "Deadline tinggal 1 hari. Siapkan waktu belajar hari ini.",
      remainingDays,
    }
  }

  if (remainingDays <= 3) {
    return {
      label: "Mendekati Deadline",
      tone: "violet",
      text: `Deadline dalam ${remainingDays} hari. Masukkan ke jadwal belajar.`,
      remainingDays,
    }
  }

  return {
    label: "Masih Aman",
    tone: "slate",
    text: `Deadline masih ${remainingDays} hari lagi. Tetap pantau dari jadwal.`,
    remainingDays,
  }
}

export function getDeadlineWarnings(tasks) {
  return tasks
    .filter((task) => task.status !== "Selesai")
    .map((task) => ({ ...task, deadlineStatus: getDeadlineStatus(task) }))
    .filter((task) => task.deadlineStatus.remainingDays <= 1)
    .sort((a, b) => a.deadlineStatus.remainingDays - b.deadlineStatus.remainingDays)
}

export function explainPriority(task, mood) {
  const status = getDeadlineStatus(task)
  const parts = []

  parts.push(status.label.toLowerCase())
  parts.push(`tingkat kesulitan ${task.difficulty.toLowerCase()}`)
  parts.push(`mood ${mood.mood.toLowerCase()}`)
  parts.push(`energi ${mood.energy.toLowerCase()}`)

  return `AI memberi skor berdasarkan ${parts.join(", ")}.`
}

export function enrichTasks(tasks, mood) {
  return tasks
    .map((task) => {
      const score = calculatePriorityScore(task, mood)
      const deadlineStatus = getDeadlineStatus(task)
      return {
        ...task,
        aiScore: score,
        aiLabel: getPriorityLabel(score),
        aiReason: explainPriority(task, mood),
        deadlineStatus,
      }
    })
    .sort((a, b) => b.aiScore - a.aiScore)
}

export function getTopRecommendation(tasks, mood) {
  const [topTask] = enrichTasks(tasks, mood).filter((task) => task.status !== "Selesai")

  if (!topTask) {
    return {
      title: "Semua tugas selesai",
      text: "AI menyarankan kamu melakukan review ringan atau istirahat singkat agar energi tetap stabil.",
      task: null,
    }
  }

  return {
    title: `Fokus pada ${topTask.title}`,
    text: `Fokus pada ${topTask.title} karena ${topTask.aiReason.toLowerCase()} Deadline: ${topTask.deadline}. Skor prioritas AI: ${topTask.aiScore}/100.`,
    task: topTask,
  }
}

export function getRecommendedStudyDuration(mood) {
  if (mood.energy === "Rendah") return 15
  if (mood.mood === "Lelah") return 20
  if (mood.energy === "Tinggi") return 30
  return 25
}

export function generateStudyPlan(tasks, mood) {
  const duration = getRecommendedStudyDuration(mood)
  const activeTasks = enrichTasks(tasks, mood).filter((task) => task.status !== "Selesai")

  if (activeTasks.length === 0) {
    return [
      {
        time: "Hari ini",
        title: "Review Ringan",
        desc: "Tidak ada tugas aktif. Gunakan waktu untuk membaca ulang materi atau merapikan catatan.",
        taskId: null,
      },
    ]
  }

  return activeTasks.slice(0, 4).map((task, index) => ({
    time: index === 0 ? "Sesi 1" : `Sesi ${index + 1}`,
    title: `${duration} menit - ${task.title}`,
    desc: `${task.subject} • ${task.aiLabel} • ${task.deadlineStatus.text}`,
    taskId: task.id,
  }))
}

export function buildWeeklyProgress(tasks) {
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  return days.map((day) => {
    const completedTasks = tasks.filter((task) => {
      if (task.status !== "Selesai") return false

      if (!task.completedAt) {
        return day === getIndonesianDayName(new Date()).slice(0, 3)
      }

      return getIndonesianDayName(new Date(task.completedAt)).slice(0, 3) === day
    }).length

    const deadlineTasks = tasks.filter((task) => {
      if (!task.deadline) return false
      return getIndonesianDayName(new Date(task.deadline)).slice(0, 3) === day
    }).length

    const value = Math.min(100, completedTasks * 30 + deadlineTasks * 15)

    return {
      day,
      value: Math.max(10, value),
      completedTasks,
      deadlineTasks,
    }
  })
}

export function getIndonesianDayName(date = new Date()) {
  return date.toLocaleDateString("id-ID", { weekday: "long" })
}

export function generateAnalyticsInsight(tasks, moodLogs) {
  const completed = tasks.filter((task) => task.status === "Selesai").length
  const warnings = getDeadlineWarnings(tasks).length
  const dominantMood = getDominantMood(moodLogs)

  if (warnings > 0) {
    return `AI mendeteksi ${warnings} tugas dengan deadline hampir tiba. Buka fitur Jadwal untuk melihat tanggal, detail tugas, dan alarm peringatan.`
  }

  if (completed === 0) {
    return "AI melihat progres tugas masih rendah. Mulai dari satu tugas dengan deadline terdekat agar ritme belajar terbentuk."
  }

  return `AI melihat mood dominan kamu adalah ${dominantMood}. Kamu sudah menyelesaikan ${completed} tugas. Pertahankan pola belajar pendek namun konsisten sesuai jadwal deadline.`
}

export function getDominantMood(moodLogs) {
  if (!moodLogs.length) return "Netral"
  const counter = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1
    return acc
  }, {})
  return Object.entries(counter).sort((a, b) => b[1] - a[1])[0][0]
}

export function answerMindMateQuestion(question, appData) {
  const text = question.toLowerCase()
  const enriched = enrichTasks(appData.tasks, appData.mood)
  const topTask = enriched.find((task) => task.status !== "Selesai")
  const duration = getRecommendedStudyDuration(appData.mood)
  const warnings = getDeadlineWarnings(appData.tasks)

  if (text.includes("fitur") || text.includes("menu")) {
    return "MindMate memiliki fitur Beranda, Tugas Saya, Check-In Mood, Rencana AI, Jadwal, Analitik, Asisten AI, dan Profil. AI membaca deadline, tingkat kesulitan, mood, energi, dan progres user."
  }

  if (text.includes("prioritas") || text.includes("tugas")) {
    if (!topTask) return "Semua tugas aktif sudah selesai. AI menyarankan review materi atau membuat tugas baru."
    return `Tugas paling prioritas adalah ${topTask.title} dengan skor AI ${topTask.aiScore}/100. Alasannya: ${topTask.aiReason}`
  }

  if (text.includes("mood") || text.includes("energi")) {
    return `Mood kamu saat ini ${appData.mood.mood} dan energi ${appData.mood.energy}. Karena itu AI menyarankan sesi belajar sekitar ${duration} menit untuk setiap tugas di jadwal.`
  }

  if (text.includes("alarm") || text.includes("deadline")) {
    if (!warnings.length) return "Tidak ada deadline yang hampir tiba. Namun tetap pantau fitur Jadwal agar tugas tidak terlewat."
    return `Ada ${warnings.length} alarm deadline: ${warnings.map((task) => `${task.title} (${task.deadlineStatus.label})`).join(", ")}. Buka fitur Jadwal untuk detailnya.`
  }

  if (text.includes("rencana") || text.includes("jadwal")) {
    const plan = generateStudyPlan(appData.tasks, appData.mood)
    return `Rencana AI hari ini: ${plan.map((item) => item.title).join("; ")}. Semua deadline juga muncul otomatis di fitur Jadwal.`
  }

  if (text.includes("analitik") || text.includes("progres")) {
    return generateAnalyticsInsight(appData.tasks, appData.moodLogs)
  }

  return "Saya adalah Asisten AI MindMate. Saya bisa membantu menentukan prioritas tugas, membaca deadline, membuat rencana belajar, menjelaskan mood, melihat jadwal, dan memberi peringatan alarm deadline."
}
