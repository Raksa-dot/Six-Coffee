/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Home,
  LineChart,
  Lock,
  Search,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react"

function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-[1160px] items-center justify-between px-4 py-5 md:px-6">
      <div className="text-[13px] font-black tracking-tight text-violet-700">
        MindMate
      </div>

      <nav className="hidden items-center gap-7 text-[10px] font-bold text-slate-500 md:flex">
        <a href="#" className="text-violet-700">
          Home
        </a>
        <a href="#fitur">Fitur</a>
        <a href="#keunggulan">Keunggulan</a>
        <a href="#kontak">Kontak</a>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="hidden text-[10px] font-bold text-violet-700 md:block"
        >
          Masuk
        </Link>

        <Link
          to="/daftar"
          className="mindmate-button rounded-full bg-violet-600 px-4 py-2 text-[10px] font-extrabold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          Mulai Sekarang
        </Link>
      </div>
    </header>
  )
}

function FloatingBadge({ className, icon: Icon, label, value }) {
  return (
    <div
      className={`absolute rounded-2xl bg-white/90 px-4 py-3 shadow-xl shadow-violet-300/30 ring-1 ring-violet-100 backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600">
          <Icon size={14} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="text-xs font-black text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  )
}

function PhonePreview() {
  const items = [
    "CRUD Laravel",
    "Desain ERD",
    "Algoritma Sorting",
    "Review Database",
    "Debugging UI",
  ]

  return (
    <div className="relative mx-auto h-[372px] w-[250px] rounded-[34px] bg-white p-3 shadow-2xl shadow-slate-700/10 ring-1 ring-white/80">
      <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />

      <div className="h-[332px] rounded-[28px] bg-[#fbf9ff] p-4 ring-1 ring-violet-50">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
              Today Plan
            </p>
            <p className="mt-1 text-[13px] font-black text-slate-950">
              Rencana AI
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <Brain size={14} />
          </div>
        </div>

        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-sm ring-1 ${
                index === 0
                  ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white ring-violet-500"
                  : "bg-white text-slate-700 ring-slate-100"
              }`}
            >
              <div
                className={`${
                  index === 0 ? "bg-white/20" : "bg-violet-50"
                } flex h-5 w-5 items-center justify-center rounded-full`}
              >
                <CheckCircle2
                  size={12}
                  className={index === 0 ? "text-white" : "text-violet-500"}
                />
              </div>

              <div>
                <p className="text-[10px] font-black">{item}</p>
                <p
                  className={`text-[8px] ${
                    index === 0 ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {index === 0 ? "Prioritas utama" : "Terjadwal"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-[1160px] items-center gap-8 px-4 pb-10 pt-6 md:grid-cols-[0.92fr_1.08fr] md:px-6 md:pb-16 md:pt-9">
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[10px] font-black text-violet-700 shadow-sm ring-1 ring-violet-100">
          <Sparkles size={12} />
          AI Study Assistant untuk TI
        </div>

        <h1 className="max-w-[480px] text-[34px] font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-[40px] md:text-[58px] lg:text-[64px]">
          Kelola tugas TI,
          <span className="block text-violet-700">
            tanpa panik deadline.
          </span>
        </h1>

        <p className="mt-5 max-w-[460px] text-[13px] leading-7 text-slate-500 md:text-sm">
          MindMate membantu mahasiswa Teknik Informatika mengatur tugas coding, database, algoritma, mood, deadline, dan rencana belajar yang lebih realistis.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/daftar"
            className="inline-flex items-center gap-2 mindmate-button rounded-full bg-violet-600 px-5 py-3 text-[11px] font-black text-white shadow-xl shadow-violet-200 transition hover:bg-violet-700"
          >
            Mulai Check-in
            <ArrowRight size={14} />
          </Link>

          <button className="rounded-full bg-white px-5 py-3 text-[11px] font-black text-slate-700 shadow-sm ring-1 ring-violet-100 transition hover:bg-violet-50">
            Lihat Demo
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-6 top-8 h-48 w-48 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-pink-300/40 blur-3xl" />

        <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-[34px] bg-gradient-to-br from-violet-100 via-pink-100 to-rose-200 p-8 shadow-2xl shadow-violet-200/70 ring-1 ring-white/80 md:p-10">
          <div className="absolute left-10 top-20 h-24 w-24 rounded-full border border-white/60 bg-white/20" />
          <div className="absolute bottom-14 right-10 h-32 w-32 rounded-full border border-white/70 bg-white/20" />
          <div className="absolute right-16 top-14 h-12 w-12 rounded-full bg-white/30 blur-sm" />

          <FloatingBadge
            className="left-7 top-7"
            icon={Zap}
            label="Focus"
            value="85%"
          />

          <FloatingBadge
            className="bottom-7 right-7"
            icon={CalendarDays}
            label="Deadline"
            value="Besok"
          />

          <PhonePreview />
        </div>
      </div>
    </section>
  )
}

/*
  BAGIAN INI YANG NGATUR FONT JUDUL SECTION

  Untuk membesarkan tulisan atas:
  ubah text-3xl jadi text-4xl / text-5xl
  ubah md:text-4xl jadi md:text-5xl / md:text-6xl

  Untuk mengecilkan tulisan atas:
  ubah text-3xl jadi text-2xl
  ubah md:text-4xl jadi md:text-3xl

  Untuk teks bawah:
  ubah text-sm jadi text-xs / text-base / text-lg
*/
function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center">
      <h2 className="text-3xl font-black uppercase leading-tight tracking-[-0.045em] text-slate-950 md:text-4xl">
        {eyebrow}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-violet-700 md:text-base">
        {title}
      </p>

      {desc && (
        <p className="mt-3 text-[13px] leading-6 text-slate-500">
          {desc}
        </p>
      )}
    </div>
  )
}

function TaskDashboardCard() {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-violet-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-[9px] font-black text-teal-600">
            Dashboard
          </span>

          <h3 className="mt-3 text-base font-black text-slate-950">
            Selesaikan Tugas Tanpa Distraksi
          </h3>

          <p className="mt-2 max-w-xs text-[11px] leading-5 text-slate-500">
            Kelola tugas penting dan lihat progres belajarmu dalam satu tempat
            yang rapi.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_185px]">
        <div className="rounded-3xl bg-violet-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-slate-900">
                Laporan Fisika
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Deadline besok • Sulit
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-3 py-1 text-[9px] font-black text-red-500">
              Tinggi
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full w-[76%] rounded-full bg-violet-600" />
          </div>

          <button className="mt-4 mindmate-button rounded-full bg-violet-600 px-4 py-2 text-[10px] font-black text-white">
            Mulai Tugas
          </button>
        </div>

        <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-50 to-violet-50 p-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-violet-100">
            <Target className="text-violet-700" size={34} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MoodOption({ emoji, label, warna, bg }) {
  return (
    <div className={`rounded-2xl ${bg} p-4 text-center`}>
      <p className="text-xl">{emoji}</p>
      <p className={`mt-2 text-[10px] font-black ${warna}`}>{label}</p>
    </div>
  )
}

function MoodCard() {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-violet-100">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-black text-slate-950">
            Mood Check-In
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Agar rekomendasi belajar lebih sesuai dengan kondisi kamu.
          </p>
        </div>

        <Sparkles size={16} className="text-violet-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MoodOption
          emoji="🔥"
          label="Semangat"
          warna="text-orange-500"
          bg="bg-orange-50"
        />
        <MoodOption
          emoji="☕"
          label="Biasa Aja"
          warna="text-slate-500"
          bg="bg-slate-50"
        />
        <MoodOption
          emoji="🙂"
          label="Senang"
          warna="text-yellow-500"
          bg="bg-yellow-50"
        />
        <MoodOption
          emoji="💗"
          label="Fokus"
          warna="text-rose-500"
          bg="bg-rose-50"
        />
      </div>
    </div>
  )
}

function PriorityCard() {
  const tugas = [
    ["#1", "Laporan Fisika", "Prioritas Tinggi", "text-red-500"],
    ["#2", "Kuis Matematika", "Sedang", "text-violet-500"],
    ["#3", "Revisi Essay", "Prioritas Rendah", "text-slate-400"],
  ]

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-violet-100">
      <h3 className="text-base font-black text-slate-950">
        Tugas Prioritas
      </h3>

      <div className="mt-5 space-y-3">
        {tugas.map(([no, judul, sub, warna]) => (
          <div
            key={judul}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
          >
            <p className={`text-xs font-black ${warna}`}>{no}</p>

            <div>
              <p className="text-xs font-black text-slate-900">{judul}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase text-slate-400">
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsCard() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-violet-600 p-5 text-white shadow-xl shadow-violet-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-white/70">
            Analitik Keseimbangan
          </p>

          <h3 className="mt-2 max-w-xs text-xl font-black tracking-tight">
            Fokus meningkat setelah kamu mengatur prioritas.
          </h3>

          <p className="mt-2 text-[11px] leading-5 text-white/70">
            Grafik mingguan menunjukkan progres belajar yang stabil.
          </p>
        </div>

        <div className="flex h-24 items-end gap-3">
          <span className="h-10 w-10 rounded-t-2xl bg-white/25" />
          <span className="h-16 w-10 rounded-t-2xl bg-white/40" />
          <span className="h-20 w-10 rounded-t-2xl bg-white/70" />
          <span className="h-12 w-10 rounded-t-2xl bg-white/35" />
        </div>
      </div>
    </div>
  )
}

function FeatureAndPreviewSection() {
  return (
    
    <section
      id="fitur"
      className="mx-auto w-full max-w-[1160px] px-4 py-12 md:px-6"
    >
      <SectionTitle
        eyebrow="Fitur Andalan Untukmu"
        title="Dirancang untuk mengatur tugas, mood, dan fokusmu."
      />

      <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
        <TaskDashboardCard />
        <MoodCard />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
        <PriorityCard />
        <AnalyticsCard />
      </div>
    </section>
  )
}

function BenefitCard({ icon: Icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        <Icon size={20} />
      </div>

      <h3 className="mt-5 text-sm font-black text-slate-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-[230px] text-[11px] leading-5 text-slate-500">
        {desc}
      </p>
    </div>
  )
}

function BenefitSection() {
  return (
    <section
      id="keunggulan"
      className="mx-auto w-full max-w-[1160px] px-4 py-14 md:px-6"
    >
      <div className="rounded-[34px] bg-white/55 px-6 py-12 shadow-sm ring-1 ring-violet-100 md:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          <BenefitCard
            icon={Zap}
            title="Prioritas Otomatis"
            desc="Sistem membantu menentukan tugas mana yang perlu dikerjakan dulu."
          />

          <BenefitCard
            icon={Lock}
            title="Rencana AI Personalisasi"
            desc="Jadwal belajar yang dinamis, menyesuaikan energi dan deadline."
          />

          <BenefitCard
            icon={LineChart}
            title="Analitik Mental"
            desc="Pantau tingkat fokus dan kebiasaan belajar untuk meningkatkan performa."
          />
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-14 text-center md:px-6">
      <h2 className="text-3xl font-black tracking-[-0.045em] text-slate-950 md:text-4xl">
        Siap menguasai semester ini?
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-slate-500">
        Bergabunglah dengan ribuan mahasiswa lainnya yang sudah belajar dengan
        lebih tenang dan terarah.
      </p>

      <Link
        to="/daftar"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3 text-xs font-black text-white shadow-xl shadow-violet-200"
      >
        Daftar MindMate Gratis
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-xs font-black text-slate-900">{title}</h4>

      <div className="mt-3 grid gap-2 text-[11px] text-slate-500">
        {links.map((link) => (
          <a key={link} href="#">
            {link}
          </a>
        ))}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer
      id="kontak"
      className="mx-auto w-full max-w-[1160px] px-4 py-10 md:px-6"
    >
      <div className="grid gap-8 border-t border-violet-100 pt-8 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <h3 className="text-base font-black text-violet-700">MindMate</h3>

          <p className="mt-3 max-w-sm text-[11px] leading-6 text-slate-500">
            Platform pendamping produktivitas mahasiswa untuk mengatur tugas,
            mood, dan rencana belajar.
          </p>
        </div>

        <FooterColumn
          title="Produk"
          links={["Fitur", "Rencana AI", "Mode Fokus"]}
        />

        <FooterColumn
          title="Perusahaan"
          links={["Tentang Kami", "Blog", "Kontak"]}
        />

        <FooterColumn
          title="Bantuan"
          links={["Pusat Bantuan", "FAQ", "Kontak Support"]}
        />
      </div>

      <div className="mt-8 flex flex-col justify-between gap-3 text-[10px] text-slate-400 md:flex-row">
        <p>© 2024 MindMate. Semua hak cipta dilindungi.</p>

        <div className="flex gap-5">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Ketentuan Layanan</a>
        </div>
      </div>
    </footer>
  )
}

export default function HalamanAwal() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf8ff] text-slate-900">
      <div className="pointer-events-none absolute left-[-140px] top-28 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-160px] top-52 h-[28rem] w-[28rem] rounded-full bg-pink-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[42rem] left-[45%] h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

      <Navbar />
      <HeroSection />
      <FeatureAndPreviewSection />
      <BenefitSection />
      <CTASection />
      <Footer />
    </div>
  )
}