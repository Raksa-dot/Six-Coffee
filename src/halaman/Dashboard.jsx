import { useMemo, useState } from "react"
import {
  BarChart3,
  Bell,
  Brain,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Smile,
  User,
  X,
  Zap,
} from "lucide-react"

import AlasanAI from "../komponen/AlasanAI.jsx"
import CekMood from "../komponen/CekMood.jsx"
import DaftarPrioritas from "../komponen/DaftarPrioritas.jsx"
import FormTugas from "../komponen/FormTugas.jsx"
import RencanaBelajar from "../komponen/RencanaBelajar.jsx"
import AlarmDeadline from "../komponen/AlarmDeadline.jsx"
import { dataTugas } from "../data/dataTugas.js"
import { urutkanTugas } from "../logika/prioritas.js"

export default function Dashboard({ user, onKeluar }) {
  const [menuAktif, setMenuAktif] = useState("beranda")
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false)
  const [daftarTugas, setDaftarTugas] = useState(dataTugas)
  const [mood, setMood] = useState("semangat")
  const [energi, setEnergi] = useState("tinggi")

  const tugasPrioritas = useMemo(() => urutkanTugas(daftarTugas), [daftarTugas])
  const tugasMendesakJumlah = useMemo(() => {
    const hariIni = new Date()
    const mulaiHariIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())

    return daftarTugas.filter((tugas) => {
      if (!tugas.deadline || tugas.status === "selesai") return false
      const target = new Date(`${tugas.deadline}T00:00:00`)
      const sisa = Math.ceil((target - mulaiHariIni) / (1000 * 60 * 60 * 24))
      return sisa <= 1
    }).length
  }, [daftarTugas])
  const [tugasAktif, setTugasAktif] = useState(dataTugas[0])

  function tambahTugas(tugasBaru) {
    setDaftarTugas((tugasLama) => [tugasBaru, ...tugasLama])
    setTugasAktif(tugasBaru)
    setMenuAktif("tugas")
  }

  function ubahMenu(menu) {
    setMenuAktif(menu)
    setSidebarTerbuka(false)
  }

  const judulHalaman = {
    beranda: "Beranda",
    tugas: "Tugas Saya",
    mood: "Check-In Mood",
    rencana: "Rencana AI",
    jadwal: "Jadwal Deadline",
    analitik: "Analitik",
    profil: "Profil",
  }

  const heroKonten = {
    beranda: {
      title: (
        <>
          <span className="mindmate-gradient-text">MindMate AI</span> membantu mahasiswa TI mengatur tugas, mood, deadline, dan rencana belajar.
        </>
      ),
      desc: "Kelola tugas, jadwal, mood, analitik, dan pengingat deadline dalam satu dashboard belajar yang lebih terarah.",
      chips: ["Tugas TI", "Rencana AI", "Jadwal Deadline", "Grafik Live"],
    },
    tugas: {
      title: "Kelola tugas Teknik Informatika dengan deadline yang rapi.",
      desc: "Tambahkan tugas, pilih mata kuliah, tentukan deadline, lalu pantau status pengerjaan dalam satu halaman.",
      chips: ["Input Tugas", "Mata Kuliah TI", "Deadline", "Status"],
    },
    mood: {
      title: "Check-In Mood untuk menyesuaikan ritme belajar.",
      desc: "Catat mood dan energi harian agar rencana belajar terasa lebih realistis dan tidak memaksakan kondisi.",
      chips: ["Mood", "Energi", "Fokus", "Kondisi Harian"],
    },
    rencana: {
      title: "Rencana AI menyusun langkah belajar yang lebih terarah.",
      desc: "AI membaca tugas, deadline, kesulitan, mood, dan energi untuk membuat rencana pengerjaan yang mudah diikuti.",
      chips: ["Prioritas AI", "Langkah Kerja", "Countdown", "Tips Mood"],
    },
    jadwal: {
      title: "Jadwal Deadline menampilkan tugas sesuai tanggalnya.",
      desc: "Setiap tugas yang memiliki deadline akan muncul di kalender, lengkap dengan detail tugas dan status pengerjaan.",
      chips: ["Kalender", "Deadline", "Detail Tugas", "Pengingat"],
    },
    analitik: {
      title: "Analitik membaca progres tugas secara otomatis.",
      desc: "Grafik membantu melihat jumlah tugas, status pengerjaan, kesulitan, mood, dan deadline dalam 7 hari ke depan.",
      chips: ["Grafik Live", "Progress", "Kesulitan", "Mata Kuliah"],
    },
    profil: {
      title: "Profil menyimpan identitas pengguna MindMate.",
      desc: "Halaman ini menampilkan informasi pengguna yang sedang masuk agar pengalaman aplikasi terasa personal.",
      chips: ["Nama User", "Email", "Akun", "MindMate"],
    },
  }

  const heroAktif = heroKonten[menuAktif] || heroKonten.beranda

  return (
    <div className="mindmate-bg mobile-safe min-h-screen text-slate-900">
      <button
        onClick={() => setSidebarTerbuka(true)}
        className="fixed left-4 top-4 z-40 rounded-2xl bg-white/90 p-3 text-violet-700 shadow-lg shadow-violet-200/60 ring-1 ring-violet-100 backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-50 active:scale-95 md:hidden"
      >
        <Menu size={20} />
      </button>

      {sidebarTerbuka && (
        <button
          onClick={() => setSidebarTerbuka(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-violet-100/80 bg-white/90 p-5 shadow-[18px_0_45px_rgba(88,28,135,0.10)] backdrop-blur-xl transition md:translate-x-0 ${
          sidebarTerbuka ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-200">
              <Brain size={18} />
            </div>
            <h1 className="text-lg font-black text-violet-700">MindMate AI</h1>
          </div>

          <button onClick={() => setSidebarTerbuka(false)} className="rounded-lg p-2 transition hover:bg-violet-50 hover:text-violet-700 active:scale-95 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2 text-sm">
          <MenuItem active={menuAktif === "beranda"} icon={<Home size={16} />} text="Beranda" onClick={() => ubahMenu("beranda")} />
          <MenuItem active={menuAktif === "mood"} icon={<Smile size={16} />} text="Check-In Mood" onClick={() => ubahMenu("mood")} />
          <MenuItem active={menuAktif === "tugas"} icon={<CheckCircle2 size={16} />} text="Tugas Saya" onClick={() => ubahMenu("tugas")} />
          <MenuItem active={menuAktif === "rencana"} icon={<CalendarCheck size={16} />} text="Rencana AI" onClick={() => ubahMenu("rencana")} />
          <MenuItem active={menuAktif === "jadwal"} icon={<CalendarDays size={16} />} text="Jadwal" onClick={() => ubahMenu("jadwal")} />
          <MenuItem active={menuAktif === "analitik"} icon={<BarChart3 size={16} />} text="Analitik" onClick={() => ubahMenu("analitik")} />
          <MenuItem active={menuAktif === "profil"} icon={<User size={16} />} text="Profil" onClick={() => ubahMenu("profil")} />
        </nav>

        <button
          onClick={() => ubahMenu("jadwal")}
          className="absolute bottom-20 left-5 right-5 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 p-4 text-left text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 hover:shadow-violet-300 active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-violet-100">Cek deadline?</p>
              <p className="mt-1 text-sm font-bold">Buka Jadwal</p>
            </div>
            <Zap size={16} />
          </div>
        </button>

        <button
          onClick={onKeluar}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.98]"
        >
          <LogOut size={16} /> Keluar
        </button>
      </aside>

      <main className="min-h-screen max-w-full overflow-x-hidden md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/70 bg-white/70 px-4 backdrop-blur-xl md:justify-end md:px-8">
          <div className="pl-12 text-sm font-black text-violet-700 sm:text-base md:hidden">MindMate</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMenuAktif("jadwal")}
              className="relative rounded-xl p-2 text-slate-600 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 active:scale-95"
              title="Lihat alarm deadline"
            >
              <Bell size={16} />
              {tugasMendesakJumlah > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {tugasMendesakJumlah}
                </span>
              )}
            </button>
            <button onClick={() => setMenuAktif("profil")} className="flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-2 text-xs shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.98] sm:px-4">
              <span className="hidden max-w-32 truncate sm:inline">Halo, {user?.nama || "User"}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">{(user?.nama || "U").charAt(0).toUpperCase()}</div>
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden px-3 py-5 sm:px-5 md:px-8 lg:px-10 xl:px-12">
          <div className="absolute left-20 top-0 h-80 w-80 rounded-full bg-violet-300/35 blur-3xl" />
          <div className="absolute right-[-80px] bottom-[-80px] h-96 w-96 rounded-full bg-cyan-200/60 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mindmate-card mb-5 flex min-h-[300px] items-center overflow-hidden rounded-3xl p-4 sm:min-h-[285px] sm:p-6 lg:min-h-[280px] lg:p-7">
              <div className="grid w-full gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700 ring-1 ring-violet-100">
                      {judulHalaman[menuAktif]}
                    </span>
                  </div>

                  <h2 className="max-w-3xl text-xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                    {heroAktif.title}
                  </h2>

                  <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
                    {heroAktif.desc}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                    {heroAktif.chips.map((chip) => (
                      <span key={chip} className="rounded-full bg-white/90 px-3 py-1.5 text-slate-600 ring-1 ring-violet-100 shadow-sm">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <button onClick={() => setMenuAktif("tugas")} className="mindmate-button flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700 active:scale-[0.98] sm:w-auto">
                  <PlusCircle size={16} /> Tambah Tugas
                </button>
              </div>
            </div>

            {menuAktif === "beranda" && (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                  <CekMood mood={mood} energi={energi} setMood={setMood} setEnergi={setEnergi} />
                  <RencanaBelajar tugasAktif={tugasAktif || tugasPrioritas[0]} daftarTugas={daftarTugas} mood={mood} energi={energi} />
                </div>
                <div className="space-y-5">
                  <AlasanAI tugasAktif={tugasAktif || tugasPrioritas[0]} mood={mood} energi={energi} onBukaRencana={() => setMenuAktif("rencana")} onBukaJadwal={() => setMenuAktif("jadwal")} />
                  <DaftarPrioritas daftarTugas={daftarTugas} tugasAktif={tugasAktif} setTugasAktif={setTugasAktif} />
                </div>
              </div>
            )}

            {menuAktif === "tugas" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-4">
                  <FormTugas tambahTugas={tambahTugas} />
                  <TabelTugas daftarTugas={daftarTugas} setTugasAktif={setTugasAktif} />
                </div>
                <div className="hidden space-y-4 xl:block">
                  <AlasanAI tugasAktif={tugasAktif || tugasPrioritas[0]} mood={mood} energi={energi} onBukaRencana={() => setMenuAktif("rencana")} onBukaJadwal={() => setMenuAktif("jadwal")} />
                  <DaftarPrioritas daftarTugas={daftarTugas} tugasAktif={tugasAktif} setTugasAktif={setTugasAktif} />
                </div>
              </div>
            )}

            {menuAktif === "mood" && <CekMood mood={mood} energi={energi} setMood={setMood} setEnergi={setEnergi} />}
            {menuAktif === "rencana" && <RencanaBelajar tugasAktif={tugasAktif || tugasPrioritas[0]} daftarTugas={daftarTugas} mood={mood} energi={energi} />}
            {menuAktif === "jadwal" && <JadwalDeadline daftarTugas={daftarTugas} tugasAktif={tugasAktif} setTugasAktif={setTugasAktif} />}
            {menuAktif === "analitik" && <Analitik daftarTugas={daftarTugas} />}
            {menuAktif === "profil" && <Profil user={user} />}
          </div>
        </section>
      </main>

      <AlarmDeadline
        daftarTugas={daftarTugas}
        setTugasAktif={setTugasAktif}
        bukaJadwal={() => setMenuAktif("jadwal")}
      />
    </div>
  )
}

function MenuItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition hover:-translate-y-0.5 active:scale-[0.98] ${
        active ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-200" : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  )
}

function TabelTugas({ daftarTugas, setTugasAktif }) {
  return (
    <section className="mindmate-soft-card overflow-hidden rounded-3xl">
      <div className="border-b border-violet-100 px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-[15px] font-extrabold text-slate-900">Daftar Semua Tugas</h3>
        <p className="mt-1 text-xs text-slate-500 sm:hidden">Tampilan mobile dibuat kartu agar mudah dibaca.</p>
      </div>

      <div className="grid gap-2.5 p-3 sm:hidden">
        {daftarTugas.map((tugas) => (
          <button
            key={tugas.id}
            onClick={() => setTugasAktif(tugas)}
            className="rounded-2xl bg-white/85 p-3 text-left shadow-sm ring-1 ring-violet-100 transition active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">{tugas.nama}</p>
                <p className="mt-1 truncate text-xs font-semibold text-violet-600">{tugas.mataKuliah}</p>
              </div>
              <span className="shrink-0 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-black capitalize text-violet-700">
                {tugas.kesulitan}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Deadline</p>
                <p className="mt-0.5 font-bold text-slate-700">{formatTanggal(tugas.deadline)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                <p className="mt-0.5 font-bold capitalize text-slate-700">{tugas.status}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mindmate-scrollbar hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-violet-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Tugas</th>
              <th className="px-5 py-3">Mata Kuliah</th>
              <th className="px-5 py-3">Deadline</th>
              <th className="px-5 py-3">Kesulitan</th>
              <th className="px-5 py-3">Mood</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-50">
            {daftarTugas.map((tugas) => (
              <tr key={tugas.id} className="bg-white/60">
                <td className="px-5 py-4 font-bold text-slate-800">{tugas.nama}</td>
                <td className="px-5 py-4 text-slate-500">{tugas.mataKuliah}</td>
                <td className="px-5 py-4 text-slate-500">{formatTanggal(tugas.deadline)}</td>
                <td className="px-5 py-4 text-slate-500">{tugas.kesulitan}</td>
                <td className="px-5 py-4 text-slate-500">{labelMood(tugas.mood)}</td>
                <td className="px-5 py-4 text-slate-500">{tugas.status}</td>
                <td className="px-5 py-4">
                  <button onClick={() => setTugasAktif(tugas)} className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white active:scale-95">
                    Pilih
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function formatTanggal(tanggal) {
  if (!tanggal) return "Belum ada deadline"
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${tanggal}T00:00:00`))
}

function labelMood(mood) {
  const daftarMood = {
    semangat: "😄 Semangat",
    normal: "🙂 Normal",
    biasa: "😐 Biasa",
    capek: "😫 Capek",
    stres: "😵 Stres",
  }

  return daftarMood[mood] || "🙂 Normal"
}

function JadwalDeadline({ daftarTugas, tugasAktif, setTugasAktif }) {
  const tanggalAwal = tugasAktif?.deadline ? new Date(`${tugasAktif.deadline}T00:00:00`) : new Date()
  const [bulanAktif, setBulanAktif] = useState(new Date(tanggalAwal.getFullYear(), tanggalAwal.getMonth(), 1))
  const [tanggalDipilih, setTanggalDipilih] = useState(tugasAktif?.deadline || new Date().toISOString().slice(0, 10))

  const tugasPerTanggal = useMemo(() => {
    return daftarTugas.reduce((hasil, tugas) => {
      if (!tugas.deadline) return hasil
      hasil[tugas.deadline] = [...(hasil[tugas.deadline] || []), tugas]
      return hasil
    }, {})
  }, [daftarTugas])

  const namaBulan = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(bulanAktif)
  const awalBulan = new Date(bulanAktif.getFullYear(), bulanAktif.getMonth(), 1)
  const akhirBulan = new Date(bulanAktif.getFullYear(), bulanAktif.getMonth() + 1, 0)
  const offsetAwal = awalBulan.getDay()
  const jumlahHari = akhirBulan.getDate()
  const selKosong = Array.from({ length: offsetAwal })
  const hariBulan = Array.from({ length: jumlahHari }, (_, index) => index + 1)
  const tugasTanggalIni = tugasPerTanggal[tanggalDipilih] || []
  const detailTugas = tugasAktif && tugasAktif.deadline === tanggalDipilih ? tugasAktif : tugasTanggalIni[0]

  function ubahBulan(arah) {
    setBulanAktif(new Date(bulanAktif.getFullYear(), bulanAktif.getMonth() + arah, 1))
  }

  function pilihTanggal(tanggal) {
    const tanggalLengkap = new Date(bulanAktif.getFullYear(), bulanAktif.getMonth(), tanggal + 1).toISOString().slice(0, 10)
    setTanggalDipilih(tanggalLengkap)
    if (tugasPerTanggal[tanggalLengkap]?.[0]) setTugasAktif(tugasPerTanggal[tanggalLengkap][0])
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="mindmate-soft-card rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Jadwal Deadline</h3>
            <p className="mt-1 text-xs text-slate-500">Tanggal yang memiliki tugas sekarang menampilkan keterangan nama tugas langsung di kalender.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => ubahBulan(-1)} className="rounded-xl bg-violet-50 px-3 py-2 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white active:scale-95">‹</button>
            <button onClick={() => ubahBulan(1)} className="rounded-xl bg-violet-50 px-3 py-2 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white active:scale-95">›</button>
          </div>
        </div>

        <div className="mindmate-scrollbar mt-5 overflow-x-auto rounded-2xl bg-violet-50/70 p-4">
          <p className="mb-4 text-center text-base font-black capitalize text-violet-700">{namaBulan}</p>
          <div className="mobile-calendar-grid grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 sm:gap-2 sm:text-xs md:min-w-[680px]">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((hari) => <div key={hari}>{hari}</div>)}
          </div>

          <div className="mobile-calendar-grid mt-2 grid grid-cols-7 gap-1 sm:gap-2 md:min-w-[680px]">
            {selKosong.map((_, index) => <div key={`kosong-${index}`} />)}
            {hariBulan.map((tanggal) => {
              const tanggalLengkap = new Date(bulanAktif.getFullYear(), bulanAktif.getMonth(), tanggal + 1).toISOString().slice(0, 10)
              const daftarTugasTanggal = tugasPerTanggal[tanggalLengkap] || []
              const adaTugas = daftarTugasTanggal.length > 0
              const aktif = tanggalDipilih === tanggalLengkap
              const tugasDitampilkan = daftarTugasTanggal.slice(0, 2)
              const sisaTugas = Math.max(0, daftarTugasTanggal.length - tugasDitampilkan.length)

              return (
                <button
                  key={tanggalLengkap}
                  onClick={() => pilihTanggal(tanggal)}
                  className={`mobile-calendar-cell min-h-[4.75rem] rounded-2xl border p-1 text-left transition sm:min-h-24 sm:p-2 md:min-h-28 ${aktif ? "border-violet-500 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-200" : "border-white bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-md"}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-black">{tanggal}</span>
                    {adaTugas && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${aktif ? "bg-white/20 text-white" : "bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700"}`}>
                        {daftarTugasTanggal.length}
                      </span>
                    )}
                  </div>

                  {adaTugas && (
                    <div className="mt-2 space-y-1">
                      {tugasDitampilkan.map((tugas) => (
                        <div
                          key={tugas.id}
                          className={`mobile-task-chip line-clamp-1 rounded-lg px-1.5 py-0.5 text-[8px] font-bold leading-tight sm:px-2 sm:py-1 sm:text-[10px] ${aktif ? "bg-white/15 text-white" : "bg-violet-50 text-violet-700"}`}
                          title={`${tugas.nama} - ${tugas.mataKuliah}`}
                        >
                          {tugas.nama}
                        </div>
                      ))}

                      {sisaTugas > 0 && (
                        <div className={`mobile-task-chip rounded-lg px-1.5 py-0.5 text-[8px] font-black sm:px-2 sm:py-1 sm:text-[10px] ${aktif ? "bg-white/15 text-white/90" : "bg-slate-100 text-slate-500"}`}>
                          +{sisaTugas} tugas lagi
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="mindmate-soft-card rounded-3xl p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900">Tugas pada {formatTanggal(tanggalDipilih)}</h3>
          <div className="mt-4 space-y-3">
            {tugasTanggalIni.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada tugas pada tanggal ini.</p>}
            {tugasTanggalIni.map((tugas) => (
              <button
                key={tugas.id}
                onClick={() => setTugasAktif(tugas)}
                className={`w-full rounded-xl border p-4 text-left transition ${detailTugas?.id === tugas.id ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100" : "border-violet-100 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"}`}
              >
                <p className="font-black text-slate-900">{tugas.nama}</p>
                <p className="mt-1 text-xs text-slate-500">{tugas.mataKuliah}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mindmate-dark-panel rounded-3xl p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/70">Detail Tugas</p>
          {detailTugas ? (
            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-black">{detailTugas.nama}</h3>
              <DetailJadwal label="Mata kuliah" value={detailTugas.mataKuliah} />
              <DetailJadwal label="Deadline" value={formatTanggal(detailTugas.deadline)} />
              <DetailJadwal label="Kesulitan" value={detailTugas.kesulitan} />
              <DetailJadwal label="Mood" value={labelMood(detailTugas.mood)} />
              <DetailJadwal label="Estimasi" value={detailTugas.estimasi} />
              <DetailJadwal label="Status" value={detailTugas.status} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/60">Pilih tanggal yang memiliki tugas untuk melihat detailnya.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function DetailJadwal({ label, value }) {
  return (
    <div className="mindmate-dark-panel-soft rounded-2xl p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-100/60">{label}</p>
      <p className="mt-1 text-sm font-bold capitalize">{value}</p>
    </div>
  )
}

function hitungJumlah(daftarTugas, field, daftarNilai) {
  return daftarNilai.map((item) => ({
    label: item.label,
    value: item.value,
    jumlah: daftarTugas.filter((tugas) => tugas[field] === item.value).length,
  }))
}

function hitungMataKuliah(daftarTugas) {
  const hasil = daftarTugas.reduce((data, tugas) => {
    const nama = tugas.mataKuliah || "Tanpa Mata Kuliah"
    data[nama] = (data[nama] || 0) + 1
    return data
  }, {})

  return Object.entries(hasil)
    .map(([label, jumlah]) => ({ label, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 5)
}

function hitungDeadlineMingguan(daftarTugas) {
  const hariIni = new Date()
  const mulaiHariIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())

  return Array.from({ length: 7 }, (_, index) => {
    const tanggal = new Date(mulaiHariIni)
    tanggal.setDate(mulaiHariIni.getDate() + index)
    const key = tanggal.toISOString().slice(0, 10)
    const label = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(tanggal)

    return {
      label,
      tanggal: key,
      jumlah: daftarTugas.filter((tugas) => tugas.deadline === key).length,
    }
  })
}

function Analitik({ daftarTugas }) {
  const total = daftarTugas.length
  const selesai = daftarTugas.filter((item) => item.status === "hampir selesai").length
  const belum = daftarTugas.filter((item) => item.status === "belum mulai").length
  const proses = daftarTugas.filter((item) => item.status === "sedang dikerjakan").length
  const persenProgress = total ? Math.round(((proses + selesai) / total) * 100) : 0

  const dataStatus = hitungJumlah(daftarTugas, "status", [
    { label: "Belum Mulai", value: "belum mulai" },
    { label: "Sedang", value: "sedang dikerjakan" },
    { label: "Hampir Selesai", value: "hampir selesai" },
  ])

  const dataKesulitan = hitungJumlah(daftarTugas, "kesulitan", [
    { label: "Mudah", value: "mudah" },
    { label: "Sedang", value: "sedang" },
    { label: "Sulit", value: "sulit" },
  ])

  const dataMood = hitungJumlah(daftarTugas, "mood", [
    { label: "Semangat", value: "semangat" },
    { label: "Normal", value: "normal" },
    { label: "Biasa", value: "biasa" },
    { label: "Capek", value: "capek" },
    { label: "Stres", value: "stres" },
  ])

  const dataMataKuliah = hitungMataKuliah(daftarTugas)
  const dataDeadline = hitungDeadlineMingguan(daftarTugas)

  return (
    <section className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        <KartuAnalitik judul="Total Tugas" nilai={total} subteks="Semua tugas yang masuk" />
        <KartuAnalitik judul="Belum Mulai" nilai={belum} subteks="Perlu segera dijadwalkan" />
        <KartuAnalitik judul="Progress Aktif" nilai={`${persenProgress}%`} subteks={`${proses + selesai} dari ${total || 0} tugas berjalan`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="mindmate-soft-card rounded-3xl p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Grafik Status Tugas</h3>
              <p className="mt-1 text-xs text-slate-500">
                Grafik ini otomatis berubah saat tugas baru ditambahkan atau status tugas berubah.
              </p>
            </div>
            <div className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-black text-violet-700">
              Live Update
            </div>
          </div>

          <div className="space-y-4">
            {dataStatus.map((item) => (
              <GrafikBarHorizontal key={item.value} label={item.label} jumlah={item.jumlah} total={total} />
            ))}
          </div>
        </div>

        <div className="mindmate-dark-panel rounded-3xl p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100/70">Ringkasan Progress</p>
          <div className="mt-6 flex items-center justify-center">
            <GrafikDonat persen={persenProgress} />
          </div>
          <p className="mt-5 text-center text-sm leading-relaxed text-white/60">
            Progress dihitung dari tugas yang sedang dikerjakan dan hampir selesai.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="mindmate-soft-card rounded-3xl p-6">
          <h3 className="text-lg font-black text-slate-900">Grafik Kesulitan</h3>
          <p className="mt-1 text-xs text-slate-500">Menunjukkan tingkat kesulitan tugas Teknik Informatika.</p>

          <div className="mt-5 flex min-h-64 items-end gap-4">
            {dataKesulitan.map((item) => (
              <GrafikBarVertikal key={item.value} label={item.label} jumlah={item.jumlah} total={Math.max(...dataKesulitan.map((data) => data.jumlah), 1)} />
            ))}
          </div>
        </div>

        <div className="mindmate-soft-card rounded-3xl p-6">
          <h3 className="text-lg font-black text-slate-900">Grafik Mood Tugas</h3>
          <p className="mt-1 text-xs text-slate-500">Mood ikut berubah otomatis dari input tugas.</p>

          <div className="mt-5 space-y-3">
            {dataMood.map((item) => (
              <GrafikBarHorizontal key={item.value} label={item.label} jumlah={item.jumlah} total={total} kecil />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="mindmate-soft-card rounded-3xl p-6">
          <h3 className="text-lg font-black text-slate-900">Mata Kuliah Terbanyak</h3>
          <p className="mt-1 text-xs text-slate-500">Cocok untuk melihat mata kuliah TI yang paling banyak tugasnya.</p>

          <div className="mt-5 space-y-3">
            {dataMataKuliah.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada data mata kuliah.</p>
            )}

            {dataMataKuliah.map((item, index) => (
              <div key={item.label} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.label}</p>
                    <p className="mt-1 text-xs font-bold text-violet-600">#{index + 1} paling banyak</p>
                  </div>
                  <p className="text-2xl font-black text-violet-700">{item.jumlah}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mindmate-soft-card rounded-3xl p-6">
          <h3 className="text-lg font-black text-slate-900">Deadline 7 Hari ke Depan</h3>
          <p className="mt-1 text-xs text-slate-500">Jika user menambah deadline baru, chart ini langsung ikut berubah.</p>

          <div className="mobile-chart-compact mt-5 flex min-h-52 items-end gap-2 rounded-2xl bg-violet-50/70 p-3 sm:min-h-72 sm:gap-3 sm:p-4">
            {dataDeadline.map((item) => (
              <GrafikBarDeadline key={item.tanggal} label={item.label} jumlah={item.jumlah} total={Math.max(...dataDeadline.map((data) => data.jumlah), 1)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GrafikBarHorizontal({ label, jumlah, total, kecil = false }) {
  const persen = total ? Math.round((jumlah / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className={`${kecil ? "text-xs" : "text-sm"} font-bold text-slate-700`}>{label}</p>
        <p className="text-xs font-black text-violet-700">{jumlah} tugas • {persen}%</p>
      </div>
      <div className={`${kecil ? "h-3" : "h-4"} overflow-hidden rounded-full bg-violet-50 ring-1 ring-violet-100`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${persen}%` }}
        />
      </div>
    </div>
  )
}

function GrafikBarVertikal({ label, jumlah, total }) {
  const tinggi = total ? Math.max(8, Math.round((jumlah / total) * 100)) : 8

  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <div className="flex h-48 w-full max-w-28 items-end justify-center rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
        <div
          className="w-full rounded-xl bg-gradient-to-t from-violet-700 via-violet-500 to-cyan-300 shadow-lg shadow-violet-100 transition-all duration-700"
          style={{ height: `${tinggi}%` }}
        />
      </div>
      <div className="text-center">
        <p className="text-2xl font-black text-violet-700">{jumlah}</p>
        <p className="text-xs font-bold text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function GrafikBarDeadline({ label, jumlah, total }) {
  const tinggi = total ? Math.max(8, Math.round((jumlah / total) * 100)) : 8

  return (
    <div className="flex flex-1 flex-col items-center justify-end gap-3">
      <div className="flex h-52 w-full items-end justify-center">
        <div
          className="w-full rounded-t-2xl bg-gradient-to-t from-violet-600 via-fuchsia-500 to-cyan-300 shadow-lg shadow-violet-100 transition-all duration-700"
          style={{ height: `${tinggi}%` }}
          title={`${jumlah} tugas`}
        />
      </div>
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="rounded-full bg-white px-2 py-1 text-[11px] font-black text-violet-700 shadow-sm">{jumlah}</p>
    </div>
  )
}

function GrafikDonat({ persen }) {
  return (
    <div className="relative flex h-44 w-44 items-center justify-center rounded-full transition-all duration-700"
      style={{
        background: `conic-gradient(#8b5cf6 ${persen * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
      }}
    >
      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-950 ring-1 ring-white/10">
        <p className="text-4xl font-black text-white">{persen}%</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Aktif</p>
      </div>
    </div>
  )
}

function KartuAnalitik({ judul, nilai, subteks }) {
  return (
    <div className="mindmate-soft-card rounded-3xl p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{judul}</p>
      <p className="mt-3 text-4xl font-black text-violet-700">{nilai}</p>
      {subteks && <p className="mt-2 text-xs font-semibold text-slate-400">{subteks}</p>}
    </div>
  )
}


function Profil({ user }) {
  return (
    <section className="mindmate-soft-card rounded-3xl p-6">
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-3xl font-black text-violet-700">{(user?.nama || "U").charAt(0).toUpperCase()}</div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">{user?.nama || "User MindMate"}</h3>
          <p className="mt-1 text-sm text-slate-500">{user?.email || "user@mindmate.ai"}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Profil ini masih memakai data dummy karena project belum terhubung backend/database. Nanti data bisa diganti dari API atau database.
          </p>
        </div>
      </div>
    </section>
  )
}
