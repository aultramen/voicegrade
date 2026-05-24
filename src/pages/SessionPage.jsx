import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useStorage } from '../hooks/useStorage'
import { useLang } from '../contexts/LangContext'
import { useSpeech, isSpeechSupported } from '../hooks/useSpeech'
import { useFuzzyMatch } from '../hooks/useFuzzyMatch'
import { parseSpeechInput } from '../utils/speechParser'
import MicButton from '../components/session/MicButton'
import Waveform from '../components/session/Waveform'
import TranscriptDisplay from '../components/session/TranscriptDisplay'
import StudentRoster from '../components/session/StudentRoster'
import AmbiguityModal from '../components/session/AmbiguityModal'
import SessionLog from '../components/session/SessionLog'
import './SessionPage.css'

const IconMic = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)

const IconBarChart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

export default function SessionPage() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const mapel = searchParams.get('mapel') || ''

    const { getKelas, setNilai, deleteNilai, dbReady } = useStorage()
    const { t } = useLang()
    const ls = t.session
    const [kelas, setKelas] = useState(null)
    const [loading, setLoading] = useState(true)

    const [interim, setInterim] = useState('')
    const [lastResult, setLastResult] = useState(null)
    const [lastRecorded, setLastRecorded] = useState(null)
    const [logEntries, setLogEntries] = useState([])
    const [ambiguity, setAmbiguity] = useState(null)

    const lastRecordedTimerRef = useRef(null)

    const lastScrollTopRef = useRef(0)
    const rosterRef = useRef(null)
    const headerRef = useRef(null)
    const [headerHeight, setHeaderHeight] = useState(85) // default approx height
    const [headerVisible, setHeaderVisible] = useState(true)
    const headerVisibleRef = useRef(true)
    const isTransitioningRef = useRef(false)

    // Keep ref in sync
    useEffect(() => {
        headerVisibleRef.current = headerVisible
    }, [headerVisible])

    const { search } = useFuzzyMatch(kelas?.siswa || [])

    // Load kelas from DB
    const loadKelas = useCallback(async () => {
        if (!dbReady) return
        const k = await getKelas(id)
        setKelas(k)
        setLoading(false)
    }, [id, getKelas, dbReady])

    useEffect(() => {
        loadKelas()
    }, [loadKelas])

    // Measure exact header height once it renders
    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight)
        }
    }, [kelas])

    // Refresh kelas data after recording a grade
    const refreshKelas = useCallback(async () => {
        const k = await getKelas(id)
        setKelas(k)
    }, [id, getKelas])

    // Record a grade for a resolved student
    const recordGrade = useCallback(async (student, score) => {
        await setNilai(id, mapel, student, score)
        await refreshKelas()

        setLogEntries(prev => {
            const updated = prev.filter(e => e.student !== student)
            return [{ student, score }, ...updated].slice(0, 20)
        })

        setLastRecorded(student)
        if (lastRecordedTimerRef.current) clearTimeout(lastRecordedTimerRef.current)
        lastRecordedTimerRef.current = setTimeout(() => setLastRecorded(null), 2000)

        setLastResult({ success: true, student, score })
        setTimeout(() => setLastResult(null), 3000)
    }, [id, mapel, setNilai, refreshKelas])

    // Handle voice result
    const handleResult = useCallback((transcript) => {
        setInterim('')
        const parsed = parseSpeechInput(transcript)

        if (!parsed) {
            setLastResult({ success: false, raw: transcript, reason: 'Format tidak dikenali' })
            return
        }

        const { rawName, score } = parsed
        const matches = search(rawName)

        if (matches.length === 0) {
            setLastResult({ success: false, raw: transcript, reason: `Nama "${rawName}" tidak ditemukan` })
            return
        }

        if (matches.length === 1 || matches[0].score < 0.2) {
            setAmbiguity(null)
            recordGrade(matches[0].item, score)
            return
        }

        const topScore = matches[0].score
        const secondScore = matches[1].score
        if (matches.length > 1 && (secondScore - topScore) < 0.15) {
            setAmbiguity({ candidates: matches, rawName, score })
            return
        }

        recordGrade(matches[0].item, score)
    }, [search, recordGrade])

    const { isListening, toggle, supported } = useSpeech({
        onResult: handleResult,
        onInterim: setInterim,
    })

    // Keyboard shortcut: Space = toggle mic
    useEffect(() => {
        const onKey = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
            if (e.code === 'Space') {
                e.preventDefault()
                toggle()
            }
            if (e.code === 'Escape') {
                setAmbiguity(null)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [toggle])

    // Auto-hide header on roster scroll
    useEffect(() => {
        const el = rosterRef.current
        if (!el) return

        let timeoutId;

        const onScroll = () => {
            const st = el.scrollTop

            // If close to top, always show
            if (st < 50) {
                if (!headerVisibleRef.current && !isTransitioningRef.current) {
                    setHeaderVisible(true)
                    isTransitioningRef.current = true
                    if (timeoutId) clearTimeout(timeoutId)
                    timeoutId = setTimeout(() => { isTransitioningRef.current = false; lastScrollTopRef.current = el.scrollTop }, 300)
                }
                lastScrollTopRef.current = st
                return
            }

            // Ignore scroll changes that are fired by the browser adjusting scroll during our layout animation
            if (isTransitioningRef.current) {
                lastScrollTopRef.current = st
                return
            }

            const delta = st - lastScrollTopRef.current

            // Only trigger hide/show if scrolling passes a threshold (prevents micro-jitters)
            if (Math.abs(delta) < 15) return

            if (delta > 0 && headerVisibleRef.current) {
                // Scrolled down sufficiently -> Hide
                setHeaderVisible(false)
                isTransitioningRef.current = true
                if (timeoutId) clearTimeout(timeoutId)
                timeoutId = setTimeout(() => { isTransitioningRef.current = false; lastScrollTopRef.current = el.scrollTop }, 300)
            } else if (delta < 0 && !headerVisibleRef.current) {
                // Scrolled up sufficiently -> Show
                setHeaderVisible(true)
                isTransitioningRef.current = true
                if (timeoutId) clearTimeout(timeoutId)
                timeoutId = setTimeout(() => { isTransitioningRef.current = false; lastScrollTopRef.current = el.scrollTop }, 300)
            }
            lastScrollTopRef.current = st
        }

        el.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            el.removeEventListener('scroll', onScroll)
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [kelas]) // re-attach after kelas loads

    // Cleanup timer on unmount
    useEffect(() => () => {
        if (lastRecordedTimerRef.current) clearTimeout(lastRecordedTimerRef.current)
    }, [])

    // Redirect to setup if mapel param is missing
    useEffect(() => {
        if (!mapel) {
            navigate(`/setup/${id}`)
        }
    }, [mapel, id, navigate])

    // --- Log actions ---
    const handleLogEdit = async (student, newScore) => {
        await setNilai(id, mapel, student, newScore)
        await refreshKelas()
        setLogEntries(prev => prev.map(e => e.student === student ? { ...e, score: newScore } : e))
    }

    const handleLogDelete = async (student) => {
        await deleteNilai(id, mapel, student)
        await refreshKelas()
        setLogEntries(prev => prev.filter(e => e.student !== student))
    }

    const handleUndo = () => {
        if (logEntries.length === 0) return
        const last = logEntries[0]
        handleLogDelete(last.student)
    }

    const handleAmbiguitySelect = (student) => {
        recordGrade(student, ambiguity.score)
        setAmbiguity(null)
    }

    if (loading || !dbReady) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                </div>
                <h3>Memuat sesi...</h3>
            </div>
        )
    }

    if (!kelas) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">X</div>
                <h3>{ls.notFound}</h3>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>{ls.backHome}</button>
            </div>
        )
    }

    if (!mapel) return null

    const currentGrades = kelas.nilai?.[mapel] || {}
    const progress = Object.keys(currentGrades).length
    const total = kelas.siswa.length

    return (
        <div className="session-page">
            {/* Header */}
            <header
                ref={headerRef}
                className={`session-header${headerVisible ? '' : ' session-header-hidden'}`}
                style={{ marginTop: headerVisible ? '0px' : `-${headerHeight}px` }}
            >
                <div className="flex items-center gap-4">
                    <button className="btn btn-secondary btn-sm" onClick={() => { if (isListening) toggle(); navigate(`/setup/${id}`) }}>{ls.back}</button>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}><IconMic /> {mapel}</h1>
                        <p className="session-class-name">{kelas.nama}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="session-progress">
                        <span className="session-progress-count">{progress}<span>/{total}</span></span>
                        <span className="session-progress-label">{ls.recorded}</span>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/review/${id}`)}
                    >
                        <IconBarChart /> Lihat Nilai
                    </button>
                </div>
            </header>

            {/* Browser not supported warning */}
            {!supported && (
                <div className="session-unsupported">
                    {ls.unsupported} <strong>{ls.unsupportedLink}</strong>.
                </div>
            )}

            {/* Main content */}
            <div className="session-body">
                {/* Left: Voice control */}
                <div
                    className="session-voice-panel"
                    onWheel={(e) => {
                        if (rosterRef.current) {
                            rosterRef.current.scrollTop += e.deltaY
                        }
                    }}
                >
                    <div className="session-mic-area">
                        <Waveform isListening={isListening} />
                        <MicButton isListening={isListening} onToggle={toggle} disabled={!supported} />
                        <p className="session-mic-hint">
                            {supported ? ls.micHint : ls.micHintOff}
                        </p>
                    </div>
                    <div className="session-transcript-area">
                        <TranscriptDisplay interim={interim} lastResult={lastResult} />
                    </div>
                </div>

                {/* Right: Student roster */}
                <div className="session-roster-panel" ref={rosterRef}>
                    <StudentRoster
                        students={kelas.siswa}
                        grades={currentGrades}
                        lastRecorded={lastRecorded}
                    />
                </div>
            </div>

            {/* Log bar */}
            <SessionLog
                entries={logEntries}
                onEdit={handleLogEdit}
                onDelete={handleLogDelete}
                onUndo={handleUndo}
            />

            {/* Ambiguity modal */}
            {ambiguity && (
                <AmbiguityModal
                    candidates={ambiguity.candidates}
                    rawName={ambiguity.rawName}
                    score={ambiguity.score}
                    onSelect={handleAmbiguitySelect}
                    onDismiss={() => setAmbiguity(null)}
                />
            )}
        </div>
    )
}
