
# Prompt Detail untuk Membuat Ulang Aplikasi Task Board "in.torma"

Berikut adalah prompt teknis yang komprehensif untuk membangun kembali aplikasi web **"in.torma"**, sebuah papan tugas (task board) kolaboratif.

## 1. Ringkasan Proyek & Teknologi Utama

Tujuan proyek ini adalah membuat sebuah aplikasi web satu halaman (Single Page Application) yang modern, responsif, dan kaya fitur untuk manajemen tugas.

**Stack Teknologi:**
- **Framework:** Next.js 14+ dengan App Router.
- **Bahasa:** TypeScript.
- **Styling:** Tailwind CSS.
- **Komponen UI:** ShadCN/UI.
- **Ikon:** Lucide React.
- **Manajemen Form:** React Hook Form dengan Zod untuk validasi skema.
- **Manipulasi Tanggal:** `date-fns`.
- **Fitur AI:** Genkit dengan Google AI (Gemini).
- **Penyimpanan Data:** `localStorage` pada browser klien, diabstraksi melalui sebuah *service layer*.

## 2. Struktur Direktori & File Penting

Proyek harus memiliki struktur direktori sebagai berikut:

```
/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css     # (Styling global dan variabel tema ShadCN)
│   │   ├── layout.tsx      # (Layout utama, font, dan Toaster)
│   │   └── page.tsx        # (Halaman utama aplikasi)
│   │
│   ├── components/
│   │   ├── ui/             # (Komponen ShadCN: Button, Card, Dialog, dll.)
│   │   ├── ai-task-creator.tsx
│   │   ├── daily-briefing.tsx
│   │   ├── empty-state.tsx
│   │   ├── header.tsx
│   │   ├── task-analytics.tsx
│   │   ├── task-board.tsx
│   │   ├── task-card.tsx
│   │   └── task-dialog.tsx
│   │
│   ├── services/
│   │   └── task-service.ts # (Logika CRUD untuk localStorage)
│   │
│   ├── ai/
│   │   ├── genkit.ts       # (Inisialisasi Genkit global)
│   │   ├── tools/
│   │   │   └── web-search-tool.ts # (Contoh tool untuk Genkit)
│   │   └── flows/
│   │       ├── create-task-flow.ts  # (Flow AI untuk membuat tugas dari teks)
│   │       └── daily-summary-flow.ts # (Flow AI untuk rangkuman harian)
│   │
│   ├── hooks/
│   │   └── use-toast.ts      # (Hook kustom untuk notifikasi)
│   │
│   ├── lib/
│   │   └── utils.ts        # (Fungsi utilitas `cn` dari ShadCN)
│   │
│   └── types/
│       └── task.ts         # (Definisi tipe data untuk Task)
│
├── package.json
└── tailwind.config.ts
```

## 3. Fungsionalitas Inti & Manajemen Data

### 3.1. Struktur Data Tugas (`src/types/task.ts`)
Setiap tugas harus memiliki struktur objek berikut:
```typescript
export type TaskStatus = 'Proses Desain' | 'Proses ACC' | 'Selesai';
export type TaskSource = 'N' | 'CS' | 'Admin';

export interface Task {
  id: string;          // ID unik (timestamp)
  customerName: string;
  description: string;
  status: TaskStatus;
  source: TaskSource;
  dueDate?: string;    // Format 'YYYY-MM-DD'
}
```

### 3.2. Layanan Penyimpanan (`src/services/task-service.ts`)
- Semua operasi data harus melalui `localStorage`.
- Buat sebuah layanan yang mengabstraksi operasi CRUD:
  - `getTasksFromStorage()`: Mengambil semua tugas dari localStorage.
  - `saveTasksToStorage(tasks)`: Menyimpan array tugas dan men-dispatch *event* 'storage' kustom untuk memicu pembaruan UI.
  - `listenToTasks(callback)`: Fungsi real-time yang memanggil *callback* saat data berubah.
  - `addTask(taskData)`: Menambahkan tugas baru.
  - `updateTask(id, updates)`: Memperbarui tugas yang ada.
  - `deleteTask(id)`: Menghapus tugas.

## 4. Desain & Komponen UI

### 4.1. Tema dan Tampilan Umum (`globals.css`)
- Gunakan tema gelap (`dark theme`).
- Latar belakang utama harus berupa gradien animasi lembut (contoh: dari `hsl(222, 84%, 4.9%)` ke `hsl(260, 80%, 10%)`).
- Warna aksen utama (untuk tombol, sorotan) harus ungu cerah (contoh: `hsl(263.4, 92.5%, 64.9%)`).
- Gunakan sudut membulat, bayangan lembut, dan efek blur pada komponen seperti Card dan Dialog.

### 4.2. Komponen Utama (`src/components/`)
- **`Header`**:
  - Tampilkan logo dan nama aplikasi "in.torma".
  - Berisi tombol aksi utama: "Rangkuman Harian", "Dasbor", "AI Assistant", dan tombol utama "Tambah Tugas".
  - Mengelola state untuk dialog tambah/edit tugas.

- **`TaskBoard`**:
  - Menampilkan semua tugas dalam bentuk grid responsif (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - Berisi fungsionalitas **pencarian** (filter secara real-time berdasarkan nama/deskripsi) dan **pengurutan** (berdasarkan jatuh tempo, nama, status).
  - Jika tidak ada tugas, tampilkan komponen `EmptyState` yang informatif.

- **`TaskCard`**:
  - Menampilkan semua informasi dari satu tugas.
  - Gunakan indikator warna yang berbeda berdasarkan status tugas.
  - Tampilkan `dueDate` dan `source` sebagai *badge*.
  - Tombol "Edit/Lihat" dan "Hapus" hanya muncul saat *hover*.

- **`TaskDialog` (untuk Tambah/Edit)**:
  - Gunakan komponen Dialog ShadCN.
  - Form harus dibangun dengan React Hook Form dan divalidasi dengan Zod.
  - Input fields: `customerName` (text), `description` (textarea), `status` (radio group), `source` (select), `dueDate` (calendar popover).
  - Logika form harus menangani mode "buat baru" dan "edit" (dengan data yang sudah terisi).

## 5. Fitur Berbasis AI (Genkit)

### 5.1. AI Assistant (`src/components/ai-task-creator.tsx`)
- Sebuah tombol di header membuka dialog.
- Pengguna memasukkan teks dalam bahasa alami (misal: "buatkan tugas desain spanduk untuk Rinan Corp deadline besok").
- **Genkit Flow (`create-task-flow.ts`):**
  - Flow ini menerima input teks dari pengguna.
  - Menggunakan prompt yang terstruktur untuk **menganalisis intent**: apakah pengguna ingin membuat tugas atau bertanya.
  - **Jika membuat tugas**: Ekstrak `customerName`, `description`, dan `dueDate` (konversi tanggal relatif seperti "besok" menjadi format 'YYYY-MM-DD').
  - **Jika bertanya**: Gunakan `webSearch` tool untuk menjawab pertanyaan umum.
  - Flow mengembalikan objek JSON terstruktur.
- UI kemudian menggunakan data dari flow untuk membuka `TaskDialog` dengan form yang sudah terisi.

### 5.2. Rangkuman Harian (`src/components/daily-briefing.tsx`)
- Sebuah tombol di header.
- Saat diklik, ambil semua tugas yang statusnya bukan 'Selesai'.
- **Genkit Flow (`daily-summary-flow.ts`):**
  - Flow ini menerima daftar tugas aktif.
  - Menggunakan prompt untuk menghasilkan sebuah paragraf ringkasan yang ramah dalam Bahasa Indonesia.
  - Menggunakan model **Text-to-Speech (TTS)** Gemini (`gemini-2.5-flash-preview-tts`) untuk mengubah teks ringkasan menjadi audio.
  - Mengonversi audio PCM menjadi format WAV (Base64 data URI).
- UI menerima data audio dan langsung memutarnya menggunakan elemen `<audio>` HTML.

### 5.3. Dasbor Analitik (`src/components/task-analytics.tsx`)
- Sebuah tombol di header membuka dialog analitik.
- Tampilkan 3 metrik KPI utama: Total Tugas, Tugas Aktif, Tugas Selesai.
- Gunakan `recharts` untuk menampilkan dua grafik:
  - **Diagram Batang**: Jumlah tugas yang selesai per hari selama 7 hari terakhir.
  - **Diagram Pai**: Distribusi tugas berdasarkan `source`.
- Semua data untuk analitik harus dihitung di sisi klien dari data tugas yang ada.
