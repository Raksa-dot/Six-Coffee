export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200",
    secondary: "bg-white text-slate-700 border border-violet-100 hover:bg-violet-50",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    ghost: "bg-transparent text-slate-600 hover:bg-violet-50",
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
