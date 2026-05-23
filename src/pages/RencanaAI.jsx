import { CalendarCheck, CalendarClock, RefreshCcw } from "lucide-react"
import { useMemo, useState } from "react"
import Button from "../components/Button"
import { generateStudyPlan } from "../lib/mindmateAI"

export default function RencanaAI({ appData, onNavigate }) {
  const [version, setVersion] = useState(1)
  const plan = useMemo(() => generateStudyPlan(appData.tasks, appData.mood), [appData.tasks, appData.mood, version])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Rencana AI</p>
          <h2 className="text-3xl font-black">Rencana belajar otomatis</h2>
          <p className="mt-2 text-sm text-slate-500">AI membagi tugas prioritas menjadi sesi kecil berdasarkan mood, energi, tingkat kesulitan, dan deadline.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setVersion((prev) => prev + 1)}><RefreshCcw size={16} /> Atur Ulang Rencana</Button>
          <Button onClick={() => onNavigate("Jadwal")}><CalendarClock size={16} /> Lihat Jadwal</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950 p-6 text-white lg:col-span-1">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
            <CalendarCheck size={22} />
          </div>
          <h3 className="text-2xl font-black">Logika AI</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI membaca skor prioritas tugas, kondisi mood, energi, estimasi waktu, dan alarm deadline. Tugas paling mendesak akan muncul lebih awal dalam rencana belajar.
          </p>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {plan.map((item, index) => (
            <div key={`${item.title}-${index}-${version}`} className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">{item.time}</p>
                  <h3 className="mt-1 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
                </div>
                <Button onClick={() => onNavigate("Jadwal")}><CalendarClock size={16} /> Cek Deadline</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
