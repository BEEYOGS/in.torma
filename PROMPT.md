## Prompt untuk Membuat Ulang Aplikasi "in.torma" dengan HTML, Tailwind CSS, dan JavaScript

Buatlah sebuah aplikasi web "Task Board" satu halaman (Single Page Application) bernama **"in.torma"** menggunakan teknologi berikut:
-   **HTML** untuk struktur.
-   **Tailwind CSS** untuk styling.
-   **JavaScript (vanilla)** untuk semua logika, interaktivitas, dan manipulasi DOM.
-   **TIDAK BOLEH** menggunakan framework JavaScript seperti React, Vue, atau Angular.
-   Gunakan ikon dari **Lucide Icons** (bisa melalui CDN atau sebagai SVG inline).
-   Data harus disimpan di **`localStorage`** peramban (browser) agar persisten.

### 1. Tampilan dan Desain Umum (Styling)

-   **Tema Gelap (Dark Theme)**: Gunakan latar belakang gelap (#0f172a atau serupa), teks terang, dan warna aksen ungu/violet cerah (#8b5cf6) untuk elemen interaktif seperti tombol utama dan sorotan.
-   **Latar Belakang**: Gunakan latar belakang gradien animasi yang lembut dengan warna gelap seperti `hsl(222, 84%, 4.9%)` dan `hsl(260, 80%, 10%)`.
-   **Font**: Gunakan font sans-serif modern seperti Inter.
-   **Komponen**: Gunakan sudut membulat (rounded corners) dan bayangan lembut (shadows) untuk kartu, dialog, dan tombol agar terlihat modern.

### 2. Struktur Halaman (HTML)

Aplikasi harus memiliki struktur sebagai berikut:
1.  **Header**:
    -   Logo dan nama aplikasi "in.torma".
    -   Area tombol di sebelah kanan yang berisi:
        -   Tombol "Rangkuman Harian" (Daily Briefing).
        -   Tombol "Dasbor" (Analytics).
        -   Tombol "AI Assistant".
        -   Tombol utama "Tambah Tugas" dengan ikon tambah.
2.  **Area Kontrol Papan Tugas**:
    -   Input pencarian untuk memfilter tugas.
    -   Tombol dropdown untuk mengurutkan tugas (contoh: berdasarkan jatuh tempo, nama pelanggan).
3.  **Papan Tugas (Task Board)**:
    -   Sebuah grid (CSS Grid atau Flexbox) yang akan menampilkan semua kartu tugas.
    -   Jika tidak ada tugas, tampilkan pesan "Empty State" dengan sebuah ilustrasi sederhana dan teks yang memberi tahu pengguna untuk menambahkan tugas baru.

### 3. Fungsionalitas Inti (JavaScript & localStorage)

-   **Struktur Data Tugas**: Setiap objek tugas dalam `localStorage` harus memiliki properti berikut:
    -   `id` (string, unik, bisa menggunakan `Date.now()`)
    -   `customerName` (string)
    -   `description` (string)
    -   `status` (string: 'Proses Desain', 'Proses ACC', 'Selesai')
    -   `source` (string: 'N', 'CS', 'Admin')
    -   `dueDate` (string, format 'YYYY-MM-DD')
-   **Manajemen Tugas (CRUD)**:
    -   **Create**: Tombol "Tambah Tugas" membuka sebuah dialog/modal. Form di dalamnya harus bisa menambahkan tugas baru dan menyimpannya ke `localStorage`.
    -   **Read**: Saat halaman dimuat, baca semua tugas dari `localStorage` dan render sebagai kartu-kartu di papan tugas.
    -   **Update**: Setiap kartu tugas harus memiliki tombol "Edit/Lihat" yang membuka dialog yang sama dengan data tugas yang sudah terisi untuk diperbarui.
    -   **Delete**: Setiap kartu tugas harus memiliki tombol "Hapus" yang akan menghapus tugas dari `localStorage` dan dari tampilan.
    -   Tampilan harus diperbarui secara otomatis setelah setiap operasi CRUD tanpa perlu me-reload halaman.

### 4. Komponen dan Interaktivitas

-   **Kartu Tugas (Task Card)**:
    -   Menampilkan semua data tugas.
    -   Warna indikator status harus berbeda berdasarkan statusnya (misal: ungu untuk 'Proses Desain', oranye untuk 'Proses ACC', hijau untuk 'Selesai').
    -   Menampilkan tanggal jatuh tempo dan sumber sebagai "badge".
    -   Tombol Edit dan Hapus hanya muncul saat kursor *hover* di atas kartu.
-   **Dialog/Modal (Tambah/Edit Tugas)**:
    -   Gunakan elemen `<dialog>` HTML atau buat modal kustom dengan `div`.
    -   Form harus mencakup input untuk nama pelanggan (teks), deskripsi (textarea), status (radio button), sumber (select dropdown), dan tanggal jatuh tempo (input type="date").
    -   Lakukan validasi form sederhana (misal, nama dan deskripsi tidak boleh kosong).
-   **Pencarian dan Pengurutan**:
    -   Input pencarian harus memfilter kartu tugas secara real-time saat pengguna mengetik.
    -   Dropdown pengurutan harus mengatur ulang urutan kartu tugas di papan.
-   **Dasbor Analitik (Analytics Dashboard)**:
    -   Tombol "Dasbor" membuka dialog/modal.
    -   Tampilkan metrik dasar: Jumlah total tugas, tugas aktif, dan tugas selesai.
    -   Buat dua diagram sederhana menggunakan `div` dan style (tidak perlu library chart):
        -   **Diagram Batang**: Tugas selesai dalam 7 hari terakhir.
        -   **Diagram Pai**: Distribusi tugas berdasarkan sumber.
-   **Fitur AI (Simulasi Sederhana)**:
    -   **AI Assistant**: Tombol ini membuka dialog. Pengguna memasukkan teks. Logika JavaScript akan mencoba mengekstrak "nama pelanggan", "deskripsi", dan "deadline" (misal, jika ada kata "besok", set tanggalnya ke besok). Kemudian, buka dialog Tambah Tugas dengan data yang sudah terisi.
    -   **Rangkuman Harian**: Tombol ini akan mengambil semua tugas aktif, membuat teks ringkasan (misal, "Anda punya 3 tugas aktif..."), dan menggunakan Web Speech API (`speechSynthesis.speak()`) untuk membacakan ringkasan tersebut.
