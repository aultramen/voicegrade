import './Waveform.css'

export default function Waveform({ isListening }) {
    return (
        <div className={`waveform ${isListening ? 'waveform-active' : ''}`} aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    className="waveform-bar"
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.7 + i * 0.06}s`,
                    }}
                />
            ))}
        </div>
    )
}
