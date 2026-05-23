import {
  BarChart3,
  Bot,
  CalendarClock,
  CalendarCheck,
  CheckCircle2,
  Home,
  LogOut,
  Smile,
  User,
  Zap,
} from "lucide-react"

const menus = [
  { name: "Beranda", icon: Home },
  { name: "Tugas Saya", icon: CheckCircle2 },
  { name: "Check-In Mood", icon: Smile },
  { name: "Rencana AI", icon: CalendarCheck },
  { name: "Jadwal", icon: CalendarClock },
  { name: "Analitik", icon: BarChart3 },
  { name: "Asisten AI", icon: Bot },
  { name: "Profil", icon: User },
]

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-violet-100 bg-white p-5 shadow-[20px_0_60px_rgba(124,58,237,0.08)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-lg font-black text-violet-700">MindMate AI</h1>
          <p className="text-xs font-bold text-slate-400">Smart Study Schedule</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon
          const active = activePage === menu.name
          return (
            <button
              key={menu.name}
              onClick={() => onNavigate(menu.name)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black transition ${
                active
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <Icon size={17} />
              {menu.name}
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => onNavigate("Jadwal")}
        className="mt-auto rounded-2xl bg-violet-600 p-4 text-left text-white shadow-xl shadow-violet-200 transition hover:bg-violet-700"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-violet-100">Cek deadline?</p>
            <p className="mt-1 text-sm font-black">Buka Jadwal</p>
          </div>
          <Zap size={18} />
        </div>
      </button>

      <button
        onClick={onLogout}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-violet-100 bg-white py-3 text-sm font-black text-slate-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={16} />
        Keluar
      </button>
    </aside>
  )
}
