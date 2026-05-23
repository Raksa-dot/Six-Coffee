# MindMate AI - Jadwal Deadline + Rencana AI OpenAI

Project ini adalah aplikasi React + Vite untuk mengelola tugas, deadline, mood, jadwal, dan rencana belajar berbasis AI.

## Menjalankan Project

```bash
npm install
npm run dev:full
```

Buka alamat dari Vite, biasanya `http://localhost:5173`.

## Mengaktifkan OpenAI pada Fitur Rencana AI

1. Salin `.env.example` menjadi `.env`.
2. Isi `OPENAI_API_KEY` dengan API key dari dashboard OpenAI.
3. Jalankan `npm run dev:full`.
4. Buka menu **Rencana AI** lalu klik **Buat Ulang**.

Panduan lengkap ada di file `PANDUAN_OPENAI_MINDMATE.md`.

## Mode Demo Lokal

Jika API key belum diisi, fitur Rencana AI tetap berjalan memakai aturan lokal agar aplikasi tetap bisa dicoba dan dipresentasikan.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
