import { Save, User } from "lucide-react"
import { useState } from "react"
import Button from "../components/Button"

export default function Profil({ appData, onSaveProfile, onResetData }) {
  const [form, setForm] = useState(appData.profile)
  const [message, setMessage] = useState("")

  function save(event) {
    event.preventDefault()
    onSaveProfile(form)
    setMessage("Profil berhasil disimpan.")
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Profil</p>
        <h2 className="text-3xl font-black">Data pengguna</h2>
        <p className="mt-2 text-sm text-slate-500">Profil dipakai untuk personalisasi tampilan dan rekomendasi belajar.</p>
      </div>

      <div className="rounded-3xl bg-white/90 p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
            <User size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black">{appData.profile.name}</h3>
            <p className="text-sm text-slate-500">{appData.profile.role}</p>
          </div>
        </div>

        <form onSubmit={save} className="grid gap-4">
          <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Peran" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input label="Target Belajar" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit"><Save size={16} /> Simpan Profil</Button>
            <Button type="button" variant="danger" onClick={onResetData}>Reset Data Aplikasi</Button>
          </div>
        </form>
        {message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">{message}</p>}
      </div>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-black text-slate-600">{label}</label>
      <input className="input" {...props} />
    </div>
  )
}
