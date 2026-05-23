import { Target, AlarmClock, Battery, Smile, Zap } from "lucide-react"

const moodOptions = [
  { value: "semangat", label: "Semangat", emoji: "😄", desc: "Siap mulai dari tugas sulit" },
  { value: "normal", label: "Normal", emoji: "🙂", desc: "Cocok untuk ritme stabil" },
  { value: "biasa", label: "Biasa", emoji: "😐", desc: "Mulai dari tugas ringan" },
  { value: "capek", label: "Capek", emoji: "😫", desc: "Pakai sesi pendek" },
  { value: "stres", label: "Stres", emoji: "😵", desc: "Pecah tugas jadi kecil" },
]

const energiOptions = [
  { value: "rendah", label: "Rendah", emoji: "🪫", desc: "Kerjakan 15 menit dulu" },
  { value: "cukup", label: "Cukup", emoji: "🔋", desc: "Gunakan ritme normal" },
  { value: "tinggi", label: "Tinggi", emoji: "⚡", desc: "Mulai dari prioritas tinggi" },
]

function kapital(teks = "") {
  return teks.charAt(0).toUpperCase() + teks.slice(1)
}

function labelMood(mood) {
  return moodOptions.find((item) => item.value === mood)?.label || kapital(mood)
}

function emojiMood(mood) {
  return moodOptions.find((item) => item.value === mood)?.emoji || "🙂"
}

function labelEnergi(energi) {
  return energiOptions.find((item) => item.value === energi)?.label || kapital(energi)
}

function emojiEnergi(energi) {
  return energiOptions.find((item) => item.value === energi)?.emoji || "🔋"
}

function KartuStatus({ icon: Icon, judul, nilai, emoji, warna, bg }) {
  return (
    <div className="mindmate-soft-card flex min-h-[104px] flex-col items-center justify-center rounded-3xl p-3 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100 sm:min-h-[112px] sm:p-4">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
        {emoji ? <span className="text-xl">{emoji}</span> : <Icon size={17} className={warna} />}
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {judul}
      </p>

      <p className={`mt-1 text-base font-extrabold sm:text-lg ${warna}`}>{nilai}</p>
    </div>
  )
}

function PilihanEmoji({ item, aktif, onClick, tipe }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 active:scale-[0.98] ${
        aktif
          ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
          : "border-violet-100 bg-white/85 hover:border-violet-200 hover:bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ${
          aktif ? "bg-violet-600 text-white" : "bg-violet-50"
        }`}>
          {item.emoji}
        </div>

        <div className="min-w-0">
          <p className="font-black text-slate-900">{item.label}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500">{item.desc}</p>
        </div>
      </div>

      {aktif && (
        <div className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-[11px] font-bold text-violet-700 ring-1 ring-violet-100">
          {tipe === "mood" ? "Mood dipilih" : "Energi dipilih"}
        </div>
      )}
    </button>
  )
}

function CekMood({ mood, energi, setMood, setEnergi }) {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <KartuStatus
          icon={Target}
          judul="SKOR FOKUS"
          nilai="85"
          warna="text-violet-600"
          bg="bg-violet-100"
        />
        <KartuStatus
          icon={AlarmClock}
          judul="TENGGAT WAKTU"
          nilai="2"
          warna="text-red-500"
          bg="bg-red-100"
        />
        <KartuStatus
          icon={Battery}
          judul="ENERGI"
          nilai={labelEnergi(energi)}
          emoji={emojiEnergi(energi)}
          warna="text-teal-500"
          bg="bg-teal-100"
        />
        <KartuStatus
          icon={Smile}
          judul="MOOD"
          nilai={labelMood(mood)}
          emoji={emojiMood(mood)}
          warna="text-violet-500"
          bg="bg-violet-100"
        />
      </div>

      <div className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-black text-slate-900">Check-In Mood</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Pilih mood dan energi hari ini. Rencana AI akan menyesuaikan saran belajar berdasarkan pilihan ini.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700 ring-1 ring-violet-100">
            <Zap size={13} /> {emojiMood(mood)} {labelMood(mood)}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Bagaimana mood kamu?</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {moodOptions.map((item) => (
              <PilihanEmoji
                key={item.value}
                item={item}
                aktif={mood === item.value}
                tipe="mood"
                onClick={() => setMood(item.value)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Bagaimana energi kamu?</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {energiOptions.map((item) => (
              <PilihanEmoji
                key={item.value}
                item={item}
                aktif={energi === item.value}
                tipe="energi"
                onClick={() => setEnergi(item.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CekMood
