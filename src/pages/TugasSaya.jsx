import { ArrowUpDown, Check, Filter, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import Button from "../components/Button"
import Modal from "../components/Modal"

export default function TugasSaya({ appData, onAddTask, onUpdateTask, onDeleteTask }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("Semua")
  const [sort, setSort] = useState("Skor AI")

  const tasks = useMemo(() => {
    let result = [...appData.enrichedTasks]
    if (filter !== "Semua") result = result.filter((task) => task.status === filter)
    if (sort === "Deadline") result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    if (sort === "Kesulitan") result.sort((a, b) => ["Mudah", "Sedang", "Sulit"].indexOf(b.difficulty) - ["Mudah", "Sedang", "Sulit"].indexOf(a.difficulty))
    return result
  }, [appData.enrichedTasks, filter, sort])

  function cycleFilter() {
    setFilter((current) => current === "Semua" ? "Belum Selesai" : current === "Belum Selesai" ? "Selesai" : "Semua")
  }

  function cycleSort() {
    setSort((current) => current === "Skor AI" ? "Deadline" : current === "Deadline" ? "Kesulitan" : "Skor AI")
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Tugas Saya</p>
          <h2 className="text-3xl font-black">Kelola tugas dengan skor prioritas AI</h2>
          <p className="mt-2 text-sm text-slate-500">AI menghitung prioritas dari deadline, kesulitan, mood, dan energi.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={cycleFilter}><Filter size={16} /> Filter: {filter}</Button>
          <Button variant="secondary" onClick={cycleSort}><ArrowUpDown size={16} /> Urut: {sort}</Button>
          <Button onClick={() => setShowForm(true)}><Plus size={16} /> Tambah Tugas</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black">{task.title}</h3>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">Skor AI {task.aiScore}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${task.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{task.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {task.subject} • Deadline {task.deadline} • {task.difficulty} • {task.estimatedMinutes} menit
                  {task.completedAt ? ` • Selesai ${new Date(task.completedAt).toLocaleDateString("id-ID")}` : ""}
                </p>
                <p className="mt-2 text-sm italic text-slate-600">{task.aiReason}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => onUpdateTask(task.id, { status: task.status === "Selesai" ? "Belum Selesai" : "Selesai" })}>
                  <Check size={16} /> {task.status === "Selesai" ? "Batal" : "Done Progress"}
                </Button>
                <Button variant="danger" onClick={() => onDeleteTask(task.id)}><Trash2 size={16} /> Hapus</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSave={onAddTask} />}
    </div>
  )
}

function TaskForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    deadline: new Date().toISOString().slice(0, 10),
    difficulty: "Sedang",
    estimatedMinutes: 60,
  })

  function submit(event) {
    event.preventDefault()
    onSave({ ...form, estimatedMinutes: Number(form.estimatedMinutes) })
    onClose()
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Modal title="Tambah Tugas Baru" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <Input label="Nama Tugas" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Contoh: Laporan Basis Data" />
        <Input label="Mata Kuliah" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Contoh: Basis Data" />
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
          <div>
            <label className="mb-1 block text-xs font-black text-slate-600">Kesulitan</label>
            <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="input">
              <option>Mudah</option>
              <option>Sedang</option>
              <option>Sulit</option>
            </select>
          </div>
          <Input label="Estimasi Menit" type="number" value={form.estimatedMinutes} onChange={(e) => update("estimatedMinutes", e.target.value)} />
        </div>
        <Button type="submit" className="mt-2">Simpan Tugas</Button>
      </form>
    </Modal>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-black text-slate-600">{label}</label>
      <input required className="input" {...props} />
    </div>
  )
}
