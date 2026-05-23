import http from "node:http"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const PORT = Number(process.env.PORT || 8787)
const OPENAI_URL = "https://api.openai.com/v1/responses"

function loadEnvFile() {
  const envPath = join(process.cwd(), ".env")
  if (!existsSync(envPath)) return

  const content = readFileSync(envPath, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const clean = line.trim()
    if (!clean || clean.startsWith("#") || !clean.includes("=")) continue
    const [key, ...rest] = clean.split("=")
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "")
    if (!process.env[key.trim()]) process.env[key.trim()] = value
  }
}

loadEnvFile()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini"

function kirimJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })
  res.end(JSON.stringify(data))
}

function bacaBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
      if (body.length > 1_000_000) {
        reject(new Error("Data terlalu besar"))
        req.destroy()
      }
    })
    req.on("end", () => resolve(body))
    req.on("error", reject)
  })
}

function sisaHari(deadline) {
  if (!deadline) return 99
  const hariIni = new Date()
  const target = new Date(`${deadline}T00:00:00`)
  const mulaiHariIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())
  return Math.ceil((target - mulaiHariIni) / (1000 * 60 * 60 * 24))
}

function labelDeadline(deadline) {
  const hari = sisaHari(deadline)
  if (hari < 0) return "deadline sudah lewat"
  if (hari === 0) return "deadline hari ini"
  if (hari === 1) return "deadline besok"
  return `${hari} hari lagi`
}

function buatRencanaLokal(payload, alasan = "Mode demo lokal aktif karena API key belum tersedia atau API gagal dihubungi.") {
  const tugas = payload?.tugasAktif || payload?.daftarTugas?.[0] || {
    nama: "Tugas utama",
    mataKuliah: "Pelajaran",
    deadline: "-",
    kesulitan: "sedang",
    estimasi: "1 jam",
    mood: "normal",
  }

  const sulit = tugas.kesulitan === "sulit"
  const energiRendah = payload?.energi === "rendah" || payload?.mood === "capek" || payload?.mood === "stres"
  const durasi = energiRendah ? "25 menit" : sulit ? "45 menit" : "35 menit"

  return {
    sumber: "demo-lokal",
    model: "aturan-lokal",
    catatan: alasan,
    judul: `Rencana belajar untuk ${tugas.nama}`,
    ringkasan: `${tugas.nama} sebaiknya dikerjakan lebih dulu karena ${labelDeadline(tugas.deadline)} dan tingkat kesulitannya ${tugas.kesulitan}.`,
    prioritas: tugas.nama,
    alasanPrioritas: [
      `Deadline: ${tugas.deadline || "belum diisi"} (${labelDeadline(tugas.deadline)})`,
      `Tingkat kesulitan: ${tugas.kesulitan || "sedang"}`,
      `Mood tugas: ${tugas.mood || "normal"}`,
    ],
    langkah: [
      `Baca ulang instruksi ${tugas.nama}, identifikasi kebutuhan fitur, data, atau algoritma yang diperlukan.`,
      `Kerjakan bagian inti selama ${durasi}, misalnya coding, rancangan database, debugging, atau analisis algoritma.`,
      "Istirahat 5-10 menit, lalu lanjutkan revisi kecil.",
      "Simpan hasil pengerjaan, commit/catat progres, lalu tandai status tugas di aplikasi.",
    ],
    jadwalHariIni: [
      { waktu: "Sesi 1", kegiatan: `Mulai ${tugas.nama}`, durasi },
      { waktu: "Sesi 2", kegiatan: "Review hasil dan catat kekurangan", durasi: "20 menit" },
      { waktu: "Sesi 3", kegiatan: "Finishing dan cek deadline", durasi: "15 menit" },
    ],
    tipsMood: energiRendah
      ? "Karena mood/energi sedang rendah, mulai dari langkah kecil agar tidak terasa berat."
      : "Karena kondisi cukup baik, mulai dari bagian yang paling sulit terlebih dahulu.",
  }
}

function ambilTextResponsOpenAI(data) {
  if (typeof data?.output_text === "string") return data.output_text

  const teks = []
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") teks.push(content.text)
    }
  }
  return teks.join("\n").trim()
}

function parseJsonDariModel(teks) {
  try {
    return JSON.parse(teks)
  } catch {
    const mulai = teks.indexOf("{")
    const akhir = teks.lastIndexOf("}")
    if (mulai !== -1 && akhir !== -1 && akhir > mulai) {
      return JSON.parse(teks.slice(mulai, akhir + 1))
    }
    throw new Error("Respons AI tidak berbentuk JSON valid")
  }
}

async function buatRencanaOpenAI(payload) {
  const instruksi = `Kamu adalah asisten akademik bernama MindMate AI untuk mahasiswa Teknik Informatika. Tugasmu membuat rencana belajar yang singkat, jelas, praktis, dan realistis untuk tugas seperti coding, database, jaringan, algoritma, UI/UX, sistem operasi, dan dokumentasi. Gunakan data tugas, deadline, kesulitan, mood, estimasi, status, mood harian, dan energi harian. Balas hanya JSON valid tanpa markdown dengan struktur: {"judul": string, "ringkasan": string, "prioritas": string, "alasanPrioritas": string[], "langkah": string[], "jadwalHariIni": [{"waktu": string, "kegiatan": string, "durasi": string}], "tipsMood": string}. Jangan memberikan diagnosis medis. Jangan membuat jadwal yang terlalu panjang.`

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        { role: "developer", content: instruksi },
        {
          role: "user",
          content: JSON.stringify({
            tanggalSekarang: new Date().toISOString().slice(0, 10),
            ...payload,
          }),
        },
      ],
      max_output_tokens: 1200,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const pesan = data?.error?.message || `OpenAI API error ${response.status}`
    throw new Error(pesan)
  }

  const teks = ambilTextResponsOpenAI(data)
  const hasil = parseJsonDariModel(teks)

  return {
    sumber: "openai-api",
    model: OPENAI_MODEL,
    catatan: "Rencana dibuat langsung memakai OpenAI Responses API.",
    ...hasil,
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return kirimJson(res, 200, { ok: true })
  }

  if (req.method === "GET" && req.url === "/api/status-ai") {
    return kirimJson(res, 200, {
      ok: true,
      openaiAktif: Boolean(OPENAI_API_KEY),
      model: OPENAI_MODEL,
    })
  }

  if (req.method === "POST" && req.url === "/api/rencana-ai") {
    try {
      const body = await bacaBody(req)
      const payload = body ? JSON.parse(body) : {}

      if (!OPENAI_API_KEY) {
        return kirimJson(res, 200, buatRencanaLokal(payload))
      }

      try {
        const hasil = await buatRencanaOpenAI(payload)
        return kirimJson(res, 200, hasil)
      } catch (error) {
        return kirimJson(
          res,
          200,
          buatRencanaLokal(payload, `OpenAI API belum berhasil digunakan: ${error.message}`)
        )
      }
    } catch (error) {
      return kirimJson(res, 400, {
        sumber: "error",
        pesan: error.message || "Permintaan tidak valid",
      })
    }
  }

  return kirimJson(res, 404, { pesan: "Endpoint tidak ditemukan" })
})

server.listen(PORT, () => {
  console.log(`MindMate AI server aktif di http://localhost:${PORT}`)
  console.log(`Status OpenAI: ${OPENAI_API_KEY ? "aktif" : "mode demo lokal"}`)
})
