import { AlarmClock, Award, BarChart3, Calendar, CalendarClock, FileDown, Flame, MessageCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import Button from "../components/Button"
import StatCard from "../components/StatCard"
import { buildWeeklyProgress, generateAnalyticsInsight, getDeadlineWarnings, getDominantMood } from "../lib/mindmateAI"

export default function Analitik({ appData, onNavigate }) {
  const [period, setPeriod] = useState("7 Hari Terakhir")
  const [showAI, setShowAI] = useState(false)
  const [selectedBar, setSelectedBar] = useState(null)
  const [selectedHeat, setSelectedHeat] = useState(null)
  const completed = appData.tasks.filter((task) => task.status === "Selesai").length
  const totalTasks = appData.tasks.length || 1
  const completionPercent = Math.round((completed / totalTasks) * 100)
  const warnings = getDeadlineWarnings(appData.tasks)
  const progress = buildWeeklyProgress(appData.tasks)
  const insight = generateAnalyticsInsight(appData.tasks, appData.moodLogs)
  const dominantMood = getDominantMood(appData.moodLogs)

  function cyclePeriod() {
    setPeriod((current) => current === "7 Hari Terakhir" ? "14 Hari Terakhir" : current === "14 Hari Terakhir" ? "30 Hari Terakhir" : "7 Hari Terakhir")
  }

  const heat = [20, 45, 70, 35, 80, 55, 25, 65, 40, 90, 60, 50]
  const moodTrend = ["Senang", "Netral", "Lelah", "Senang", "Semangat", "Netral", dominantMood]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Analitik</p>
          <h2 className="text-3xl font-black">Analitik & Wawasan</h2>
          <p className="mt-2 text-sm text-slate-500">Lihat perkembangan tugas, deadline, konsistensi, mood, dan refleksi AI.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={cyclePeriod}><Calendar size={16} /> {period}</Button>
          <Button onClick={() => window.print()}><FileDown size={16} /> Ekspor PDF</Button>
        </div>
      </div>

      <div className="mb-5 grid gap-5 md:grid-cols-4">
        <StatCard icon={<Award size={18} />} title="Tugas Selesai" value={`${completed}/${totalTasks}`} desc={`${completionPercent}% progres tugas`} />
        <StatCard icon={<AlarmClock size={18} />} title="Alarm Aktif" value={warnings.length} color="text-red-600" desc="Deadline hampir tiba" />
        <StatCard icon={<Flame size={18} />} title="Konsistensi" value={`${Math.min(100, completionPercent + Math.max(0, totalTasks - warnings.length) * 5)}%`} color="text-orange-600" desc="Dari tugas + jadwal" />
        <StatCard icon={<TrendingUp size={18} />} title="Mood Dominan" value={dominantMood} desc="Dari check-in" />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="rounded-3xl bg-white/90 p-6 shadow-sm lg:col-span-7">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black">Grafik Progres Mingguan</h3>
            <BarChart3 className="text-violet-600" size={20} />
          </div>
          <div className="flex h-56 items-end gap-4">
            {progress.map((item) => (
              <button key={item.day} onClick={() => setSelectedBar(item)} className="flex flex-1 flex-col items-center gap-2">
                <div className={`w-full rounded-t-2xl transition hover:opacity-80 ${selectedBar?.day === item.day ? "bg-slate-950" : "bg-violet-500"}`} style={{ height: `${item.value}%` }} />
                <span className="text-xs font-bold text-slate-500">{item.day}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {selectedBar
              ? `Hari ${selectedBar.day}: ${selectedBar.completedTasks} tugas selesai dan ${selectedBar.deadlineTasks} deadline terjadwal.`
              : "Klik batang grafik untuk melihat detail progres. Tugas yang ditekan Selesai akan masuk ke hari ini."}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 text-white lg:col-span-5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
            <MessageCircle size={22} />
          </div>
          <h3 className="text-xl font-black">Refleksi AI</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{insight}</p>
          <Button onClick={() => setShowAI((prev) => !prev)} className="mt-5 w-full">
            Tanya AI Lebih Lanjut
          </Button>
          {showAI && (
            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
              Saran lanjutan: buka fitur Jadwal, cek deadline terdekat, lalu kerjakan tugas dengan alarm aktif lebih dulu.
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-sm lg:col-span-7">
          <h3 className="mb-5 text-lg font-black">Heatmap Jam Belajar</h3>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
            {heat.map((value, index) => (
              <button
                key={index}
                onClick={() => setSelectedHeat({ hour: `${8 + index}:00`, value })}
                className={`h-16 rounded-2xl font-black transition ${selectedHeat?.value === value && selectedHeat?.hour === `${8 + index}:00` ? "bg-slate-950 text-white" : value > 70 ? "bg-violet-600 text-white" : value > 45 ? "bg-violet-300 text-violet-950" : "bg-violet-100 text-violet-700"}`}
              >
                {8 + index}:00
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {selectedHeat ? `${selectedHeat.hour} memiliki intensitas belajar ${selectedHeat.value}%.` : "Klik kotak jam untuk melihat intensitas belajar."}
          </p>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-sm lg:col-span-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-black">Deadline Terdekat</h3>
            <button onClick={() => onNavigate("Jadwal")} className="text-xs font-black text-violet-600">Buka Jadwal</button>
          </div>
          <div className="space-y-3">
            {warnings.length === 0 ? (
              <div className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-slate-600">Tidak ada alarm deadline aktif.</div>
            ) : (
              warnings.map((task) => (
                <button key={task.id} onClick={() => onNavigate("Jadwal")} className="flex w-full items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-left hover:bg-violet-100">
                  <div>
                    <span className="text-sm font-black">{task.title}</span>
                    <p className="text-xs text-slate-500">{task.deadline}</p>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">{task.deadlineStatus.label}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-sm lg:col-span-12">
          <div className="mb-5 flex items-center gap-2">
            <CalendarClock className="text-violet-600" size={18} />
            <h3 className="text-lg font-black">Tren Mood</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-7">
            {moodTrend.map((mood, index) => (
              <button key={`${mood}-${index}`} className="flex w-full items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-left hover:bg-violet-100">
                <span className="text-sm font-black">Hari {index + 1}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700">{mood}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
