import { AlarmClock, BellRing, CalendarClock, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import Button from "../components/Button"
import { getDeadlineStatus, getDeadlineWarnings } from "../lib/mindmateAI"

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function buildCalendar(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const mondayIndex = (firstDay.getDay() + 6) % 7
  const days = []

  for (let i = 0; i < mondayIndex; i++) {
    days.push(null)
  }

  for (let date = 1; date <= lastDay.getDate(); date++) {
    days.push(new Date(year, month, date))
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

function toneClass(tone) {
  if (tone === "red") return "bg-red-100 text-red-700 border-red-200"
  if (tone === "amber") return "bg-amber-100 text-amber-700 border-amber-200"
  if (tone === "green") return "bg-emerald-100 text-emerald-700 border-emerald-200"
  if (tone === "violet") return "bg-violet-100 text-violet-700 border-violet-200"
  return "bg-slate-100 text-slate-600 border-slate-200"
}

export default function Jadwal({ appData, onNavigate, onSetNotice }) {
  const [monthDate, setMonthDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()))
  const [alarmInfo, setAlarmInfo] = useState("")
  const warnings = useMemo(() => getDeadlineWarnings(appData.tasks), [appData.tasks])
  const calendarDays = useMemo(() => buildCalendar(monthDate), [monthDate])

  const tasksByDate = useMemo(() => {
    return appData.enrichedTasks.reduce((acc, task) => {
      acc[task.deadline] = acc[task.deadline] || []
      acc[task.deadline].push(task)
      return acc
    }, {})
  }, [appData.enrichedTasks])

  const selectedTasks = tasksByDate[selectedDate] || []

  function changeMonth(offset) {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
  }

  async function activateAlarm() {
    if (!warnings.length) {
      setAlarmInfo("Tidak ada deadline yang hampir tiba. Jadwal masih aman.")
      onSetNotice?.("Tidak ada alarm deadline aktif hari ini.")
      return
    }

    const message = `Alarm deadline: ${warnings.map((task) => `${task.title} (${task.deadlineStatus.label})`).join(", ")}`
    setAlarmInfo(message)
    onSetNotice?.(message)

    if (!("Notification" in window)) {
      setAlarmInfo(`${message}. Browser kamu belum mendukung notifikasi desktop.`)
      return
    }

    let permission = Notification.permission
    if (permission !== "granted") {
      permission = await Notification.requestPermission()
    }

    if (permission === "granted") {
      new Notification("MindMate AI - Alarm Deadline", {
        body: message,
      })
      setAlarmInfo("Alarm browser aktif. Notifikasi deadline berhasil dikirim.")
    } else {
      setAlarmInfo("Izin notifikasi belum diberikan. Alarm tetap tampil di dalam aplikasi.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-violet-600">Jadwal Deadline</p>
          <h2 className="text-3xl font-black">Kalender tugas dan alarm deadline</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Setiap tugas yang ditambahkan dari fitur Tugas Saya otomatis muncul di tanggal deadline. Klik tanggal untuk melihat detail tugas, tingkat kesulitan, mood, energi, dan status alarm.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => onNavigate("Tugas Saya")}>Tambah Deadline</Button>
          <Button onClick={activateAlarm}><BellRing size={16} /> Aktifkan Alarm</Button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="mb-5 rounded-3xl border border-red-100 bg-red-50 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-red-700">
            <AlarmClock size={20} />
            <h3 className="font-black">Alarm Deadline Hampir Tiba</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {warnings.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedDate(task.deadline)}
                className="rounded-2xl border border-red-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-black text-slate-900">{task.title}</p>
                <p className="mt-1 text-sm text-red-600">{task.deadlineStatus.text}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Deadline: {task.deadline} • Kesulitan: {task.difficulty}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {alarmInfo && (
        <div className="mb-5 rounded-2xl border border-violet-100 bg-white/90 p-4 text-sm font-bold text-slate-700 shadow-sm">
          {alarmInfo}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-sm lg:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <button onClick={() => changeMonth(-1)} className="rounded-xl border border-violet-100 bg-white p-3 text-violet-700 hover:bg-violet-50">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-black">{monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}</h3>
              <p className="text-xs font-bold text-slate-400">Klik tanggal untuk melihat detail deadline</p>
            </div>
            <button onClick={() => changeMonth(1)} className="rounded-xl border border-violet-100 bg-white p-3 text-violet-700 hover:bg-violet-50">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="rounded-xl bg-violet-50 py-3 text-center text-xs font-black text-violet-700">
                {day}
              </div>
            ))}

            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="min-h-[105px] rounded-2xl border border-dashed border-violet-50 bg-white/40" />

              const iso = toISODate(date)
              const dayTasks = tasksByDate[iso] || []
              const isToday = iso === toISODate(new Date())
              const isSelected = iso === selectedDate
              const dangerCount = dayTasks.filter((task) => getDeadlineStatus(task).remainingDays <= 1 && task.status !== "Selesai").length

              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={`min-h-[105px] rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-violet-400 bg-violet-100 shadow-md"
                      : isToday
                      ? "border-sky-200 bg-sky-50"
                      : "border-violet-100 bg-white/85"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{date.getDate()}</span>
                    {dayTasks.length > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${dangerCount ? "bg-red-500 text-white" : "bg-violet-600 text-white"}`}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="truncate rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && <p className="text-[11px] font-bold text-violet-600">+{dayTasks.length - 2} tugas</p>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
              <CalendarClock size={22} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-200">Tanggal Dipilih</p>
            <h3 className="mt-2 text-2xl font-black">{selectedDate}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Mood saat ini: <b>{appData.mood.mood}</b> • Energi: <b>{appData.mood.energy}</b>
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-violet-600" size={18} />
              <h3 className="text-lg font-black">Detail Tugas</h3>
            </div>

            {selectedTasks.length === 0 ? (
              <div className="rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-slate-600">
                Tidak ada deadline pada tanggal ini. Tambahkan tugas baru dari fitur Tugas Saya agar muncul di kalender.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTasks.map((task) => {
                  const status = getDeadlineStatus(task)
                  return (
                    <div key={task.id} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-black text-slate-900">{task.title}</h4>
                          <p className="text-xs font-bold text-slate-500">{task.subject}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${toneClass(status.tone)}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-slate-600">
                        <Info label="Deadline" value={task.deadline} />
                        <Info label="Kesulitan" value={task.difficulty} />
                        <Info label="Mood" value={appData.mood.mood} />
                        <Info label="Energi" value={appData.mood.energy} />
                        <Info label="Skor AI" value={`${task.aiScore}/100`} />
                      </div>

                      <p className="mt-3 rounded-xl bg-violet-50 p-3 text-xs font-bold leading-5 text-slate-600">
                        {status.text}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="text-violet-600" size={18} />
              <h3 className="font-black">Saran AI</h3>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Kerjakan tugas dengan label <b>Deadline Hari Ini</b> atau <b>Hampir Tiba</b> terlebih dahulu. Jika energi rendah, pecah tugas menjadi sesi pendek 15-20 menit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <span className="text-xs font-black text-slate-800">{value}</span>
    </div>
  )
}
