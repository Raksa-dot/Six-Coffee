import { Link, useNavigate } from "react-router-dom"
import { Lock, Mail, User } from "lucide-react"
import Button from "../components/Button"
import { AuthLayout, Input } from "./Login"

export default function Register() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate("/dashboard")
  }

  return (
    <AuthLayout title="Daftar Akun Baru" desc="Mulai perjalanan belajarmu yang lebih terarah dengan MindMate AI.">
      <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
        <Input icon={<User size={17} />} label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap" />
        <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="Masukkan email" />
        <Input icon={<Lock size={17} />} label="Password" type="password" placeholder="Buat password" />
        <Button type="submit" className="mt-2 py-3">Daftar Sekarang</Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">
        Sudah punya akun? <Link to="/login" className="font-black text-violet-600">Masuk</Link>
      </p>
    </AuthLayout>
  )
}
