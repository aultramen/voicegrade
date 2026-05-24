# PRD — VoiceGrade

**Versi:** 0.1.0  
**Tanggal:** 2026-03-09  
**Penulis:** Generated from codebase scan  
**Status:** Draft

---

## 1. Pendahuluan / Overview

**VoiceGrade** adalah aplikasi desktop Windows yang memungkinkan guru merekam nilai siswa secara hands-free menggunakan teknologi pengenalan suara (Web Speech API). Guru cukup mengucapkan nama siswa dan nilai, dan sistem akan langsung mencatat secara otomatis ke database lokal.

Aplikasi dibangun dengan **React + Vite** sebagai frontend dan **Tauri v2** sebagai shell desktop, menggunakan **SQLite** (via `tauri-plugin-sql`) sebagai penyimpanan data lokal tanpa kebutuhan server atau internet.

### Masalah yang Diselesaikan
Proses input nilai konvensional memerlukan guru untuk mengetik nama siswa satu per satu sambil tetap memperhatikan kelas, menyebabkan gangguan fokus, salah ketik, dan pemborosan waktu. VoiceGrade menghilangkan hambatan ini dengan voice-first workflow.

---

## 2. Target Pengguna

**Utama:** Guru tingkat SD, SMP, SMA di Indonesia yang perlu mencatat nilai hasil ulisan/tugas/praktik di dalam kelas.

**Karakteristik pengguna:**
- Tidak memerlukan keahlian teknis
- Terbiasa menggunakan perangkat Windows
- Membutuhkan kemudahan dan kecepatan, bukan fitur yang kompleks
- Mengajar lebih dari satu kelas dan mata pelajaran

---

## 3. Goals

- Memungkinkan guru mencatat nilai siswa dengan mengucapkan nama dan angka, tanpa mengetik
- Mengurangi waktu input nilai minimal 50% dibandingkan input manual
- Menyediakan penyimpanan data 100% lokal (tidak ada cloud, tidak ada login)
- Mendukung ekspor data nilai ke format standar (Excel/CSV) yang kompatibel dengan kebutuhan administrasi sekolah
- Menyediakan antarmuka bilingual (Bahasa Indonesia & Inggris)
- Berjalan sebagai aplikasi desktop Windows yang dapat diinstal (installer `.msi`)

---

## 4. User Stories

### US-001: Membuat Kelas Baru
**Deskripsi:** Sebagai guru, saya ingin membuat kelas baru dengan nama tertentu agar saya bisa mengelompokkan siswa dan nilai mata pelajaran per kelas.

**Acceptance Criteria:**
- [ ] Guru dapat membuka modal "Buat Kelas Baru" dari halaman Home
- [ ] Guru memasukkan nama kelas dan menekan tombol simpan
- [ ] Kelas baru muncul di daftar kelas di halaman Home
- [ ] Data tersimpan ke SQLite secara persisten
- [ ] Validasi: nama tidak boleh kosong

---

### US-002: Mengelola Daftar Siswa
**Deskripsi:** Sebagai guru, saya ingin menambahkan, mengedit, menghapus, dan mengurutkan ulang siswa di sebuah kelas agar daftar siswa akurat sebelum sesi input nilai.

**Acceptance Criteria:**
- [ ] Guru dapat menambahkan siswa satu per satu dari input teks
- [ ] Guru dapat melakukan bulk-add siswa (beberapa nama sekaligus)
- [ ] Guru dapat mengedit nama siswa yang sudah ada
- [ ] Guru dapat menghapus siswa (dengan konfirmasi)
- [ ] Guru dapat drag-and-drop untuk mengurutkan ulang daftar siswa
- [ ] Nama duplikat tidak diperbolehkan dalam satu kelas

---

### US-003: Mengelola Mata Pelajaran
**Deskripsi:** Sebagai guru, saya ingin menambahkan, mengedit, menghapus, dan mengurutkan mata pelajaran di sebuah kelas agar sesi input nilai dapat dilakukan per-mapel.

**Acceptance Criteria:**
- [ ] Guru dapat menambahkan mata pelajaran dari input teks
- [ ] Guru dapat mengedit nama mata pelajaran
- [ ] Guru dapat menghapus mata pelajaran beserta semua nilainya (dengan konfirmasi)
- [ ] Guru dapat drag-and-drop untuk mengurutkan ulang mata pelajaran
- [ ] Nama mapel duplikat tidak diperbolehkan dalam satu kelas

---

### US-004: Input Nilai via Suara
**Deskripsi:** Sebagai guru, saya ingin mengucapkan nama siswa dan nilai menggunakan mikrofon agar nilai langsung tercatat tanpa mengetik.

**Acceptance Criteria:**
- [ ] Guru dapat mengaktifkan mikrofon dengan klik tombol atau menekan tombol Space
- [ ] Speech API mendengarkan input dalam Bahasa Indonesia (`id-ID`)
- [ ] Sistem mem-parsing ucapan dengan format "nama siswa [koma/angka] nilai"
- [ ] Nama siswa dicocokkan menggunakan fuzzy matching (Fuse.js) terhadap daftar siswa
- [ ] Nilai yang berhasil dikenali otomatis tersimpan ke database
- [ ] Feedback visual muncul di layar (transcript, hasil sukses/gagal)
- [ ] Mikrofon auto-restart setelah setiap ucapan untuk hands-free
- [ ] Keyboard shortcut `Space` untuk toggle mikrofon, `Escape` menutup modal ambigu

---

### US-005: Penanganan Nama Ambigu
**Deskripsi:** Sebagai guru, saya ingin sistem menampilkan pilihan ketika nama yang saya ucapkan cocok dengan lebih dari satu siswa, agar saya bisa memilih yang tepat.

**Acceptance Criteria:**
- [ ] Jika fuzzy match menghasilkan 2+ kandidat dengan skor berdekatan (selisih < 0.15), modal ambiguitas ditampilkan
- [ ] Modal menampilkan daftar nama kandidat beserta tombol pilih
- [ ] Setelah guru memilih, nilai dicatat ke siswa yang benar
- [ ] Guru dapat menutup modal tanpa merekam nilai (dismiss)

---

### US-006: Roster Siswa Real-time
**Deskripsi:** Sebagai guru, saya ingin melihat daftar siswa beserta nilai mereka secara real-time selama sesi input agar saya tahu siapa yang sudah dan belum dicatat.

**Acceptance Criteria:**
- [ ] Panel roster menampilkan semua siswa dengan status "sudah dinilai" / "belum"
- [ ] Siswa yang baru saja dicatat diberi highlight selama 2 detik
- [ ] Counter progress ditampilkan di header (X/Y siswa tercatat)
- [ ] Header auto-hide saat scrolling ke bawah untuk memaksimalkan ruang roster

---

### US-007: Log & Undo per Sesi
**Deskripsi:** Sebagai guru, saya ingin melihat log nilai yang baru diinput dan membatalkan input terakhir jika terjadi kesalahan.

**Acceptance Criteria:**
- [ ] Log bar di bagian bawah layar menampilkan hingga 20 entri terakhir
- [ ] Setiap entri log menampilkan nama siswa dan nilai yang tercatat
- [ ] Guru dapat mengedit nilai langsung dari log
- [ ] Guru dapat menghapus entri dari log
- [ ] Tombol "Undo" menghapus entri log terakhir sekaligus dari database
- [ ] Log bersifat sesi (tidak persisten setelah halaman direload)

---

### US-008: Melihat & Mengedit Nilai di Review
**Deskripsi:** Sebagai guru, saya ingin melihat semua nilai dalam format tabel dan mengeditnya secara manual jika diperlukan.

**Acceptance Criteria:**
- [ ] Tabel menampilkan baris = siswa, kolom = mata pelajaran
- [ ] Sel yang belum diisi tampil berbeda (kosong / placeholder)
- [ ] Guru dapat mengklik sel untuk mengedit nilai secara inline
- [ ] Perubahan tersimpan ke database secara real-time
- [ ] Statistik completion ditampilkan (X/Y nilai terisi, % lengkap)

---

### US-009: Export Nilai ke Excel & CSV
**Deskripsi:** Sebagai guru, saya ingin mengekspor data nilai ke file Excel atau CSV agar bisa diserahkan ke pihak sekolah atau diarsipkan.

**Acceptance Criteria:**
- [ ] Export ke Excel: semua mapel sebagai sheet terpisah dalam satu workbook `.xlsx`
- [ ] Export ke CSV: satu file CSV per mata pelajaran yang dipilih
- [ ] Di Tauri (desktop): file dialog native muncul agar guru bisa memilih lokasi simpan
- [ ] Nama file default mengikuti format `NamaKelas_nilai.xlsx`
- [ ] File CSV menggunakan BOM UTF-8 untuk kompatibilitas Excel

---

### US-010: Backup & Restore Data
**Deskripsi:** Sebagai guru, saya ingin mem-backup seluruh data kelas saya ke file JSON dan me-restore-nya kapan saja, agar data aman meskipun perangkat berganti.

**Acceptance Criteria:**
- [ ] Tombol backup di halaman Home membuka dialog simpan dan mengekspor semua data ke `.json`
- [ ] Tombol restore membuka dialog buka file dan mengimpor data dari file JSON
- [ ] Data yang di-restore menggabungkan (merge) atau menimpa data yang ada berdasarkan ID
- [ ] Konfirmasi ditampilkan sebelum restore dilakukan

---

### US-011: Statistik Ringkasan di Home
**Deskripsi:** Sebagai guru, saya ingin melihat ringkasan statistik semua kelas di halaman Home agar saya bisa memantau progress keseluruhan.

**Acceptance Criteria:**
- [ ] Statistik menampilkan: jumlah kelas, total siswa, total nilai terisi, dan persentase selesai
- [ ] Warna persentase berubah: merah (<50%), kuning (≥50%), hijau (100%)
- [ ] Setiap kartu kelas menampilkan ringkasan siswa dan progress nilai-nya

---

### US-012: Ganti Tema & Bahasa
**Deskripsi:** Sebagai guru, saya ingin mengganti tampilan ke mode gelap/terang dan mengganti bahasa antarmuka antara Indonesia dan Inggris.

**Acceptance Criteria:**
- [ ] Toggle theme (🌙/☀️) tersedia di semua halaman utama
- [ ] Preferensi tema disimpan ke `localStorage` dan persisten setelah restart
- [ ] Toggle bahasa (🇮🇩 ID / 🇬🇧 EN) tersedia di halaman Landing dan Home
- [ ] Semua teks antarmuka berubah mengikuti bahasa yang dipilih
- [ ] Preferensi bahasa disimpan ke `localStorage`

---

## 5. Functional Requirements

**FR-1:** Sistem harus menyimpan semua data ke SQLite lokal via Tauri Plugin SQL, tanpa memerlukan koneksi internet.

**FR-2:** Sistem harus menggunakan `storageAdapter` yang auto-detect environment: SQLite (Tauri) atau `localStorage` (browser dev mode).

**FR-3:** Sistem harus mem-parsing ucapan pengguna dengan pola: `[nama siswa] [angka/kata angka] [nilai]`, mendukung variasi separator seperti koma, spasi, atau kata transisi.

**FR-4:** Fuzzy matching menggunakan **Fuse.js** dengan threshold yang dikonfigurasi untuk menerima variasi pengucapan nama yang wajar.

**FR-5:** Sistem harus menampilkan interim transcript (real-time) saat user sedang berbicara, dan final transcript setelah selesai.

**FR-6:** Jika Speech API tidak tersedia (non-Chromium), sistem menampilkan peringatan dan tetap memperbolehkan input manual via Review page.

**FR-7:** Export Excel menggunakan library **SheetJS (xlsx)** dengan satu sheet per mata pelajaran.

**FR-8:** Di environment Tauri, file save/open harus menggunakan native dialog via `@tauri-apps/plugin-dialog` dan `@tauri-apps/plugin-fs`.

**FR-9:** Drag-and-drop urutan siswa dan mapel menggunakan **@dnd-kit** dan tersimpan persisten.

**FR-10:** Seluruh teks UI harus tersedia dalam dua bahasa (id/en) via sistem i18n berbasis objek `translations.js`.

---

## 6. Non-Goals (Out of Scope)

- ❌ Tidak ada autentikasi atau sistem login/akun pengguna
- ❌ Tidak ada sinkronisasi cloud atau fitur berbagi antar perangkat
- ❌ Tidak ada fitur absensi, jadwal pelajaran, atau rapor lengkap
- ❌ Tidak ada dukungan multi-user / kolaborasi real-time
- ❌ Tidak ada fitur cetak (print) langsung dari aplikasi
- ❌ Tidak ada mobile app (iOS/Android)
- ❌ Tidak ada pengenalan suara selain Bahasa Indonesia (`id-ID`)

---

## 7. Arsitektur Teknis

### Stack
| Layer | Teknologi |
|---|---|
| Frontend Framework | React 19 + Vite 6 |
| Desktop Shell | Tauri v2 |
| Database | SQLite via `tauri-plugin-sql` |
| Voice Input | Web Speech API (id-ID) |
| Fuzzy Search | Fuse.js 7 |
| Drag & Drop | @dnd-kit |
| Export | SheetJS (xlsx) |
| File Dialog | `@tauri-apps/plugin-dialog` + `plugin-fs` |
| Routing | React Router DOM 7 (MemoryRouter) |
| i18n | Objek terjemahan statis (`translations.js`) |
| Styling | Vanilla CSS dengan CSS Custom Properties |

### Struktur Halaman (Routes)
```
/            → LandingPage     (splash + fitur + how-to)
/home        → HomePage        (daftar kelas + statistik)
/setup/:id   → SetupPage       (kelola siswa & mapel)
/session/:id → SessionPage     (input nilai via suara)
/review/:id  → ReviewPage      (tabel nilai + export)
```

### Model Data (SQLite)
```
kelas: { id, nama, siswa: JSON[], mapel: JSON[], nilai: JSON{} }
```
Nilai disimpan sebagai nested JSON: `{ [mapel]: { [siswa]: number } }`

### Komponen Utama
| Komponen | Fungsi |
|---|---|
| `MicButton` | Toggle mikrofon dengan animasi |
| `Waveform` | Visualisasi audio animasi |
| `TranscriptDisplay` | Tampilan transcript interim & hasil |
| `StudentRoster` | Daftar siswa + status nilai real-time |
| `AmbiguityModal` | Pilih siswa saat nama ambigu |
| `SessionLog` | Log nilai sesi + edit/undo |
| `GradeTable` | Tabel nilai per siswa & mapel |
| `ExportBar` | Tombol download Excel & CSV |
| `BackupMenu` | Backup & restore data JSON |
| `ClassCard` | Kartu kelas di halaman Home |
| `NewClassModal` | Modal buat kelas baru |

---

## 8. Desain & UX

- **Tema:** Dark mode default dengan toggle ke light mode; CSS Custom Properties untuk semua token warna
- **Tipografi:** Inter / sistem sans-serif
- **Warna aksen:** Biru/ungu untuk primary, hijau untuk sukses, kuning untuk warning
- **Animasi:** Waveform bars saat mikrofon aktif, highlight flash pada siswa yang baru dicatat
- **Responsivitas:** Layout dua kolom (voice panel + student roster) di SessionPage; grid kelas di HomePage
- **Landing Page:** Halaman marketing dengan hero, feature grid, dan how-it-works steps

---

## 9. Success Metrics

| Metrik | Target |
|---|---|
| Waktu input 30 nilai siswa | < 3 menit |
| Akurasi pengenalan nama (kondisi audio normal) | ≥ 90% |
| Waktu cold-start aplikasi | < 3 detik |
| Ukuran installer Windows | < 20 MB |
| Crash rate per sesi | 0% |
| Keberhasilan export Excel | 100% (tidak corrupt) |

---

## 10. Open Questions

1. **Versi Windows minimum:** Apakah target Windows 10 saja, atau juga Windows 11?
2. **Bahasa input suara:** Apakah perlu mendukung pengucapan campuran (code-switching Bahasa Indonesia + nama siswa berbahasa asing)?
3. **Limit data:** Apakah perlu ada batas maksimum jumlah siswa per kelas atau jumlah kelas?
4. **Cetak laporan:** Apakah fitur cetak (print PDF) termasuk prioritas di versi berikutnya?
5. **Sinkronisasi antar perangkat:** Apakah ada rencana Cloud Sync di roadmap jangka panjang?
6. **Bahasa tambahan:** Apakah perlu dukungan bahasa daerah (mis. Javanese, Sundanese) untuk pengenalan suara?
7. **Distribusi:** Apakah distribusi dilakukan via installer `.msi`, Microsoft Store, atau keduanya?
