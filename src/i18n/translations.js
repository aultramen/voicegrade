/** All UI strings in ID (Indonesian) and EN (English) */
export const translations = {
    id: {
        // ── LandingPage ──────────────────────────────────────────
        landing: {
            badge: '✨ Untuk Guru, Dari Guru',
            heroTitle1: 'Input Nilai Siswa',
            heroTitle2: 'Cukup dengan Suara',
            heroDesc: 'VoiceGrade membantu guru merekam nilai dengan cepat menggunakan teknologi pengenalan suara. Hemat waktu, kurangi salah ketik, fokus mengajar.',
            ctaMain: '🚀 Mulai Sekarang — Gratis',
            ctaNote: 'Tidak perlu login · Data tersimpan di perangkat',
            sectionFeatures: 'Semua yang Anda Butuhkan',
            sectionFeaturesDesc: 'Dirancang khusus untuk kebutuhan penilaian di kelas.',
            sectionHow: 'Cara Penggunaan',
            sectionHowDesc: 'Mulai dalam 3 langkah sederhana.',
            ctaBottom: 'Siap Menghemat Waktu Anda?',
            ctaBottomDesc: 'Mulai input nilai dengan suara sekarang. Tidak ada konfigurasi rumit.',
            ctaBottomBtn: 'Buka VoiceGrade →',
            openApp: 'Buka Aplikasi →',
            footerLocal: 'Data tersimpan lokal di perangkat Anda',
            footerCredit: 'Made with ❤️ for Teachers',
        },
        features: [
            { icon: '🎤', title: 'Input Nilai via Suara', desc: 'Ucapkan nama siswa dan nilai, langsung tercatat. Tidak perlu mengetik satu per satu.' },
            { icon: '🧠', title: 'Pengenalan Nama Pintar', desc: 'Sistem mengenali nama meskipun diucapkan tidak sempurna menggunakan fuzzy matching.' },
            { icon: '📊', title: 'Rekap Nilai Otomatis', desc: 'Jumlah, rata-rata, dan peringkat siswa dihitung otomatis tanpa rumus manual.' },
            { icon: '📤', title: 'Export Excel & CSV', desc: 'Unduh data nilai dalam format Excel atau CSV siap pakai kapan saja.' },
            { icon: '💾', title: 'Backup & Restore', desc: 'Simpan seluruh data ke file JSON dan pulihkan kapan pun dibutuhkan.' },
            { icon: '🔄', title: 'Edit & Koreksi Mudah', desc: 'Klik langsung nilai yang salah untuk mengubah atau menghapus, tanpa kerumitan.' },
        ],
        steps: [
            { num: '1', title: 'Buat Kelas', desc: 'Tambahkan nama kelas, daftar siswa, dan mata pelajaran.' },
            { num: '2', title: 'Mulai Input', desc: 'Tekan tombol mic atau Spasi, lalu ucapkan "nama siswa, nilai".' },
            { num: '3', title: 'Export & Simpan', desc: 'Unduh rekap nilai ke Excel atau CSV, atau backup seluruh data.' },
        ],

        // ── HomePage ─────────────────────────────────────────────
        home: {
            subtitle: 'Input nilai via suara, simpan ke Excel',
            newClass: '+ Buat Kelas Baru',
            sectionTitle: 'Kelas Saya',
            statKelas: 'Kelas',
            statSiswa: 'Siswa',
            statNilai: 'Nilai Terisi',
            statSelesai: 'Selesai',
            loading: 'Memuat data...',
            emptyTitle: 'Belum ada kelas',
            emptyDesc: 'Buat kelas baru untuk mulai mencatat nilai siswa via suara.',
            emptyBtn: '+ Buat Kelas Pertama',
            footerLocal: 'Data tersimpan lokal di perangkat Anda',
            footerCredit: 'Made with ❤️ for Teachers',
            aboutApp: '← Tentang Aplikasi',
        },

        // ── SetupPage ────────────────────────────────────────────
        setup: {
            back: '← Beranda',
            title: '⚙️ Setup:',
            btnNilai: '📊 Nilai',
            btnStart: '🎤 Mulai Input Nilai',
            loading: 'Memuat...',
            notFound: 'Kelas tidak ditemukan',
            backHome: '← Kembali',
            modalTitle: 'Pilih Mata Pelajaran',
            modalDesc: 'Pilih mapel yang akan diisi nilainya:',
            modalCancel: 'Batal',
            modalStart: 'Mulai Sesi',
            alertSiswa: 'Tambahkan minimal 1 siswa terlebih dahulu.',
            alertMapel: 'Tambahkan minimal 1 mata pelajaran terlebih dahulu.',
            confirmDeleteSiswa: (n) => `Hapus "${n}" dari daftar?`,
            confirmDeleteMapel: (n) => `Hapus "${n}" beserta semua nilainya?`,
        },

        // ── SessionPage ──────────────────────────────────────────
        session: {
            back: '← Setup',
            recorded: 'siswa tercatat',
            viewGrades: '📊 Lihat Nilai',
            unsupported: '⚠️ Voice input memerlukan browser berbasis Chromium. Anda tetap bisa edit nilai manual di halaman',
            unsupportedLink: 'Lihat Nilai',
            micHint: 'Tekan Spasi atau klik untuk mulai',
            micHintOff: 'Speech API tidak tersedia',
            loading: 'Memuat data...',
            notFound: 'Kelas tidak ditemukan',
            backHome: '← Beranda',
        },

        // ── ReviewPage ───────────────────────────────────────────
        review: {
            back: '← Beranda',
            setup: '⚙️ Setup',
            inputSuara: '🎤 Input Suara',
            filledOf: 'nilai terisi',
            complete: '% lengkap',
            emptyTitle: 'Data tidak lengkap',
            emptyDesc: 'Tambahkan siswa dan mata pelajaran di halaman Setup terlebih dahulu.',
            emptyBtn: '⚙️ Buka Setup',
            loading: 'Memuat nilai...',
            notFound: 'Kelas tidak ditemukan',
        },

        // ── SessionLog ───────────────────────────────────────────
        log: {
            title: '📋 Log',
            undo: '↩ Undo',
            entries: 'entri',
            empty: 'Belum ada nilai yang tercatat',
            hidden: 'tersembunyi',
        },
    },

    en: {
        // ── LandingPage ──────────────────────────────────────────
        landing: {
            badge: '✨ By Teachers, For Teachers',
            heroTitle1: 'Record Student Grades',
            heroTitle2: 'Just Use Your Voice',
            heroDesc: 'VoiceGrade helps teachers record grades quickly using voice recognition technology. Save time, reduce typos, stay focused on teaching.',
            ctaMain: '🚀 Get Started — Free',
            ctaNote: 'No login required · Data stored on your device',
            sectionFeatures: 'Everything You Need',
            sectionFeaturesDesc: 'Designed specifically for classroom grading needs.',
            sectionHow: 'How It Works',
            sectionHowDesc: 'Get started in 3 simple steps.',
            ctaBottom: 'Ready to Save Time?',
            ctaBottomDesc: 'Start recording grades by voice right now. No complex setup.',
            ctaBottomBtn: 'Open VoiceGrade →',
            openApp: 'Open App →',
            footerLocal: 'Data stored locally on your device',
            footerCredit: 'Made with ❤️ for Teachers',
        },
        features: [
            { icon: '🎤', title: 'Voice Grade Input', desc: 'Say the student name and score — it\'s recorded instantly. No typing required.' },
            { icon: '🧠', title: 'Smart Name Recognition', desc: 'The system recognizes names even when mispronounced using fuzzy matching.' },
            { icon: '📊', title: 'Automatic Grade Summary', desc: 'Total, average, and class ranking are calculated automatically.' },
            { icon: '📤', title: 'Export to Excel & CSV', desc: 'Download grade data in Excel or CSV format anytime.' },
            { icon: '💾', title: 'Backup & Restore', desc: 'Save all data to a JSON file and restore it whenever needed.' },
            { icon: '🔄', title: 'Easy Edit & Correction', desc: 'Click any incorrect grade to edit or delete it without hassle.' },
        ],
        steps: [
            { num: '1', title: 'Create Class', desc: 'Add class name, student list, and subjects.' },
            { num: '2', title: 'Start Input', desc: 'Press the mic button or Space, then say "student name, score".' },
            { num: '3', title: 'Export & Save', desc: 'Download grade summary to Excel or CSV, or backup all data.' },
        ],

        // ── HomePage ─────────────────────────────────────────────
        home: {
            subtitle: 'Voice grade input, save to Excel',
            newClass: '+ Create New Class',
            sectionTitle: 'My Classes',
            statKelas: 'Classes',
            statSiswa: 'Students',
            statNilai: 'Grades Filled',
            statSelesai: 'Complete',
            loading: 'Loading data...',
            emptyTitle: 'No classes yet',
            emptyDesc: 'Create a new class to start recording student grades by voice.',
            emptyBtn: '+ Create First Class',
            footerLocal: 'Data stored locally on your device',
            footerCredit: 'Made with ❤️ for Teachers',
            aboutApp: '← About App',
        },

        // ── SetupPage ────────────────────────────────────────────
        setup: {
            back: '← Home',
            title: '⚙️ Setup:',
            btnNilai: '📊 Grades',
            btnStart: '🎤 Start Grade Input',
            loading: 'Loading...',
            notFound: 'Class not found',
            backHome: '← Back',
            modalTitle: 'Select Subject',
            modalDesc: 'Choose a subject to fill grades for:',
            modalCancel: 'Cancel',
            modalStart: 'Start Session',
            alertSiswa: 'Please add at least 1 student first.',
            alertMapel: 'Please add at least 1 subject first.',
            confirmDeleteSiswa: (n) => `Remove "${n}" from the list?`,
            confirmDeleteMapel: (n) => `Delete "${n}" and all its grades?`,
        },

        // ── SessionPage ──────────────────────────────────────────
        session: {
            back: '← Setup',
            recorded: 'students recorded',
            viewGrades: '📊 View Grades',
            unsupported: '⚠️ Voice input requires a Chromium-based browser. You can still edit grades manually on the',
            unsupportedLink: 'View Grades',
            micHint: 'Press Space or click to start',
            micHintOff: 'Speech API not available',
            loading: 'Loading data...',
            notFound: 'Class not found',
            backHome: '← Home',
        },

        // ── ReviewPage ───────────────────────────────────────────
        review: {
            back: '← Home',
            setup: '⚙️ Setup',
            inputSuara: '🎤 Voice Input',
            filledOf: 'grades filled',
            complete: '% complete',
            emptyTitle: 'Incomplete data',
            emptyDesc: 'Please add students and subjects on the Setup page first.',
            emptyBtn: '⚙️ Open Setup',
            loading: 'Loading grades...',
            notFound: 'Class not found',
        },

        // ── SessionLog ───────────────────────────────────────────
        log: {
            title: '📋 Log',
            undo: '↩ Undo',
            entries: 'entries',
            empty: 'No grades recorded yet',
            hidden: 'hidden',
        },
    },
}
