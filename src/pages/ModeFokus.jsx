import { Pause, Play, RotateCcw, Timer, Trophy } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import Button from "../components/Button"
import { getFocusDuration } from "../lib/mindmateAI"

export default function ModeFokus({ appData, onAddFocusSession, onUpdateTask }) {
  const activeTasks = appData.enrichedTasks.filter((task) => task.status !== "Selesai")
  const defaultTask = activeTasks[0]
  const recommendedMinutes = getFocusDuration(appData.mood)
  const [selectedTaskId, setSelectedTaskId] = useState(defaultTask?.id || "")
  const [seconds, setSeconds] = useState(recommendedMinutes * 60)
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState("")

  const selectedTask = useMemo(() => appData.tasks.find((task) => task.id === selectedTaskId) || defaultTask, [appData.tasks, selectedTaskId, defaultTask])

  useEffect(() => {
    if (!running || seconds <= 0) return
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [running, seconds])

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false)
      finishSession()
    }
  }, [seconds, running])

  function resetTimer() {
    setRunning(false)
    setSeconds(recommendedMinutes * 60)
    setMessage("Timer diatur ulang sesuai rekomendasi AI.")
  }

  function finishSession() {
    const usedMinutes = Math.max(1, Math.round((recommendedMinutes * 60 - seconds) / 60))
    onAddFocusSession({
      taskTitle: selectedTask?.title || "Sesi Fokus Mandiri",
      minutes: usedMinutes,
    })
    if (selectedTask) onUpdateTask(selectedTask.id, { status: "Selesai" })
    setRunning(false)
    setSeconds(recommendedMinutes * 60)
    setMessage(`Sesi fokus ${usedMinutes} menit tersimpan ke Analitik.`)
  }

  const minute = Math.floor(seconds / 60)
  const second = seconds % 60

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Mode Fokus</p>
        <h2 className="text-3xl font-black">Timer fokus yang menyesuaikan mood</h2>
        <p className="mt-2 text-sm text-slate-500">AI menyarankan durasi {recommendedMinutes} menit karena mood kamu {appData.mood.mood} dan energi {appData.mood.energy}.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-sm lg:col-span-2">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Timer size={34} />
          </div>
          <div className="mx-auto max-w-sm rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-slate-400">Timer Fokus</p>
            <h1 className="text-6xl font-black tabular-nums">{String(minute).padStart(2, "0")}:{String(second).padStart(2, "0")}</h1>
            <div className="mt-7 grid gap-3">
              <Button onClick={() => setRunning((prev) => !prev)} className="w-full">
                {running ? <Pause size={16} /> : <Play size={16} />} {running ? "Pause" : "Mulai Fokus"}
              </Button>
              <Button variant="secondary" onClick={resetTimer} className="w-full"><RotateCcw size={16} /> Reset</Button>
              <Button variant="dark" onClick={finishSession} className="w-full"><Trophy size={16} /> Selesai</Button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-white/90 p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-black">Tugas Fokus</h3>
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="input">
              {activeTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
              <option value="">Sesi Fokus Mandiri</option>
            </select>
            <p className="mt-3 text-sm leading-6 text-slate-500">Setelah sesi selesai, data akan masuk ke Analitik dan tugas bisa otomatis ditandai selesai.</p>
          </div>
          {message && <div className="rounded-3xl bg-violet-600 p-5 text-sm font-bold leading-6 text-white shadow-lg shadow-violet-200">{message}</div>}
        </div>
      </div>
    </div>
  )
}
