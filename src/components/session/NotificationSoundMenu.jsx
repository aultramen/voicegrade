import { useState } from 'react'
import { NOTIFICATION_SOUND_OPTIONS } from '../../utils/notificationSounds'
import './NotificationSoundMenu.css'

const IconVolume = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15 9a4 4 0 0 1 0 6" />
        <path d="M18 6a8 8 0 0 1 0 12" />
    </svg>
)

const IconPlay = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
    </svg>
)

function SoundSection({ title, enabled, sound, options, onToggle, onSoundChange, onPreview }) {
    return (
        <section className="sound-section">
            <label className="sound-toggle-row">
                <span>{title}</span>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={event => onToggle(event.target.checked)}
                />
            </label>

            <div className="sound-select-row">
                <select
                    value={sound}
                    onChange={event => onSoundChange(event.target.value)}
                    disabled={!enabled}
                    aria-label={`${title} sound`}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <button
                    type="button"
                    className="sound-preview-btn"
                    onClick={onPreview}
                    title="Preview sound"
                >
                    <IconPlay />
                </button>
            </div>
        </section>
    )
}

export default function NotificationSoundMenu({ settings, onChange, onPreview }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="sound-menu-wrapper">
            <button
                type="button"
                className="btn btn-secondary btn-sm sound-menu-trigger"
                onClick={() => setOpen(value => !value)}
                title="Pengaturan sound notifikasi"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <IconVolume />
                Sound
            </button>

            {open && (
                <>
                    <div className="sound-menu-backdrop" onClick={() => setOpen(false)} />
                    <div className="sound-menu" role="menu">
                        <div className="sound-menu-title">Sound notifikasi</div>
                        <SoundSection
                            title="Sukses"
                            enabled={settings.successEnabled}
                            sound={settings.successSound}
                            options={NOTIFICATION_SOUND_OPTIONS.success}
                            onToggle={successEnabled => onChange({ successEnabled })}
                            onSoundChange={successSound => onChange({ successSound })}
                            onPreview={() => onPreview('success')}
                        />
                        <div className="sound-menu-divider" />
                        <SoundSection
                            title="Gagal / warning"
                            enabled={settings.failureEnabled}
                            sound={settings.failureSound}
                            options={NOTIFICATION_SOUND_OPTIONS.failure}
                            onToggle={failureEnabled => onChange({ failureEnabled })}
                            onSoundChange={failureSound => onChange({ failureSound })}
                            onPreview={() => onPreview('failure')}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
