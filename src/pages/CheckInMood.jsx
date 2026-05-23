import { BatteryMedium, Save, Smile } from "lucide-react"
import { useState } from "react"
import Button from "../components/Button"
import StatCard from "../components/StatCard"

const moods = ["Senang", "Netral", "Cemas", "Lelah", "Semangat"]
const energies = ["Rendah", "Sedang", "Tinggi"]

export default function CheckInMood({ appData, onSaveMood }) {
  const [mood, setMood] = useState(appData.mood.mood)
  const [energy, setEnergy] = useState(appData.mood.energy)
  const [note, setNote] = useState(appData.mood.note)
  const [message, setMessage] = useState("")

  function submit(event) {
    event.preventDefault()
    onSaveMood({ mood, energy, note })
    setMessage(`Kondisi berhasil disimpan. AI akan menyesuaikan rekomendasi dengan mood ${mood} dan energi ${energy}.`)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Check-In Mood</p>
        <h2 className="text-3xl font-black">Bagaimana kondisimu hari ini?</h2>
        <p className="mt-2 text-sm text-slate-500">Mood dan energi dipakai AI untuk mengatur prioritas tugas, rencana belajar, dan durasi fokus.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-sm">
          <form onSubmit={submit} className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-black">Pilih Mood</h3>
              <div className="grid gap-3 md:grid-cols-5">
                {moods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMood(item)}
                    className={`rounded-2xl border p-4 text-sm font-black transition ${mood === item ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200" : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-black">Pilih Energi</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {energies.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEnergy(item)}
                    className={`rounded-2xl border p-4 text-sm font-black transition ${energy === item ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200" : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">Catatan singkat</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input min-h-[110px] resize-none" placeholder="Contoh: hari ini agak lelah karena banyak kelas" />
            </div>

            <Button type="submit"><Save size={16} /> Simpan Kondisi</Button>
          </form>
        </div>

        <div className="space-y-5">
          <StatCard icon={<Smile size={18} />} title="Mood Saat Ini" value={appData.mood.mood} desc={appData.mood.note} />
          <StatCard icon={<BatteryMedium size={18} />} title="Energi Saat Ini" value={appData.mood.energy} color="text-cyan-700" desc="Mempengaruhi durasi fokus" />
          {message && <div className="rounded-2xl bg-violet-600 p-5 text-sm font-bold leading-6 text-white shadow-lg shadow-violet-200">{message}</div>}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white/90 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-black">Riwayat Mood</h3>
        <div className="grid gap-3 md:grid-cols-4">
          {appData.moodLogs.slice(-8).reverse().map((log) => (
            <div key={log.id} className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
              <p className="text-sm font-black">{log.mood}</p>
              <p className="text-xs font-bold text-slate-500">Energi {log.energy}</p>
              <p className="mt-2 text-xs text-slate-500">{log.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
