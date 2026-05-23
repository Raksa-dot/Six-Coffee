import { useState } from "react"
import { CalendarDays, Clock, GraduationCap, ListChecks, Smile, Target } from "lucide-react"
import { dataMataKuliahInformatika } from "../data/dataTugas"

function tanggalHariIni() {
  return new Date().toISOString().slice(0, 10)
}

function FieldWrapper({ label, hint, icon: Icon, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700">
          {Icon && <Icon size={13} className="text-violet-600" />}
          {label}
        </span>
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>}
    </label>
  )
}

function FormTugas({ tambahTugas }) {
  const [form, setForm] = useState({
    nama: "",
    mataKuliah: "",
    deadline: tanggalHariIni(),
    kesulitan: "sedang",
    mood: "normal",
    estimasi: "1 jam",
    status: "belum mulai",
  })

  function ubahForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function kirimForm(e) {
    e.preventDefault()

    if (!form.nama.trim() || !form.mataKuliah.trim() || !form.deadline) {
      alert("Nama tugas, mata kuliah, dan deadline wajib diisi.")
      return
    }

    tambahTugas({
      id: Date.now(),
      ...form,
    })

    setForm({
      nama: "",
      mataKuliah: "",
      deadline: tanggalHariIni(),
      kesulitan: "sedang",
      mood: "normal",
      estimasi: "1 jam",
      status: "belum mulai",
    })
  }

  const inputClass = "min-w-0 rounded-2xl border border-violet-100 bg-white/95 px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:px-4"
  const selectClass = "min-w-0 rounded-2xl border border-violet-100 bg-white/95 px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"

  return (
    <section className="mindmate-soft-card rounded-3xl p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-violet-100/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black leading-tight text-slate-950">
            Tambah Tugas Teknik Informatika
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
            Isi data tugas dengan lengkap agar otomatis masuk ke Jadwal, Analitik, Alarm Deadline, dan Rencana AI.
          </p>
        </div>

        <div className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700 ring-1 ring-violet-100">
          Form Tugas
        </div>
      </div>

      <form onSubmit={kirimForm} className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <FieldWrapper
            label="Nama Tugas"
            hint="Contoh: Implementasi CRUD Laravel, Desain ERD, atau Latihan Sorting."
            icon={Target}
          >
            <input
              name="nama"
              value={form.nama}
              onChange={ubahForm}
              placeholder="Contoh: Implementasi login Laravel"
              className={inputClass}
            />
          </FieldWrapper>

          <FieldWrapper
            label="Mata Kuliah"
            hint="Pilih mata kuliah yang sesuai dengan jurusan Teknik Informatika."
            icon={GraduationCap}
          >
            <select
              name="mataKuliah"
              value={form.mataKuliah}
              onChange={ubahForm}
              className={selectClass}
            >
              <option value="">Pilih mata kuliah Teknik Informatika</option>
              {dataMataKuliahInformatika.map((mataKuliah) => (
                <option key={mataKuliah} value={mataKuliah}>
                  {mataKuliah}
                </option>
              ))}
            </select>
          </FieldWrapper>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <FieldWrapper label="Deadline" hint="Tanggal tugas dikumpulkan." icon={CalendarDays}>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={ubahForm}
              className={selectClass}
            />
          </FieldWrapper>

          <FieldWrapper label="Kesulitan" hint="Tingkat beban tugas." icon={ListChecks}>
            <select name="kesulitan" value={form.kesulitan} onChange={ubahForm} className={selectClass}>
              <option value="mudah">Mudah</option>
              <option value="sedang">Sedang</option>
              <option value="sulit">Sulit</option>
            </select>
          </FieldWrapper>

          <FieldWrapper label="Mood" hint="Kondisi saat mengerjakan." icon={Smile}>
            <select name="mood" value={form.mood} onChange={ubahForm} className={selectClass}>
              <option value="semangat">Semangat</option>
              <option value="normal">Normal</option>
              <option value="biasa">Biasa</option>
              <option value="capek">Capek</option>
              <option value="stres">Stres</option>
            </select>
          </FieldWrapper>

          <FieldWrapper label="Estimasi" hint="Perkiraan waktu pengerjaan." icon={Clock}>
            <select name="estimasi" value={form.estimasi} onChange={ubahForm} className={selectClass}>
              <option value="30 menit">30 menit</option>
              <option value="1 jam">1 jam</option>
              <option value="2 jam">2 jam</option>
              <option value="3 jam">3 jam</option>
            </select>
          </FieldWrapper>

          <FieldWrapper label="Status" hint="Progress awal tugas." icon={ListChecks}>
            <select name="status" value={form.status} onChange={ubahForm} className={selectClass}>
              <option value="belum mulai">Belum mulai</option>
              <option value="sedang dikerjakan">Sedang dikerjakan</option>
              <option value="hampir selesai">Hampir selesai</option>
            </select>
          </FieldWrapper>
        </div>

        <button className="mindmate-button rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-extrabold text-white hover:bg-violet-700 active:scale-[0.98]">
          Tambah ke Jadwal
        </button>
      </form>
    </section>
  )
}

export default FormTugas
