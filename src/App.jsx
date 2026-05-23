import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"

import HalamanAwal from "./halaman/HalamanAwal.jsx"
import DaftarAkun from "./halaman/DaftarAkun.jsx"
import Login from "./halaman/Login.jsx"
import Dashboard from "./halaman/Dashboard.jsx"

const DEFAULT_USER = {
  nama: "User MindMate",
  email: "user@mindmate.ai",
}

function ambilUserTersimpan() {
  try {
    const data = localStorage.getItem("mindmateUser")
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function App() {
  const [user, setUser] = useState(() => ambilUserTersimpan())

  useEffect(() => {
    if (user) {
      localStorage.setItem("mindmateUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("mindmateUser")
    }
  }, [user])

  function handleMasuk(dataUser = DEFAULT_USER) {
    setUser(dataUser)
  }

  function handleKeluar() {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HalamanAwal />} />
        <Route
          path="/daftar"
          element={user ? <Navigate to="/dashboard" replace /> : <DaftarAkun onDaftar={handleMasuk} />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleMasuk} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onKeluar={handleKeluar} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
