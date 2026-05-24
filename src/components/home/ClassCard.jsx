import { useNavigate } from 'react-router-dom'
import './ClassCard.css'

const IconSettings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)
const IconBarChart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const IconMic = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)
const IconGradCap = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
)

export default function ClassCard({ kelas, onDelete, lang = 'id' }) {
    const navigate = useNavigate()
    const filledCount = Object.values(kelas.nilai || {})
        .reduce((total, mapelNilai) => total + Object.keys(mapelNilai).length, 0)
    const totalPossible = kelas.siswa.length * kelas.mapel.length
    const pct = totalPossible > 0 ? Math.round((filledCount / totalPossible) * 100) : 0
    const pctColor = pct === 100 ? 'var(--clr-success)' : pct >= 50 ? 'var(--clr-primary)' : 'var(--clr-warning)'

    const dateStr = kelas.createdAt
        ? new Date(kelas.createdAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : ''

    return (
        <div className="class-card">
            {/* Top: icon + actions */}
            <div className="class-card-top">
                <div className="class-card-icon">
                    <IconGradCap />
                </div>
                <div className="class-card-actions">
                    <button className="cc-action-btn" title={lang === 'id' ? 'Setup kelas' : 'Setup class'} onClick={() => navigate(`/setup/${kelas.id}`)}>
                        <IconSettings />
                    </button>
                    <button className="cc-action-btn cc-action-danger" title={lang === 'id' ? 'Hapus kelas' : 'Delete class'} onClick={() => onDelete(kelas.id)}>
                        <IconTrash />
                    </button>
                </div>
            </div>

            {/* Name */}
            <h3 className="class-card-name">{kelas.nama}</h3>

            {/* Meta */}
            <div className="class-card-meta">
                <span className="badge badge-gray">{kelas.siswa.length} {lang === 'id' ? 'siswa' : 'students'}</span>
                <span className="badge badge-gray">{kelas.mapel.length} {lang === 'id' ? 'mapel' : 'subjects'}</span>
            </div>

            {/* Progress bar */}
            {totalPossible > 0 && (
                <div className="class-card-progress">
                    <div className="class-card-progress-header">
                        <span className="class-card-progress-label">{lang === 'id' ? 'Progres Nilai' : 'Grade Progress'}</span>
                        <span className="class-card-progress-pct" style={{ color: pctColor }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--clr-primary)' : 'var(--clr-primary)' }} />
                    </div>
                    <div className="class-card-progress-sub">{filledCount} / {totalPossible} {lang === 'id' ? 'nilai terisi' : 'grades filled'}</div>
                </div>
            )}

            {/* Footer */}
            <div className="class-card-footer">
                <span className="class-card-date">{dateStr}</span>
                <div className="class-card-btns">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/review/${kelas.id}`)}>
                        <IconBarChart /> {lang === 'id' ? 'Nilai' : 'Grades'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/setup/${kelas.id}`)}>
                        <IconMic /> {lang === 'id' ? 'Input' : 'Input'}
                    </button>
                </div>
            </div>
        </div>
    )
}
