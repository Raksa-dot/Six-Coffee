import { useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  ListChecks,
  MessageCircle,
  Sparkles,
  TimerReset,
} from "lucide-react"
import { buatAlasanAI } from "../logika/prioritas"

function rekomendasiLangkah(tugasAktif, mood, energi) {
  if (!tugasAktif) return []

  const langkahDasar = [
    {
      judul: "Baca kebutuhan tugas",
      deskripsi: `Pahami instruksi ${tugasAktif.nama} dan tulis poin yang belum jelas.`,
    },
    {
      judul: "Kerjakan bagian inti",
      deskripsi:
        tugasAktif.mataKuliah?.toLowerCase().includes("pemrograman") ||
        tugasAktif.nama?.toLowerCase().includes("coding") ||
        tugasAktif.nama?.toLowerCase().includes("crud")
          ? "Mulai dari struktur folder, database, route, controller, lalu uji fitur utama."
          : "Mulai dari bagian tersulit agar progress utama cepat terlihat.",
    },
    {
      judul: "Review dan simpan hasil",
      deskripsi: "Cek ulang hasil, rapikan catatan, lalu lanjutkan ke Rencana AI atau Jadwal.",
    },
  ]

  if (energi === "rendah" || mood === "capek" || mood === "stres") {
    return [
      {
        judul: "Mulai dari bagian kecil",
        deskripsi: "Kerjakan 15-20 menit dulu agar tugas tidak terasa terlalu berat.",
      },
      ...langkahDasar.slice(0, 2),
    ]
  }

  return langkahDasar
}

function AlasanAI({ tugasAktif, mood, energi, onBukaRencana, onBukaJadwal }) {
  const [terbuka, setTerbuka] = useState(false)
  const [langkahSelesai, setLangkahSelesai] = useState([])

  const hasil = tugasAktif ? buatAlasanAI(tugasAktif, mood, energi) : null
  const langkah = useMemo(() => rekomendasiLangkah(tugasAktif, mood, energi), [tugasAktif, mood, energi])
  const progress = langkah.length ? Math.round((langkahSelesai.length / langkah.length) * 100) : 0

  if (!tugasAktif) {
    return (
      <section className="mindmate-soft-card rounded-3xl p-4 sm:p-5 backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <MessageCircle size={17} className="text-violet-600" />
          <h3 className="text-lg font-extrabold leading-tight text-slate-900">Rekomendasi AI</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-500">
          Tambahkan tugas terlebih dahulu agar rekomendasi bisa dibuat.
        </p>
      </section>
    )
  }

  function toggleLangkah(index) {
    setLangkahSelesai((sebelumnya) =>
      sebelumnya.includes(index)
        ? sebelumnya.filter((item) => item !== index)
        : [...sebelumnya, index]
    )
  }

  function laksanakan() {
    setTerbuka(true)
    setLangkahSelesai([])
  }

  return (
    <section className="mindmate-soft-card rounded-3xl p-4 sm:p-5 backdrop-blur transition hover:shadow-lg hover:shadow-violet-100">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={17} className="text-violet-600" />
          <h3 className="text-lg font-extrabold leading-tight text-slate-900">
            Rekomendasi AI
          </h3>
        </div>

        <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase text-violet-700">
          {hasil.level}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-slate-600">
        “<span>{hasil.alasan}</span>”
      </p>

      <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
        {hasil.strategi}
      </p>

      <div className="mt-4 rounded-xl bg-violet-50 p-3 ring-1 ring-violet-100">
        <div className="flex items-center gap-2 text-xs font-black text-violet-700">
          <Code2 size={14} />
          Fokus Teknik Informatika
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Mata kuliah: <b>{tugasAktif.mataKuliah}</b>. Rekomendasi diarahkan ke alur kerja praktis seperti analisis kebutuhan, coding, database, testing, dan dokumentasi.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={laksanakan}
          className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-[12px] font-extrabold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-violet-300 active:scale-[0.98]"
        >
          <Sparkles size={15} /> Laksanakan Rekomendasi <ArrowRight size={14} />
        </button>

        <button
          onClick={onBukaRencana}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-[11px] font-extrabold text-violet-700 ring-1 ring-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-50 active:scale-[0.98]"
        >
          <TimerReset size={14} /> Rencana AI
        </button>

        <button
          onClick={onBukaJadwal}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-[11px] font-extrabold text-violet-700 ring-1 ring-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-50 active:scale-[0.98]"
        >
          <CalendarDays size={14} /> Jadwal
        </button>
      </div>

      {terbuka && (
        <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white shadow-xl">
          <button
            onClick={() => setTerbuka(false)}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-left transition hover:bg-white/10 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/60">
              <ListChecks size={14} /> Checklist Eksekusi
            </span>
            {terbuka ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-white/60">
              <span>Progress rekomendasi</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {langkah.map((item, index) => {
              const selesai = langkahSelesai.includes(index)

              return (
                <button
                  key={item.judul}
                  onClick={() => toggleLangkah(index)}
                  className={`flex w-full gap-3 rounded-xl p-3 text-left transition hover:-translate-y-0.5 active:scale-[0.98] ${
                    selesai ? "bg-violet-500/25 ring-1 ring-violet-300/30" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    selesai ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white/60"
                  }`}>
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-black">{item.judul}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{item.deskripsi}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {progress === 100 && (
            <div className="mt-4 rounded-xl bg-cyan-300/15 p-3 text-xs font-bold text-cyan-100 ring-1 ring-cyan-200/20">
              Bagus! Semua langkah rekomendasi sudah ditandai. Lanjutkan cek Rencana AI untuk sesi pengerjaan.
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default AlasanAI
