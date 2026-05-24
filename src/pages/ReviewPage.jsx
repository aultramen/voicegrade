import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStorage } from '../hooks/useStorage'
import { useLang } from '../contexts/LangContext'
import GradeTable from '../components/review/GradeTable'
import ExportBar from '../components/review/ExportBar'
import './ReviewPage.css'

const IconBarChart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

const IconClipboard = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
)

export default function ReviewPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getKelas, dbReady } = useStorage()
    const { t } = useLang()
    const lr = t.review
    const [kelas, setKelas] = useState(null)
    const [loading, setLoading] = useState(true)

    const refreshKelas = useCallback(async () => {
        if (!dbReady) return
        const k = await getKelas(id)
        setKelas(k)
        setLoading(false)
    }, [id, getKelas, dbReady])

    useEffect(() => {
        refreshKelas()
    }, [refreshKelas])

    if (loading || !dbReady) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                </div>
                <h3>{lr.loading}</h3>
            </div>
        )
    }

    if (!kelas) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <h3>{lr.notFound}</h3>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>{lr.back}</button>
            </div>
        )
    }

    // Stats
    const totalCells = kelas.siswa.length * kelas.mapel.length
    const filledCells = Object.values(kelas.nilai || {}).reduce(
        (total, mapelNilai) => total + Object.keys(mapelNilai).length, 0
    )
    const completion = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0

    return (
        <div className="review-page">
            {/* Header */}
            <header className="page-header">
                <div className="flex items-center gap-4">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/home')}>{lr.back}</button>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}><IconBarChart /> {kelas.nama}</h1>
                        <p className="review-stats">
                            {filledCells}/{totalCells} {lr.filledOf}
                            <span className="review-completion"> · {completion}{lr.complete}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/setup/${id}`)}
                    >
                        {lr.setup}
                    </button>
                    {kelas.mapel.length > 0 && kelas.siswa.length > 0 && (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/session/${id}`)}
                        >
                            {lr.inputSuara}
                        </button>
                    )}
                </div>
            </header>

            {/* Export bar */}
            {kelas.mapel.length > 0 && kelas.siswa.length > 0 && (
                <ExportBar kelas={kelas} />
            )}

            {/* Table */}
            <main className="review-content">
                {kelas.siswa.length === 0 || kelas.mapel.length === 0 ? (
                    <div className="empty-state" style={{ flex: 1 }}>
                        <div className="empty-state-icon"><IconClipboard /></div>
                        <h3>{lr.emptyTitle}</h3>
                        <p>{lr.emptyDesc}</p>
                        <button className="btn btn-primary" onClick={() => navigate(`/setup/${id}`)}>
                            {lr.emptyBtn}
                        </button>
                    </div>
                ) : (
                    <GradeTable kelas={kelas} kelasId={id} onRefresh={refreshKelas} />
                )}
            </main>
        </div>
    )
}
