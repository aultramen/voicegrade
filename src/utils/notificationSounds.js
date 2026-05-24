const STORAGE_KEY = 'voicegrade_notification_sounds'

export const NOTIFICATION_SOUND_OPTIONS = {
    success: [
        { value: 'soft-chime', label: 'Soft chime' },
        { value: 'warm-ping', label: 'Warm ping' },
        { value: 'clean-tick', label: 'Clean tick' },
    ],
    failure: [
        { value: 'muted-dip', label: 'Muted dip' },
        { value: 'soft-knock', label: 'Soft knock' },
        { value: 'low-pulse', label: 'Low pulse' },
    ],
}

export const DEFAULT_NOTIFICATION_SOUND_SETTINGS = {
    successEnabled: true,
    failureEnabled: true,
    successSound: 'soft-chime',
    failureSound: 'muted-dip',
}

const SOUND_PATTERNS = {
    success: {
        'soft-chime': [
            { freq: 660, to: 720, start: 0, duration: 0.16, gain: 0.045, type: 'sine' },
            { freq: 880, to: 940, start: 0.12, duration: 0.22, gain: 0.04, type: 'sine' },
        ],
        'warm-ping': [
            { freq: 523.25, to: 659.25, start: 0, duration: 0.28, gain: 0.05, type: 'sine' },
        ],
        'clean-tick': [
            { freq: 740, start: 0, duration: 0.08, gain: 0.04, type: 'triangle' },
            { freq: 980, start: 0.09, duration: 0.09, gain: 0.035, type: 'triangle' },
        ],
    },
    failure: {
        'muted-dip': [
            { freq: 392, to: 293.66, start: 0, duration: 0.24, gain: 0.04, type: 'sine' },
        ],
        'soft-knock': [
            { freq: 240, start: 0, duration: 0.08, gain: 0.05, type: 'triangle' },
            { freq: 210, start: 0.13, duration: 0.1, gain: 0.035, type: 'triangle' },
        ],
        'low-pulse': [
            { freq: 330, to: 300, start: 0, duration: 0.12, gain: 0.035, type: 'sine' },
            { freq: 300, to: 270, start: 0.16, duration: 0.14, gain: 0.032, type: 'sine' },
        ],
    },
}

let audioContext = null

function getAudioContext() {
    if (typeof window === 'undefined') return null
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioContextCtor) return null
    if (!audioContext) audioContext = new AudioContextCtor()
    return audioContext
}

function isValidOption(kind, value) {
    return NOTIFICATION_SOUND_OPTIONS[kind]?.some(option => option.value === value)
}

export function loadNotificationSoundSettings() {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SOUND_SETTINGS

    try {
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
        return {
            successEnabled: typeof stored.successEnabled === 'boolean' ? stored.successEnabled : DEFAULT_NOTIFICATION_SOUND_SETTINGS.successEnabled,
            failureEnabled: typeof stored.failureEnabled === 'boolean' ? stored.failureEnabled : DEFAULT_NOTIFICATION_SOUND_SETTINGS.failureEnabled,
            successSound: isValidOption('success', stored.successSound) ? stored.successSound : DEFAULT_NOTIFICATION_SOUND_SETTINGS.successSound,
            failureSound: isValidOption('failure', stored.failureSound) ? stored.failureSound : DEFAULT_NOTIFICATION_SOUND_SETTINGS.failureSound,
        }
    } catch {
        return DEFAULT_NOTIFICATION_SOUND_SETTINGS
    }
}

export function saveNotificationSoundSettings(settings) {
    if (typeof window === 'undefined') return

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
        // Ignore storage failures; sound remains usable for this session.
    }
}

export function playNotificationSound(kind, soundKey) {
    const pattern = SOUND_PATTERNS[kind]?.[soundKey]
    if (!pattern) return

    const ctx = getAudioContext()
    if (!ctx) return

    const startAt = ctx.currentTime + 0.01
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.85, startAt)
    master.connect(ctx.destination)

    const play = () => {
        let maxEnd = 0

        pattern.forEach(note => {
            const at = startAt + note.start
            const end = at + Math.min(note.duration, 0.9)
            maxEnd = Math.max(maxEnd, note.start + note.duration)

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = note.type || 'sine'
            osc.frequency.setValueAtTime(note.freq, at)
            if (note.to) osc.frequency.exponentialRampToValueAtTime(note.to, end)

            gain.gain.setValueAtTime(0.0001, at)
            gain.gain.linearRampToValueAtTime(note.gain, at + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.0001, end)

            osc.connect(gain)
            gain.connect(master)
            osc.start(at)
            osc.stop(end + 0.03)
        })

        window.setTimeout(() => master.disconnect(), Math.min(maxEnd, 1) * 1000 + 120)
    }

    if (ctx.state === 'suspended') {
        ctx.resume().then(play).catch(() => {})
        return
    }

    play()
}
