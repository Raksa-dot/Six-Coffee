import { urutkanTugas, hitungSkorPrioritas, ambilLevelPrioritas } from "../logika/prioritas"

function warnaPrioritas(level) {
  if (level === "PRIORITAS TINGGI") {
    return {
      bar: "bg-red-500",
      teks: "text-red-500",
    }
  }

  if (level === "SEDANG") {
    return {
      bar: "bg-violet-500",
      teks: "text-violet-500",
    }
  }

  return {
    bar: "bg-slate-300",
    teks: "text-slate-400",
  }
}

function DaftarPrioritas({ daftarTugas, tugasAktif, setTugasAktif }) {
  const tugasUrut = urutkanTugas(daftarTugas)

  return (
    <section className="mindmate-soft-card rounded-3xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-slate-900">
          Antrean Prioritas
        </h3>

        <button className="rounded-full px-2 py-1 text-[11px] font-bold text-violet-500 transition hover:bg-violet-50 hover:text-violet-700 active:scale-95">
          Edit Daftar
        </button>
      </div>

      <div className="space-y-3">
        {tugasUrut.map((tugas, index) => {
          const skor = hitungSkorPrioritas(tugas)
          const level = ambilLevelPrioritas(skor)
          const warna = warnaPrioritas(level)

          return (
            <button
              key={tugas.id}
              onClick={() => setTugasAktif(tugas)}
              className={`flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${
                tugasAktif?.id === tugas.id
                  ? "ring-violet-300"
                  : "ring-slate-100"
              }`}
            >
              <div className={`h-10 w-1.5 rounded-full ${warna.bar}`} />

              <div>
                <p className="text-[13px] font-bold text-slate-800">
                  {tugas.nama}
                </p>

                <p className={`mt-0.5 text-[10px] font-bold uppercase ${warna.teks}`}>
                  #{index + 1} {level}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default DaftarPrioritas