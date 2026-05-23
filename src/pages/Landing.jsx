import { Link } from "react-router-dom"
import { Brain, Bot, CalendarCheck, CalendarClock, CheckCircle2 } from "lucide-react"
import Button from "../components/Button"

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-violet-100 via-white to-cyan-100 text-slate-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <Brain size={20} />
          </div>
          <span className="text-xl font-black text-violet-700">MindMate AI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="secondary">Masuk</Button></Link>
          <Link to="/daftar"><Button>Daftar</Button></Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <section>
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-violet-600 shadow-sm">
            Asisten Belajar Berbasis AI
          </p>
          <h1 className="text-5xl font-black leading-tight md:text-6xl">
            Belajar lebih terarah, terjadwal, dan terukur.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            MindMate AI membantu mahasiswa mengatur tugas, membaca mood, menyusun rencana belajar, memantau jadwal deadline, dan melihat analitik produktivitas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/daftar"><Button className="px-6 py-3">Mulai Sekarang</Button></Link>
            <Link to="/login"><Button variant="secondary" className="px-6 py-3">Masuk Dashboard</Button></Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-violet-100 bg-white/75 p-6 shadow-2xl shadow-violet-100 backdrop-blur">
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <div className="mb-6 flex items-center gap-2 text-violet-300">
              <Bot size={20} />
              <span className="font-black">AI Recommendation</span>
            </div>
            <h2 className="text-3xl font-black">Fokus pada Laporan Fisika</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Deadline dekat, tingkat kesulitan tinggi, dan energi kamu sedang tinggi. AI menampilkan tugas ini di jadwal dan mengaktifkan alarm peringatan.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Feature icon={<CheckCircle2 size={18} />} title="Tugas" />
            <Feature icon={<CalendarCheck size={18} />} title="Rencana" />
            <Feature icon={<CalendarClock size={18} />} title="Jadwal" />
          </div>
        </section>
      </main>
    </div>
  )
}

function Feature({ icon, title }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">{icon}</div>
      <p className="text-sm font-black">{title}</p>
    </div>
  )
}
