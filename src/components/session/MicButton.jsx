import './MicButton.css'

const IconMic = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)
const IconMicOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)

export default function MicButton({ isListening, onToggle, disabled }) {
    return (
        <button
            className={`mic-btn ${isListening ? 'mic-btn-active' : ''} ${disabled ? 'mic-btn-disabled' : ''}`}
            onClick={onToggle}
            disabled={disabled}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
            <span className="mic-btn-icon">
                {isListening ? <IconMic /> : <IconMicOff />}
            </span>
        </button>
    )
}
