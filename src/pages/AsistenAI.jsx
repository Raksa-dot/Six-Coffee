import { Bot, CalendarClock, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import Button from "../components/Button"
import { answerMindMateQuestion } from "../lib/mindmateAI"

const quickQuestions = [
  "Apa tugas paling prioritas?",
  "Deadline mana yang hampir tiba?",
  "Buatkan rencana belajar hari ini",
  "Bagaimana progres analitik saya?",
  "Jelaskan semua fitur MindMate",
]

export default function AsistenAI({ appData, onNavigate }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Halo! Saya Asisten AI MindMate. Saya memahami data tugas, deadline, jadwal, mood, rencana belajar, dan analitik kamu.",
    },
  ])

  function ask(question = input) {
    if (!question.trim()) return
    const answer = answerMindMateQuestion(question, appData)
    setMessages((prev) => [...prev, { role: "user", text: question }, { role: "ai", text: answer }])
    setInput("")
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Asisten AI</p>
        <h2 className="text-3xl font-black">AI sebagai fitur utama MindMate</h2>
        <p className="mt-2 text-sm text-slate-500">AI membaca struktur fitur dan membantu user mengambil keputusan belajar.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950 p-6 text-white lg:col-span-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
            <Bot size={22} />
          </div>
          <h3 className="text-xl font-black">Yang dipahami AI</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <Info text="Data tugas dan deadline" />
            <Info text="Mood dan energi user" />
            <Info text="Rencana belajar otomatis" />
            <Info text="Jadwal dan alarm deadline" />
            <Info text="Analitik produktivitas" />
          </div>
          <Button onClick={() => onNavigate("Jadwal")} className="mt-5 w-full">
            <CalendarClock size={16} /> Buka Jadwal
          </Button>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button key={question} onClick={() => ask(question)} className="rounded-full bg-violet-100 px-3 py-2 text-xs font-black text-violet-700 hover:bg-violet-200">
                {question}
              </button>
            ))}
          </div>

          <div className="h-[420px] overflow-y-auto rounded-2xl bg-violet-50/60 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-violet-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); ask() }} className="mt-4 flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="input" placeholder="Tanyakan ke AI, contoh: deadline mana yang hampir tiba?" />
            <Button type="submit"><Send size={16} /> Kirim</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Info({ text }) {
  return <p className="rounded-xl bg-white/10 px-3 py-2 font-bold">• {text}</p>
}
