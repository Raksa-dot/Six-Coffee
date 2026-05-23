import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import { defaultFocusSessions, defaultMood, defaultMoodLogs, defaultProfile, defaultTasks } from "../data/initialData"
import { enrichTasks, getDeadlineWarnings } from "../lib/mindmateAI"
import { clearMindMateState, loadMindMateState, saveMindMateState } from "../lib/storage"
import Analitik from "./Analitik"
import AsistenAI from "./AsistenAI"
import Beranda from "./Beranda"
import CheckInMood from "./CheckInMood"
import Jadwal from "./Jadwal"
import Profil from "./Profil"
import RencanaAI from "./RencanaAI"
import TugasSaya from "./TugasSaya"

const initialState = {
  profile: defaultProfile,
  tasks: defaultTasks,
  mood: defaultMood,
  moodLogs: defaultMoodLogs,
  focusSessions: defaultFocusSessions,
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState("Beranda")
  const [notice, setNotice] = useState("")
  const [state, setState] = useState(() => loadMindMateState() || initialState)

  useEffect(() => {
    saveMindMateState(state)
  }, [state])

  const appData = useMemo(() => {
    return {
      ...state,
      enrichedTasks: enrichTasks(state.tasks, state.mood),
      deadlineWarnings: getDeadlineWarnings(state.tasks),
    }
  }, [state])

  function navigatePage(page) {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function addTask(task) {
    setState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          status: "Belum Selesai",
          createdAt: new Date().toISOString(),
        },
      ],
    }))
    setNotice("Tugas baru berhasil ditambahkan. Deadline otomatis muncul di fitur Jadwal.")
  }

  function updateTask(id, changes) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task

        const nextTask = { ...task, ...changes, updatedAt: new Date().toISOString() }

        if (changes.status === "Selesai" && task.status !== "Selesai") {
          nextTask.completedAt = new Date().toISOString()
        }

        if (changes.status === "Belum Selesai") {
          delete nextTask.completedAt
        }

        return nextTask
      }),
    }))

    if (changes.status === "Selesai") {
      setNotice("Tugas selesai. Progres langsung masuk ke Analitik.")
    } else if (changes.status === "Belum Selesai") {
      setNotice("Status tugas dikembalikan. Progres Analitik ikut diperbarui.")
    } else {
      setNotice("Data tugas berhasil diperbarui dan Jadwal ikut diperbarui.")
    }
  }

  function deleteTask(id) {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }))
    setNotice("Tugas berhasil dihapus dari daftar dan jadwal.")
  }

  function saveMood(mood) {
    const date = new Date().toLocaleDateString("id-ID", { weekday: "long" })
    setState((prev) => ({
      ...prev,
      mood: { ...mood, updatedAt: new Date().toISOString() },
      moodLogs: [...prev.moodLogs, { ...mood, id: crypto.randomUUID(), date }],
    }))
    setNotice("Mood tersimpan. AI akan menyesuaikan rekomendasi belajar dan detail jadwal.")
  }

  function saveProfile(profile) {
    setState((prev) => ({ ...prev, profile }))
    setNotice("Profil berhasil disimpan.")
  }

  function resetData() {
    clearMindMateState()
    setState(initialState)
    setNotice("Data aplikasi berhasil di-reset ke contoh awal.")
  }

  function showDeadlineNotification() {
    const warnings = getDeadlineWarnings(state.tasks)

    if (!warnings.length) {
      setNotice("Tidak ada deadline yang hampir tiba. Jadwal kamu masih aman.")
      return
    }

    setNotice(
      `Alarm deadline: ${warnings.map((task) => `${task.title} - ${task.deadlineStatus.label}`).join(" | ")}`
    )
    navigatePage("Jadwal")
  }

  function logout() {
    navigate("/login")
  }

  const pageProps = {
    appData,
    onNavigate: navigatePage,
    onAddTask: addTask,
    onUpdateTask: updateTask,
    onDeleteTask: deleteTask,
    onSaveMood: saveMood,
    onSaveProfile: saveProfile,
    onResetData: resetData,
    onSetNotice: setNotice,
  }

  return (
    <div className="min-h-screen bg-[#f5f1ff] text-slate-950">
      <Sidebar activePage={activePage} onNavigate={navigatePage} onLogout={logout} />

      <main className="min-h-screen pl-[260px]">
        <Header
          profile={state.profile}
          currentPage={activePage}
          onOpenAI={() => navigatePage("Asisten AI")}
          onNotify={showDeadlineNotification}
          notificationCount={appData.deadlineWarnings.length}
        />

        <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-violet-100 via-white to-sky-100 px-6 py-8">
          <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-300/40 blur-3xl" />

          <div className="relative z-10">
            {notice && (
              <div className="mx-auto mb-5 flex max-w-6xl items-center justify-between rounded-2xl border border-violet-100 bg-white/90 p-4 text-sm font-bold text-slate-700 shadow-sm">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} className="font-black text-violet-600">Tutup</button>
              </div>
            )}

            {activePage === "Beranda" && <Beranda {...pageProps} />}
            {activePage === "Tugas Saya" && <TugasSaya {...pageProps} />}
            {activePage === "Check-In Mood" && <CheckInMood {...pageProps} />}
            {activePage === "Rencana AI" && <RencanaAI {...pageProps} />}
            {activePage === "Jadwal" && <Jadwal {...pageProps} />}
            {activePage === "Analitik" && <Analitik {...pageProps} />}
            {activePage === "Asisten AI" && <AsistenAI {...pageProps} />}
            {activePage === "Profil" && <Profil {...pageProps} />}
          </div>
        </section>
      </main>
    </div>
  )
}
