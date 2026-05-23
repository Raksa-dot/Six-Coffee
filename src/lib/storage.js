const STORAGE_KEY = "mindmate-ai-state-v2"

export function loadMindMateState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn("Gagal membaca localStorage", error)
    return null
  }
}

export function saveMindMateState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn("Gagal menyimpan localStorage", error)
  }
}

export function clearMindMateState() {
  localStorage.removeItem(STORAGE_KEY)
}
