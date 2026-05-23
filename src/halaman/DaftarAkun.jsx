import { Link, useNavigate } from "react-router-dom"
import { Brain, Lock, Mail, User } from "lucide-react"
import { useState } from "react"

export default function DaftarAkun({ onDaftar }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: "", email: "", password: "" })

  function ubahForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleDaftar(event) {
    event.preventDefault()

    if (!form.nama.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Nama, email, dan password wajib diisi.")
      return
    }

    onDaftar({
      nama: form.nama,
      email: form.email,
    })
    navigate("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f1e7ff] via-[#fbf8ff] to-[#dcfaff] px-4 py-10">
      <div className="absolute left-[8%] top-[40%] hidden h-40 w-40 -translate-y-1/2 rounded-full border border-violet-300/40 md:block" />
      <div className="absolute left-[5%] top-[40%] hidden h-56 w-56 -translate-y-1/2 rounded-full border border-dashed border-violet-300/50 md:block" />
      <div className="absolute bottom-[-120px] right-[-70px] h-96 w-96 rounded-full bg-cyan-300/60 blur-3xl" />
      <div className="absolute right-[22%] top-[12%] h-60 w-60 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mindmate-card rounded-3xl p-7 sm:p-8 backdrop-blur">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-200">
            <Brain size={18} />
          </div>
          <span className="text-lg font-black text-violet-700">MindMate</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Daftar Akun Baru</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500">
            Mulai perjalanan belajarmu yang lebih terarah dengan MindMate AI.
          </p>
        </div>

        <form onSubmit={handleDaftar} className="mt-7 grid gap-4">
          <Input name="nama" value={form.nama} onChange={ubahForm} icon={<User size={17} />} label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap" />
          <Input name="email" value={form.email} onChange={ubahForm} icon={<Mail size={17} />} label="Email" type="email" placeholder="Masukkan email" />
          <Input name="password" value={form.password} onChange={ubahForm} icon={<Lock size={17} />} label="Password" type="password" placeholder="Buat password" />

          <button type="submit" className="mt-2 rounded-2xl bg-violet-600 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-black text-violet-700 transition hover:text-violet-700 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}

function Input({ icon, label, type, placeholder, name, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-violet-500 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
        {icon}
        <input required name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
      </div>
    </div>
  )
}
