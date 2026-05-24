/**
 * LangContext.jsx — App-wide language context (ID / EN)
 * Default: Indonesian. User toggle stored in localStorage.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LangContext = createContext(null)

function getInitialLang() {
    try {
        const stored = localStorage.getItem('vg-lang')
        if (stored === 'id' || stored === 'en') return stored
    } catch { /* ignore */ }
    return 'id'
}

export function LangProvider({ children }) {
    const [lang, setLang] = useState(getInitialLang)

    useEffect(() => {
        try { localStorage.setItem('vg-lang', lang) } catch { /* ignore */ }
    }, [lang])

    const toggleLang = () => setLang(l => l === 'id' ? 'en' : 'id')
    const t = translations[lang]

    return (
        <LangContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LangContext.Provider>
    )
}

export function useLang() {
    const ctx = useContext(LangContext)
    if (!ctx) throw new Error('useLang must be used inside LangProvider')
    return ctx
}
