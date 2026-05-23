export default function StatCard({ icon, title, value, desc, color = "text-violet-600" }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
        {icon}
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
      {desc && <p className="mt-1 text-xs text-slate-500">{desc}</p>}
    </div>
  )
}
