import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useLang } from '../contexts/LangContext'
import './LandingPage.css'

/* ── Inline SVG Icons ─────────────────────────────────────── */
const IconMic = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
)
const IconBrain = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    </svg>
)
const IconBarChart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const IconDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)
const IconShield = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const IconGlobe = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)
const IconArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
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

const FEATURES = [
    { icon: <IconMic />, key: 'voice' },
    { icon: <IconBrain />, key: 'smart' },
    { icon: <IconBarChart />, key: 'recap' },
    { icon: <IconDownload />, key: 'export' },
    { icon: <IconShield />, key: 'backup' },
    { icon: <IconEdit />, key: 'edit' },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const { lang, toggleLang, t } = useLang()
    const { isDark, toggleTheme } = useTheme()
    const l = t.landing

    return (
        <div className="landing">
            {/* ── Navbar ── */}
            <nav className="landing-nav">
                <div className="landing-nav-inner container">
                    <div className="landing-logo">
                        <div className="landing-logo-icon">
                            <IconMic />
                        </div>
                        <span className="landing-logo-text">VoiceGrade</span>
                    </div>
                    <div className="landing-nav-right">
                        <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light Mode" : "Dark Mode"}>
                            {isDark ? <IconSun /> : <IconMoon />}
                        </button>
                        <button className="lang-toggle" onClick={toggleLang} title={lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}>
                            <IconGlobe />
                            <span>{lang === 'id' ? 'EN' : 'ID'}</span>
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/home')}>
                            {l.openApp}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Minimalist Hero ── */}
            <section className="landing-hero">
                <div className="container landing-hero-inner">
                    <div className="landing-hero-content">
                        <div className="badge badge-gray landing-badge">{l.badge}</div>
                        <h1 className="landing-hero-title">
                            {l.heroTitle1} <span className="landing-hero-accent">{l.heroTitle2}</span>
                        </h1>
                        <p className="landing-hero-desc">{l.heroDesc}</p>
                        <div className="landing-hero-cta">
                            <button className="btn btn-primary btn-xl" onClick={() => navigate('/home')}>
                                {l.ctaMain} <IconArrow />
                            </button>
                        </div>
                        {/* minimalist trust line */}
                        <div className="landing-trust-line">
                            <span>{lang === 'id' ? 'Gratis selamanya' : 'Free forever'}</span>
                            <span className="trust-dot">•</span>
                            <span>{lang === 'id' ? 'Tanpa login' : 'No login'}</span>
                            <span className="trust-dot">•</span>
                            <span>{lang === 'id' ? 'Data tersimpan di perangkat lokal' : 'Local data storage'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features Grid (Minimalist) ── */}
            <section className="landing-section" id="features">
                <div className="container container-sm">
                    <div className="section-header">
                        <h2 className="section-title">{l.sectionFeatures}</h2>
                        <p className="section-desc">{l.sectionFeaturesDesc}</p>
                    </div>
                    <div className="feature-grid">
                        {FEATURES.map((f, i) => {
                            const feat = t.features[i]
                            return (
                                <div key={feat.title} className="feature-item">
                                    <div className="feature-icon-wrap">{f.icon}</div>
                                    <h3 className="feature-title">{feat.title}</h3>
                                    <p className="feature-desc">{feat.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── How it works (Direct list) ── */}
            <section className="landing-section">
                <div className="container container-sm">
                    <div className="section-header">
                        <h2 className="section-title">{l.sectionHow}</h2>
                    </div>
                    <div className="steps-list">
                        {t.steps.map((s) => (
                            <div key={s.num} className="step-item">
                                <div className="step-number">{s.num}</div>
                                <div className="step-text">
                                    <h3 className="step-title">{s.title}</h3>
                                    <p className="step-desc">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Final ── */}
            <section className="landing-cta-section">
                <div className="container container-sm landing-cta-inner">
                    <h2 className="landing-cta-title">{l.ctaBottom}</h2>
                    <p className="landing-cta-desc">{l.ctaBottomDesc}</p>
                    <button className="btn btn-primary btn-xl" onClick={() => navigate('/home')}>
                        {l.ctaBottomBtn} <IconArrow />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="container landing-footer-inner">
                    <div className="landing-logo">
                        <span className="landing-logo-text" style={{ fontSize: '1rem' }}>VoiceGrade</span>
                    </div>
                    <span className="landing-footer-copy">© 2026 VoiceGrade · <a href="https://instagram.com/AULtramen" target="_blank" rel="noreferrer">@AULtramen</a></span>
                </div>
            </footer>
        </div>
    )
}
