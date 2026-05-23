import { useEffect, useState } from "react"
import {
  Bell,
  Home,
  CheckCircle2,
  Smile,
  CalendarCheck,
  Timer,
  BarChart3,
  User,
  Zap,
  Sparkles,
  Target,
  Clock,
  BatteryMedium,
  PlusCircle,
  LogOut,
} from "lucide-react"

export default function Dashboard() {
  const [menuAktif, setMenuAktif] = useState("Beranda")

  return (
    <div className="min-h-screen bg-[#faf7ff] text-slate-950">
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[250px] flex-col border-r border-violet-100 bg-white px-5 py-5">
        <h1 className="mb-8 text-xl font-black text-violet-700">
          MindMate AI
        </h1>

        <nav className="space-y-2">
          <MenuItem icon={<Home size={15} />} text="Beranda" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<CheckCircle2 size={15} />} text="Tugas Saya" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<Smile size={15} />} text="Check-In Mood" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<CalendarCheck size={15} />} text="Rencana AI" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<Timer size={15} />} text="Mode Fokus" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<BarChart3 size={15} />} text="Analitik" aktif={menuAktif} setAktif={setMenuAktif} />
          <MenuItem icon={<User size={15} />} text="Profil" aktif={menuAktif} setAktif={setMenuAktif} />
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => setMenuAktif("Mode Fokus")}
            className="w-full rounded-xl bg-violet-600 p-4 text-left text-white shadow-lg shadow-violet-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs">Siap untuk fokus?</p>
                <p className="mt-1 text-sm font-black">Mulai Mode Fokus</p>
              </div>
              <Zap size={16} />
            </div>
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-100 bg-white py-3 text-sm font-bold text-slate-600">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      <main className="ml-[250px] min-h-screen">
        <header className="flex h-16 items-center justify-end border-b border-violet-100 bg-white px-8">
          <div className="flex items-center gap-5">
            <Bell size={17} className="text-slate-600" />
            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-xs shadow-md">
              <span>Halo, Luqman</span>
              <img
                src="https://i.pravatar.cc/40?img=12"
                className="h-7 w-7 rounded-full"
              />
            </div>
          </div>
        </header>

        <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-violet-100 via-white to-cyan-100 px-10 py-8">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[900px]">
            {menuAktif === "Beranda" && <Beranda setMenuAktif={setMenuAktif} />}
            {menuAktif === "Mode Fokus" && <ModeFokus />}
            {menuAktif !== "Beranda" && menuAktif !== "Mode Fokus" && (
              <HalamanKosong title={menuAktif} />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Beranda({ setMenuAktif }) {
  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black">
            Siap belajar lebih terarah hari ini?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Aktivitas produktivitasmu meningkat 12% dari minggu lalu. Semangat!
          </p>
        </div>

        <button className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">
          <PlusCircle size={16} className="mr-2 inline" />
          Tambah Tugas
        </button>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-5">
        <StatCard icon={<Target size={18} />} title="Skor Fokus" value="85" color="text-violet-600" />
        <StatCard icon={<Clock size={18} />} title="Tenggat Waktu" value="2" color="text-red-600" />
        <StatCard icon={<BatteryMedium size={18} />} title="Energi" value="Tinggi" color="text-cyan-700" />
        <StatCard icon={<Smile size={18} />} title="Mood" value="Senang" color="text-violet-600" />
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 space-y-5">
          <div className="rounded-xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <h3 className="font-black">Rekomendasi AI</h3>
            <p className="mt-3 text-sm italic leading-6 text-slate-600">
              “Fokus pada <b className="text-violet-600">Laporan Fisika</b>{" "}
              karena deadline besok dan energimu sedang puncak.”
            </p>
            <button
              onClick={() => setMenuAktif("Mode Fokus")}
              className="mt-4 w-full rounded-lg bg-indigo-600 py-3 text-sm font-black text-white"
            >
              Laksanakan →
            </button>
          </div>

          <div>
            <div className="mb-3 flex justify-between">
              <h3 className="font-black">Antrean Prioritas</h3>
              <button className="text-xs text-violet-600">Edit Daftar</button>
            </div>

            <Priority title="Laporan Fisika" desc="#1 PRIORITAS TINGGI" color="bg-red-500" />
            <Priority title="Kuis Matematika" desc="#2 SEDANG" color="bg-violet-500" />
            <Priority title="Revisi Essay" desc="#3 PRIORITAS RENDAH" color="bg-slate-400" />
          </div>
        </div>

        <div className="col-span-8 space-y-5">
          <div className="rounded-xl bg-white/90 p-6 shadow-sm">
            <h3 className="mb-6 font-black">Progres Mingguan</h3>
            <div className="flex h-40 items-end gap-4">
              {[35, 55, 25, 75, 45, 65, 90].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-violet-500"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {["S", "S", "R", "K", "J", "S", "M"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="ml-auto w-[360px] rounded-xl bg-white/90 p-6 shadow-sm">
            <h3 className="mb-5 font-black">Lini Masa Hari Ini</h3>
            <Timeline time="09:00 - 10:30" title="Fokus Mendalam: Laporan Fisika" desc="Laporan Lab Energi Kinetik" />
            <Timeline time="11:00 - 12:00" title="Tinjauan: Kuis Matematika" />
            <Timeline time="14:00 - 15:00" title="Pusat Komunitas: Grup Belajar" />
          </div>
        </div>
      </div>

      <footer className="mt-12 flex gap-6 text-[11px] text-slate-400">
        <b className="text-slate-600">MindMate AI</b>
        <span>© 2024 MindMate AI. Hak Cipta Dilindungi.</span>
        <span>Kebijakan Privasi</span>
        <span>Ketentuan Layanan</span>
        <span>Pusat Bantuan</span>
      </footer>
    </>
  )
}

function ModeFokus() {
  const [detik, setDetik] = useState(25 * 60)
  const [jalan, setJalan] = useState(false)

  useEffect(() => {
    if (!jalan || detik <= 0) return

    const interval = setInterval(() => {
      setDetik((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [jalan, detik])

  const menit = Math.floor(detik / 60)
  const sisaDetik = detik % 60

  function resetTimer() {
    setJalan(false)
    setDetik(25 * 60)
  }

  return (
    <>
      <p className="mb-3 text-xs font-black tracking-[0.35em] text-violet-600">
        MODE FOKUS
      </p>

      <h2 className="text-4xl font-black">
        Siap belajar lebih terarah hari ini?
      </h2>

      <p className="mt-3 max-w-xl text-sm text-slate-500">
        Mulai sesi belajar untuk tugas prioritas: <b>Laporan Fisika</b>.
        Gunakan pola 25 menit fokus dan 5 menit istirahat.
      </p>

      <div className="mt-8 rounded-2xl border border-violet-100 bg-white/90 p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <Timer size={35} />
        </div>

        <h3 className="text-2xl font-black">Mode Fokus</h3>

        <div className="mx-auto mt-8 w-[330px] rounded-2xl bg-slate-950 p-8 text-white shadow-xl">
          <p className="mb-3 text-xs font-black tracking-[0.35em] text-slate-400">
            TIMER FOKUS
          </p>

          <h1 className="text-6xl font-black">
            {String(menit).padStart(2, "0")}:
            {String(sisaDetik).padStart(2, "0")}
          </h1>

          <button
            onClick={() => setJalan(!jalan)}
            className="mt-7 w-full rounded-xl bg-violet-600 py-3 font-black"
          >
            {jalan ? "Pause" : "Mulai Fokus"}
          </button>

          <button
            onClick={resetTimer}
            className="mt-3 w-full rounded-xl bg-white/10 py-3 font-bold text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  )
}

function MenuItem({ icon, text, aktif, setAktif }) {
  const active = aktif === text

  return (
    <button
      onClick={() => setAktif(text)}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold ${
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
          : "text-slate-600 hover:bg-violet-50"
      }`}
    >
      {icon}
      {text}
    </button>
  )
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="rounded-xl bg-white/90 p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        {icon}
      </div>
      <p className="text-xs uppercase text-slate-500">{title}</p>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
  )
}

function Priority({ title, desc, color }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/90 p-4 shadow-sm">
      <div className={`h-9 w-1 rounded-full ${color}`} />
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

function Timeline({ time, title, desc }) {
  return (
    <div className="relative border-l border-slate-200 pb-6 pl-5">
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
      <p className="text-xs text-violet-600">{time}</p>
      <p className="text-sm font-black">{title}</p>
      {desc && <p className="text-xs text-slate-500">{desc}</p>}
    </div>
  )
}

function HalamanKosong({ title }) {
  return (
    <div className="rounded-2xl bg-white/90 p-10 shadow-sm">
      <h2 className="text-3xl font-black">{title}</h2>
      <p className="mt-3 text-slate-500">
        Halaman {title} sudah terhubung dari menu sidebar.
      </p>
    </div>
  )
}