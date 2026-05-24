import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStorage } from '../hooks/useStorage'
import { useTheme } from '../hooks/useTheme'
import { useLang } from '../contexts/LangContext'
import ClassCard from '../components/home/ClassCard'
import NewClassModal from '../components/home/NewClassModal'
import BackupMenu from '../components/home/BackupMenu'
import './HomePage.css'

const IconMic = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)
const IconGlobe = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const IconBook = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
)
const IconSun = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
)
const IconMoon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
)

export default function HomePage() {
    const navigate = useNavigate()
    const { getAllKelas, addKelas, updateKelas, deleteKelas, dbReady } = useStorage()
    const { lang, toggleLang, t } = useLang()
    const { isDark, toggleTheme } = useTheme()
    const lh = t.home
    const [showModal, setShowModal] = useState(false)
    const [kelasList, setKelasList] = useState([])

    const loadKelas = useCallback(async () => {
        if (!dbReady) return
        const list = await getAllKelas()
        setKelasList(list)
    }, [getAllKelas, dbReady])

    useEffect(() => { loadKelas() }, [loadKelas])

    const handleDelete = async (id) => {
        if (confirm(lang === 'id' ? 'Hapus kelas ini beserta semua nilainya?' : 'Delete this class and all its grades?')) {
            await deleteKelas(id)
            await loadKelas()
        }
    }

    const stats = useMemo(() => {
        const totalSiswa = kelasList.reduce((s, k) => s + (k.siswa?.length || 0), 0)
        const totalSlot = kelasList.reduce((s, k) => s + (k.siswa?.length || 0) * (k.mapel?.length || 0), 0)
        const totalNilai = kelasList.reduce((s, k) =>
            s + Object.values(k.nilai || {}).reduce((a, scores) => a + Object.keys(scores || {}).length, 0), 0)
        const pct = totalSlot > 0 ? Math.round((totalNilai / totalSlot) * 100) : 0
        return { totalSiswa, totalSlot, totalNilai, pct }
    }, [kelasList])

    return (
        <div className="home-page">
            {/* ── Minimalist Header ── */}
            <header className="page-header">
                <div className="flex items-center gap-4">
                    <div className="home-logo-wrap">
                        <IconMic />
                    </div>
                    <div>
                        <h1 className="home-brand">VoiceGrade</h1>
                        <p className="home-subtitle">{lh.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light Mode" : "Dark Mode"}>
                        {isDark ? <IconSun /> : <IconMoon />}
                    </button>
                    <button className="lang-toggle" onClick={toggleLang}>
                        <IconGlobe />
                        <span>{lang === 'id' ? 'EN' : 'ID'}</span>
                    </button>
                    <BackupMenu
                        getAllKelas={getAllKelas}
                        addKelas={addKelas}
                        updateKelas={updateKelas}
                        deleteKelas={deleteKelas}
                        onRestoreComplete={loadKelas}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        <IconPlus /> {lh.newClass}
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="home-content container">
                {!dbReady ? (
                    <div className="empty-state" style={{ minHeight: '60vh' }}>
                        <div className="empty-state-icon"><div className="home-spinner" /></div>
                        <h3>{lh.loading}</h3>
                    </div>
                ) : kelasList.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '60vh' }}>
                        <div className="empty-state-icon"><IconBook /></div>
                        <h3>{lh.emptyTitle}</h3>
                        <p>{lh.emptyDesc}</p>
                        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
                            <IconPlus /> {lh.emptyBtn}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Typographic Stats Bar */}
                        <div className="home-stats-row border-bottom-heavy">
                            <div className="home-stat-card">
                                <div className="home-stat-label">{lang === 'id' ? 'Total Kelas' : 'Total Classes'}</div>
                                <div className="home-stat-value">{kelasList.length}</div>
                            </div>
                            <div className="home-stat-card">
                                <div className="home-stat-label">{lang === 'id' ? 'Total Siswa' : 'Total Students'}</div>
                                <div className="home-stat-value">{stats.totalSiswa}</div>
                            </div>
                            <div className="home-stat-card">
                                <div className="home-stat-label">{lang === 'id' ? 'Nilai Terisi' : 'Grades Filled'}</div>
                                <div className="home-stat-value">
                                    {stats.totalNilai} <span className="home-stat-sub">/ {stats.totalSlot}</span>
                                </div>
                            </div>
                            <div className="home-stat-card">
                                <div className="home-stat-label">{lang === 'id' ? 'Selesai' : 'Complete'}</div>
                                <div className="home-stat-value">{stats.pct}%</div>
                            </div>
                        </div>

                        {/* Section title */}
                        <div className="home-section-header">
                            <h2 className="home-section-title">{lh.sectionTitle}</h2>
                            <span className="badge badge-gray">{kelasList.length}</span>
                        </div>

                        <div className="class-grid">
                            {kelasList.map(kelas => (
                                <ClassCard key={kelas.id} kelas={kelas} onDelete={handleDelete} lang={lang} />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="home-footer">
                <span>© 2026 VoiceGrade · <a href="https://instagram.com/AULtramen" target="_blank" rel="noreferrer">@AULtramen</a></span>
                <button className="home-footer-link" onClick={() => navigate('/')}>{lh.aboutApp}</button>
            </footer>

            {showModal && (
                <NewClassModal onClose={async () => { setShowModal(false); await loadKelas() }} />
            )}
        </div>
    )
}
