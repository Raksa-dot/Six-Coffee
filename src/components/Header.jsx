import { Bell, Bot, Search } from "lucide-react"
import Button from "./Button"

export default function Header({ profile, currentPage, onOpenAI, onNotify, notificationCount = 0 }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-violet-100 bg-white/80 px-6 backdrop-blur-xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">MindMate AI</p>
        <h1 className="text-lg font-black text-slate-950">{currentPage}</h1>
      </div>

      <div className="hidden w-[320px] items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-2 text-sm text-slate-500 md:flex">
        <Search size={16} />
        <span>Cari tugas, deadline, jadwal, atau analitik...</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={onOpenAI} className="hidden md:inline-flex">
          <Bot size={16} />
          Tanya AI
        </Button>
        <button onClick={onNotify} className="relative rounded-full border border-violet-100 bg-white p-3 text-slate-600 shadow-sm hover:bg-violet-50">
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 rounded-full border border-violet-100 bg-white px-3 py-2 shadow-sm">
          <span className="text-xs font-bold text-slate-700">Halo, {profile.name}</span>
          <img src={profile.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
        </div>
      </div>
    </header>
  )
}
