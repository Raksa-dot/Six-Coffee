import { Link, useNavigate } from "react-router-dom"
import { Brain, Lock, Mail } from "lucide-react"
import Button from "../components/Button"

export default function Login() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate("/dashboard")
  }

  return (
    <AuthLayout title="Masuk Akun" desc="Masuk untuk melanjutkan ke dashboard MindMate AI.">
      <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
        <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="Masukkan email" />
        <Input icon={<Lock size={17} />} label="Password" type="password" placeholder="Masukkan password" />
        <Button type="submit" className="mt-2 py-3">Masuk</Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">
        Belum punya akun? <Link to="/daftar" className="font-black text-violet-600">Daftar</Link>
      </p>
    </AuthLayout>
  )
}

export function AuthLayout({ title, desc, children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#eee9ff] via-[#fbf8ff] to-[#dff8ff] px-4 py-10">
      <div className="absolute bottom-[-120px] right-[-70px] h-96 w-96 rounded-full bg-cyan-300/60 blur-3xl" />
      <div className="absolute right-[22%] top-[12%] h-60 w-60 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-xl shadow-violet-100/70 ring-1 ring-violet-100 backdrop-blur">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <Brain size={18} />
          </div>
          <span className="text-lg font-black text-violet-700">MindMate AI</span>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500">{desc}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Input({ icon, label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3 text-violet-500">
        {icon}
        <input required className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" {...props} />
      </div>
    </div>
  )
}
