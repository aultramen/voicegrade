/**
 * useTheme.js — Modern Minimalist Theme Hook
 * 
 * Supports 'light' and 'dark' (OLED) modes.
 * Persists user preference via localStorage. Defaults to light.
 */
import { useState, useEffect } from 'react'

function getInitialTheme() {
    try {
        const stored = localStorage.getItem('vg-theme')
        if (stored === 'light' || stored === 'dark') return stored
    } catch { /* ignore */ }
    return 'light'
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        applyTheme(theme)
        try {
            localStorage.setItem('vg-theme', theme)
        } catch { /* ignore */ }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const isDark = theme === 'dark'

    return { theme, toggleTheme, isDark }
}
