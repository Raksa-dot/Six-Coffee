import { useEffect, useMemo, useState } from "react"
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  TimerReset,
} from "lucide-react"

function badgeSumber(sumber) {
  if (sumber === "openai-api") return "OpenAI API aktif"
  if (sumber === "demo-lokal") return "Mode demo lokal"
  return "Belum dibuat"
}

function parseDurasiKeDetik(durasi = "0 menit") {
  const teks = String(durasi).toLowerCase()
  const jamMatch = teks.match(/(\d+)\s*jam/)
  const menitMatch = teks.match(/(\d+)\s*menit/)
  const detikMatch = teks.match(/(\d+)\s*detik/)

  const jam = jamMatch ? Number(jamMatch[1]) : 0
  const menit = menitMatch ? Number(menitMatch[1]) : 0
  const detik = detikMatch ? Number(detikMatch[1]) : 0

  const totalDetik = jam * 3600 + menit * 60 + detik
  return totalDetik > 0 ? totalDetik : 25 * 60
}

function formatCountdown(totalDetik) {
  const aman = Math.max(0, Number(totalDetik) || 0)
  const jam = Math.floor(aman / 3600)
  const menit = Math.floor((aman % 3600) / 60)
  const detik = aman % 60

  if (jam > 0) {
    return [jam, menit, detik].map((item) => String(item).padStart(2, "0")).join(":")
  }

  return [menit, detik].map((item) => String(item).padStart(2, "0")).join(":")
}

function CountdownRencana({ jadwalHariIni = [] }) {
  const [sesiAktifIndex, setSesiAktifIndex] = useState(0)
  const [sedangJalan, setSedangJalan] = useState(false)
  const [sisaDetik, setSisaDetik] = useState(parseDurasiKeDetik(jadwalHariIni[0]?.durasi))

  const sesiAktif = useMemo(() => jadwalHariIni[sesiAktifIndex] || null, [jadwalHariIni, sesiAktifIndex])
  const durasiAwal = useMemo(() => parseDurasiKeDetik(sesiAktif?.durasi), [sesiAktif])
  const progressPersen = durasiAwal > 0 ? Math.min(100, Math.max(0, ((durasiAwal - sisaDetik) / durasiAwal) * 100)) : 0

  useEffect(() => {
    setSesiAktifIndex(0)
    setSedangJalan(false)
    setSisaDetik(parseDurasiKeDetik(jadwalHariIni[0]?.durasi))
  }, [jadwalHariIni])

  useEffect(() => {
    if (!sedangJalan) return undefined
    if (sisaDetik <= 0) {
      setSedangJalan(false)
      return undefined
    }

    const interval = window.setInterval(() => {
      setSisaDetik((nilai) => {
        if (nilai <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return nilai - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [sedangJalan, sisaDetik])

  function pilihSesi(index) {
    setSesiAktifIndex(index)
    setSedangJalan(false)
    setSisaDetik(parseDurasiKeDetik(jadwalHariIni[index]?.durasi))
  }

  function resetTimer() {
    setSedangJalan(false)
    setSisaDetik(durasiAwal)
  }

  if (!jadwalHariIni.length) {
    return (
      <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
        <h3 className="mb-3 text-[15px] font-extrabold text-slate-900">Rencana untuk Mengerjakan</h3>
        <p className="text-xs leading-relaxed text-slate-500">
          Countdown sesi akan muncul setelah AI berhasil membuat jadwal belajar.
        </p>
      </div>
    )
  }

  return (
    <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <TimerReset size={18} className="text-violet-600" />
        <h3 className="text-[15px] font-extrabold text-slate-900">Rencana untuk Mengerjakan</h3>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-5 text-white shadow-md shadow-violet-200">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-100">Sesi aktif</p>
        <h4 className="mt-2 text-lg font-black">{sesiAktif?.waktu || "Sesi"}</h4>
        <p className="mt-1 text-sm text-violet-50">{sesiAktif?.kegiatan || "Pilih sesi untuk memulai countdown."}</p>

        <div className="mt-5 rounded-2xl bg-white/10 px-4 py-5 text-center ring-1 ring-white/15">
          <p className="text-xs font-bold text-violet-100">Durasi sesi: {sesiAktif?.durasi || "-"}</p>
          <p className="mt-2 text-3xl font-black tracking-[0.08em] sm:text-4xl md:text-5xl">{formatCountdown(sisaDetik)}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progressPersen}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setSedangJalan(true)}
            disabled={sisaDetik <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-violet-700 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-white"
          >
            <Play size={14} /> Mulai
          </button>
          <button
            onClick={() => setSedangJalan(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-white ring-1 ring-white/15"
          >
            <Pause size={14} /> Jeda
          </button>
          <button
            onClick={resetTimer}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-white ring-1 ring-white/15"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Daftar sesi</p>
        {jadwalHariIni.map((item, index) => (
          <button
            key={`${item.waktu}-${index}`}
            onClick={() => pilihSesi(index)}
            className={`w-full rounded-xl p-3 text-left transition ${
              sesiAktifIndex === index ? "bg-violet-50 ring-1 ring-violet-200" : "bg-slate-50 ring-1 ring-slate-100"
            }`}
          >
            <p className="text-xs font-black text-violet-700">{item.waktu} • {item.durasi}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{item.kegiatan}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function RencanaBelajar({ tugasAktif, daftarTugas = [], mood = "normal", energi = "cukup" }) {
  const [rencana, setRencana] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pesanError, setPesanError] = useState("")
  const [statusAI, setStatusAI] = useState({ openaiAktif: false, model: "-" })

  async function ambilStatusAI() {
    try {
      const response = await fetch("/api/status-ai")
      const data = await response.json()
      setStatusAI(data)
    } catch {
      setStatusAI({ openaiAktif: false, model: "server belum aktif" })
    }
  }

  async function buatRencana() {
    setLoading(true)
    setPesanError("")

    try {
      const response = await fetch("/api/rencana-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tugasAktif,
          daftarTugas,
          mood,
          energi,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.pesan || "Gagal membuat rencana AI")
      setRencana(data)
    } catch (error) {
      setPesanError(
        "Server AI belum aktif. Jalankan npm run dev:full, atau buka dua terminal: npm run server dan npm run dev."
      )
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilStatusAI()
  }, [])

  useEffect(() => {
    if (tugasAktif) buatRencana()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tugasAktif?.id, mood, energi])

  return (
    <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Bot size={18} className="text-violet-600" />
              <h3 className="text-[15px] font-extrabold text-slate-900">Rencana AI</h3>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-slate-500">
              AI membaca tugas, deadline, tingkat kesulitan, mood, energi, dan status tugas untuk membuat rencana belajar harian.
            </p>
          </div>

          <button
            onClick={buatRencana}
            disabled={loading || !tugasAktif}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-xs font-extrabold text-white shadow-md shadow-violet-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Buat Ulang
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">{badgeSumber(rencana?.sumber)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Model: {rencana?.model || statusAI.model}</span>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-700">Status key: {statusAI.openaiAktif ? "tersambung" : "belum diisi"}</span>
        </div>

        {pesanError && (
          <div className="mb-4 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-700 ring-1 ring-amber-100">
            {pesanError}
          </div>
        )}

        {!tugasAktif && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Tambahkan tugas terlebih dahulu agar AI bisa membuat rencana belajar.
          </div>
        )}

        {loading && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-violet-50/70 text-center">
            <Loader2 className="mb-3 animate-spin text-violet-600" size={28} />
            <p className="text-sm font-bold text-slate-700">MindMate AI sedang menyusun rencana...</p>
            <p className="mt-1 text-xs text-slate-500">Data tugas dan mood sedang dianalisis.</p>
          </div>
        )}

        {!loading && rencana && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-5 text-white shadow-lg shadow-violet-200">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-violet-100">
                <Sparkles size={14} /> Hasil Rencana AI
              </div>
              <h4 className="text-xl font-black leading-tight">{rencana.judul}</h4>
              <p className="mt-3 text-sm leading-relaxed text-violet-50">{rencana.ringkasan}</p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-black text-slate-900">Langkah Pengerjaan</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {(rencana.langkah || []).map((item, index) => (
                  <div key={index} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-black text-slate-900">Jadwal Hari Ini</h4>
              <div className="space-y-3">
                {(rencana.jadwalHariIni || []).map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-violet-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 text-cyan-700">
                      <CalendarClock size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-violet-700">{item.waktu} • {item.durasi}</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{item.kegiatan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-5">
        <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
          <h3 className="mb-4 text-[15px] font-extrabold text-slate-900">Prioritas AI</h3>
          <p className="text-lg font-black text-violet-700">{rencana?.prioritas || tugasAktif?.nama || "Belum ada tugas"}</p>
          <div className="mt-4 space-y-3">
            {(rencana?.alasanPrioritas || []).map((item, index) => (
              <div key={index} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-violet-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mindmate-dark-panel rounded-3xl p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/70">Tips Mood</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {rencana?.tipsMood || "Pilih mood dan energi terlebih dahulu agar saran AI lebih sesuai."}
          </p>
        </div>

        <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900">Data yang dikirim ke AI</h3>
          <div className="mt-4 space-y-2 text-xs text-slate-500">
            <p><b>Tugas:</b> {tugasAktif?.nama || "-"}</p>
            <p><b>Deadline:</b> {tugasAktif?.deadline || "-"}</p>
            <p><b>Kesulitan:</b> {tugasAktif?.kesulitan || "-"}</p>
            <p><b>Mood harian:</b> {mood}</p>
            <p><b>Energi:</b> {energi}</p>
          </div>
        </div>

        <CountdownRencana jadwalHariIni={rencana?.jadwalHariIni || []} />
      </aside>
    </section>
  )
}

export default RencanaBelajar
