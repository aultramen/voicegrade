import './AmbiguityModal.css'

const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)
const IconX = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

export default function AmbiguityModal({ candidates, rawName, score, onSelect, onDismiss }) {
    return (
        <div className="modal-overlay" onClick={onDismiss}>
            <div className="ambiguity-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="ambiguity-header">
                    <div className="ambiguity-icon-wrap">
                        <IconSearch />
                    </div>
                    <div className="ambiguity-header-text">
                        <h3 className="ambiguity-title">Beberapa kandidat ditemukan</h3>
                        <p className="ambiguity-subtitle">
                            Terdeteksi: <strong className="ambiguity-raw">"{rawName}"</strong> · Nilai: <strong className="ambiguity-score-inline">{score}</strong>
                        </p>
                    </div>
                    <button className="ambiguity-close" onClick={onDismiss} aria-label="Tutup">
                        <IconX />
                    </button>
                </div>

                <p className="ambiguity-instruction">Pilih siswa yang dimaksud:</p>

                {/* Candidate buttons */}
                <div className="ambiguity-candidates">
                    {candidates.map(({ item }) => (
                        <button
                            key={item}
                            className="ambiguity-btn"
                            onClick={() => onSelect(item)}
                        >
                            <span className="ambiguity-btn-icon"><IconUser /></span>
                            <span className="ambiguity-student-name">{item}</span>
                            <span className="ambiguity-score-badge">
                                <IconCheck /> {score}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="ambiguity-footer">
                    <p className="ambiguity-hint">Atau ucapkan nama <em>lebih lengkap</em> untuk deteksi otomatis</p>
                    <button className="btn btn-ghost btn-sm" onClick={onDismiss}>
                        <IconX /> Batal (Esc)
                    </button>
                </div>
            </div>
        </div>
    )
}
