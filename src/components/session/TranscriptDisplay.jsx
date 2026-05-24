import './TranscriptDisplay.css'

const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const IconX = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const IconArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
)

export default function TranscriptDisplay({ interim, lastResult }) {
    return (
        <div className="transcript-display">
            {interim && (
                <div className="transcript-interim">
                    <span className="transcript-listening-dot" />
                    <span className="transcript-interim-text">{interim}</span>
                </div>
            )}

            {lastResult && !interim && (
                <div className={`transcript-result ${lastResult.success ? 'transcript-success' : 'transcript-error'}`}>
                    <div className="transcript-result-icon">
                        {lastResult.success ? <IconCheck /> : <IconX />}
                    </div>
                    {lastResult.success ? (
                        <div className="transcript-result-body">
                            <span className="transcript-name">{lastResult.student}</span>
                            <span className="transcript-arrow"><IconArrow /></span>
                            <span className="transcript-score">{lastResult.score}</span>
                        </div>
                    ) : (
                        <div className="transcript-result-body">
                            <span className="transcript-raw">"{lastResult.raw}"</span>
                            {lastResult.reason && <span className="transcript-reason">{lastResult.reason}</span>}
                        </div>
                    )}
                </div>
            )}

            {!interim && !lastResult && (
                <div className="transcript-placeholder">
                    Ucapkan: <em>"Budi, 85"</em>
                </div>
            )}
        </div>
    )
}
