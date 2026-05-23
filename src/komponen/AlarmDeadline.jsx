import { useEffect, useMemo, useState } from "react"
import { AlarmClock, BellRing, CalendarDays, CheckCircle2, ShieldCheck, Volume2, X } from "lucide-react"

const STORAGE_AKTIF = "mindmate_alarm_deadline_aktif"
const STORAGE_NOTIF = "mindmate_alarm_deadline_terkirim"

function sisaHari(deadline) {
  if (!deadline) return 999
  const hariIni = new Date()
  const target = new Date(`${deadline}T00:00:00`)
  const mulaiHariIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())
  return Math.ceil((target - mulaiHariIni) / (1000 * 60 * 60 * 24))
}

function labelDeadline(deadline) {
  const hari = sisaHari(deadline)
  if (hari < 0) return `Terlambat ${Math.abs(hari)} hari`
  if (hari === 0) return "Deadline hari ini"
  if (hari === 1) return "Deadline besok"
  return `${hari} hari lagi`
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${tanggal}T00:00:00`))
}

function bunyiAlarm() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audio = new AudioContext()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(720, audio.currentTime)
    oscillator.frequency.setValueAtTime(920, audio.currentTime + 0.18)

    gain.gain.setValueAtTime(0.0001, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.22, audio.currentTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.6)

    oscillator.connect(gain)
    gain.connect(audio.destination)
    oscillator.start()
    oscillator.stop(audio.currentTime + 0.65)
  } catch {
    // Browser bisa menolak audio otomatis. Alarm visual tetap berjalan.
  }
}

function ambilNotifTerkirim() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_NOTIF) || "{}")
  } catch {
    return {}
  }
}

function simpanNotifTerkirim(data) {
  localStorage.setItem(STORAGE_NOTIF, JSON.stringify(data))
}

export default function AlarmDeadline({ daftarTugas = [], setTugasAktif, bukaJadwal }) {
  const [alarmAktif, setAlarmAktif] = useState(() => localStorage.getItem(STORAGE_AKTIF) === "true")
  const [toast, setToast] = useState(null)
  const [terbuka, setTerbuka] = useState(true)

  const tugasMendesak = useMemo(() => {
    return daftarTugas
      .filter((tugas) => tugas.deadline && tugas.status !== "selesai")
      .map((tugas) => ({ ...tugas, sisa: sisaHari(tugas.deadline) }))
      .filter((tugas) => tugas.sisa <= 1)
      .sort((a, b) => a.sisa - b.sisa)
  }, [daftarTugas])

  const tugasTerdekat = tugasMendesak[0]

  async function aktifkanAlarm() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    localStorage.setItem(STORAGE_AKTIF, "true")
    setAlarmAktif(true)
    setTerbuka(true)
    setToast({
      tipe: "aktif",
      judul: "Alarm deadline aktif",
      pesan: "MindMate akan memberi peringatan untuk deadline hari ini atau besok selama website terbuka.",
      tugas: null,
    })
    bunyiAlarm()
  }

  function matikanAlarm() {
    localStorage.setItem(STORAGE_AKTIF, "false")
    setAlarmAktif(false)
    setToast({
      tipe: "mati",
      judul: "Alarm deadline dimatikan",
      pesan: "Kamu masih bisa melihat deadline dari menu Jadwal.",
      tugas: null,
    })
  }

  function cekSekarang({ paksaBunyi = false } = {}) {
    if (!tugasTerdekat) {
      setToast({
        tipe: "aman",
        judul: "Belum ada deadline mendesak",
        pesan: "Tidak ada tugas yang deadline hari ini atau besok.",
        tugas: null,
      })
      if (paksaBunyi) bunyiAlarm()
      return
    }

    const pesan = `${tugasTerdekat.nama} • ${formatTanggal(tugasTerdekat.deadline)} • ${labelDeadline(tugasTerdekat.deadline)}`
    setToast({
      tipe: "deadline",
      judul: "Alarm deadline!",
      pesan,
      tugas: tugasTerdekat,
    })
    bunyiAlarm()

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("MindMate: Alarm deadline!", {
        body: pesan,
      })
    }
  }

  useEffect(() => {
    if (!alarmAktif || !tugasTerdekat) return undefined

    const cekOtomatis = () => {
      const hariIni = new Date().toISOString().slice(0, 10)
      const key = `${hariIni}-${tugasTerdekat.id}-${tugasTerdekat.deadline}`
      const terkirim = ambilNotifTerkirim()

      if (terkirim[key]) return

      terkirim[key] = true
      simpanNotifTerkirim(terkirim)
      cekSekarang()
    }

    cekOtomatis()
    const interval = window.setInterval(cekOtomatis, 60_000)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmAktif, tugasTerdekat?.id, tugasTerdekat?.deadline])

  if (!terbuka && !toast) {
    return (
      <button
        onClick={() => setTerbuka(true)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-300 transition hover:-translate-y-1 active:scale-95 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
        title="Buka alarm deadline"
      >
        <AlarmClock size={22} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-3 right-3 z-40 w-[min(340px,calc(100vw-1.5rem))] space-y-3 sm:bottom-5 sm:right-5 sm:w-[min(380px,calc(100vw-2rem))]">
      {toast && (
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950 to-violet-950 p-4 text-white shadow-2xl shadow-rose-200/20 ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/30 to-amber-400/20 text-rose-100">
                <BellRing size={18} />
              </div>
              <div>
                <p className="font-black">{toast.judul}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{toast.pesan}</p>
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white active:scale-90"
            >
              <X size={16} />
            </button>
          </div>

          {toast.tugas && (
            <button
              onClick={() => {
                setTugasAktif?.(toast.tugas)
                bukaJadwal?.()
                setToast(null)
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-violet-700 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-violet-50 active:scale-[0.98]"
            >
              <CalendarDays size={14} /> Lihat di Jadwal
            </button>
          )}
        </div>
      )}

      {terbuka && (
        <div className="rounded-3xl bg-white/95 p-3 shadow-2xl shadow-violet-200 ring-1 ring-violet-100 backdrop-blur-xl sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                <AlarmClock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Alarm Deadline</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {alarmAktif
                    ? "Aktif. Alarm berbunyi jika ada deadline hari ini atau besok."
                    : "Aktifkan agar MindMate mengingatkan deadline mendesak."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTerbuka(false)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-violet-50 hover:text-violet-700 active:scale-90"
            >
              <X size={16} />
            </button>
          </div>

          {tugasTerdekat ? (
            <div className="rounded-xl bg-violet-50 p-3 ring-1 ring-violet-100">
              <p className="text-xs font-black text-violet-700">{labelDeadline(tugasTerdekat.deadline)}</p>
              <p className="mt-1 text-sm font-black text-slate-900">{tugasTerdekat.nama}</p>
              <p className="mt-1 text-xs text-slate-500">{formatTanggal(tugasTerdekat.deadline)} • {tugasTerdekat.kesulitan}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-cyan-50 p-3 text-xs font-bold text-cyan-700 ring-1 ring-cyan-100">
              <CheckCircle2 size={15} className="mr-1 inline" />
              Tidak ada deadline hari ini atau besok.
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {alarmAktif ? (
              <button
                onClick={matikanAlarm}
                className="rounded-xl border border-violet-100 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.98]"
              >
                Matikan
              </button>
            ) : (
              <button
                onClick={aktifkanAlarm}
                className="rounded-2xl bg-violet-600 px-3 py-3 text-xs font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 active:scale-[0.98]"
              >
                Aktifkan
              </button>
            )}

            <button
              onClick={() => cekSekarang({ paksaBunyi: true })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]"
            >
              <Volume2 size={14} /> Tes
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
            <ShieldCheck size={13} className="text-violet-600" />
            Alarm berjalan saat website MindMate sedang terbuka.
          </div>
        </div>
      )}
    </div>
  )
}
