import { AlarmClock, BatteryMedium, CalendarClock, Clock, Plus, Smile, Sparkles, Target } from "lucide-react"
import Button from "../components/Button"
import StatCard from "../components/StatCard"
import { buildWeeklyProgress, getDeadlineWarnings, getTopRecommendation } from "../lib/mindmateAI"

export default function Beranda({ appData, onNavigate }) {
  const { profile, tasks, mood, enrichedTasks } = appData
  const recommendation = getTopRecommendation(tasks, mood)
  const progress = buildWeeklyProgress(tasks)
  const unfinished = enrichedTasks.filter((task) => task.status !== "Selesai")
  const deadlineWarnings = getDeadlineWarnings(tasks)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Beranda</p>
          <h2 className="text-3xl font-black leading-tight text-slate-950">
            Siap belajar lebih terarah hari ini, {profile.name}?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            AI membaca tugas, deadline, mood, jadwal, dan analitik untuk memberi saran belajar yang lebih jelas.
          </p>
        </div>
        <Button onClick={() => onNavigate("Tugas Saya")} className="self-start">
          <Plus size={16} />
          Tambah Tugas
        </Button>
      </div>

      <div className="mb-5 grid gap-5 md:grid-cols-4">
        <StatCard icon={<Target size={18} />} title="Skor Belajar" value="85" desc="Stabil" />
        <StatCard icon={<AlarmClock size={18} />} title="Alarm Deadline" value={deadlineWarnings.length} color="text-red-600" desc="Hampir tiba" />
        <StatCard icon={<BatteryMedium size={18} />} title="Energi" value={mood.energy} color="text-cyan-700" desc="Dari check-in" />
        <StatCard icon={<Smile size={18} />} title="Mood" value={mood.mood} desc="Terbaru" />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Sparkles size={14} />
              </div>
              <h3 className="text-lg font-black">Rekomendasi AI</h3>
            </div>
            <p className="text-sm font-black text-slate-900">{recommendation.title}</p>
            <p className="mt-2 text-sm italic leading-6 text-slate-600">“{recommendation.text}”</p>
            <Button onClick={() => onNavigate("Jadwal")} className="mt-4 w-full">
              Lihat Jadwal →
            </Button>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-black">Antrean Prioritas</h3>
              <button onClick={() => onNavigate("Tugas Saya")} className="text-xs font-black text-violet-600">Edit Daftar</button>
            </div>
            <div className="space-y-3">
              {unfinished.slice(0, 4).map((task, index) => (
                <button key={task.id} onClick={() => onNavigate("Jadwal")} className="flex w-full items-center gap-3 rounded-2xl bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`h-11 w-1 rounded-full ${index === 0 ? "bg-red-500" : index === 1 ? "bg-violet-500" : "bg-slate-400"}`} />
                  <div>
                    <p className="text-sm font-black">{task.title}</p>
                    <p className="text-xs font-bold text-slate-500">#{index + 1} • {task.aiLabel} • Deadline {task.deadline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-8">
          <div className="rounded-2xl bg-white/90 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-black">Progres Mingguan</h3>
              <button onClick={() => onNavigate("Analitik")} className="text-xs font-black text-violet-600">Lihat Analitik</button>
            </div>
            <div className="flex h-44 items-end gap-4">
              {progress.map((item, index) => (
                <button key={item.day} onClick={() => onNavigate("Analitik")} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`w-full rounded-t-xl ${index === 3 || index === 6 ? "bg-violet-600" : index === 4 ? "bg-indigo-500" : "bg-violet-300"}`} style={{ height: `${item.value}%` }} />
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-6 shadow-sm md:ml-auto md:w-[430px]">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock className="text-violet-600" size={18} />
              <h3 className="text-lg font-black">Deadline Terdekat</h3>
            </div>
            {unfinished.slice(0, 3).map((task) => (
              <Timeline key={task.id} title={task.title} desc={`${task.subject} • ${task.deadlineStatus.label}`} deadline={task.deadline} />
            ))}
            <Button variant="secondary" onClick={() => onNavigate("Jadwal")} className="mt-2 w-full">
              <Clock size={16} /> Buka Kalender Deadline
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Timeline({ title, desc, deadline }) {
  return (
    <button className="relative block w-full border-l border-slate-200 pb-6 pl-5 text-left last:pb-0">
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
      <p className="text-xs font-bold text-violet-600">Deadline {deadline}</p>
      <p className="mt-1 text-sm font-black">{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  )
}
