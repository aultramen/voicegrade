/**
 * useSpeech.js — Web Speech API hook for continuous voice input
 * lang: id-ID (Indonesian)
 * Auto-restarts after each result for hands-free operation
 */

import { useRef, useState, useCallback, useEffect } from 'react'

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

export const isSpeechSupported = Boolean(SpeechRecognition)

/**
 * @param {{ onResult: (transcript: string) => void, onInterim?: (transcript: string) => void, onError?: (err: string) => void }} opts
 */
export function useSpeech({ onResult, onInterim, onError } = {}) {
    const recognitionRef = useRef(null)
    const [isListening, setIsListening] = useState(false)
    const activeRef = useRef(false) // tracks whether user wants it listening

    const setup = useCallback(() => {
        if (!SpeechRecognition) return null

        const recognition = new SpeechRecognition()
        recognition.lang = 'id-ID'
        recognition.interimResults = true
        recognition.continuous = false // we handle restart manually
        recognition.maxAlternatives = 1

        recognition.onresult = (event) => {
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                } else {
                    interimTranscript += result[0].transcript
                }
            }

            if (interimTranscript && onInterim) {
                onInterim(interimTranscript)
            }

            if (finalTranscript && onResult) {
                onResult(finalTranscript.trim())
            }
        }

        recognition.onerror = (event) => {
            // Ignore "no-speech" errors (user was quiet), just restart
            if (event.error === 'no-speech') {
                if (activeRef.current) restart()
                return
            }
            if (onError) onError(event.error)
            setIsListening(false)
            activeRef.current = false
        }

        recognition.onend = () => {
            // Auto-restart if still active
            if (activeRef.current) {
                try {
                    recognition.start()
                } catch {
                    // Recognition may still be starting
                }
            } else {
                setIsListening(false)
            }
        }

        return recognition
    }, [onResult, onInterim, onError])

    const start = useCallback(() => {
        if (!SpeechRecognition) return
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch { }
        }

        const recognition = setup()
        recognitionRef.current = recognition
        activeRef.current = true
        setIsListening(true)

        try {
            recognition.start()
        } catch { }
    }, [setup])

    const stop = useCallback(() => {
        activeRef.current = false
        setIsListening(false)
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch { }
        }
    }, [])

    const restart = useCallback(() => {
        if (!recognitionRef.current || !activeRef.current) return
        try { recognitionRef.current.start() } catch { }
    }, [])

    const toggle = useCallback(() => {
        if (isListening) stop()
        else start()
    }, [isListening, start, stop])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            activeRef.current = false
            if (recognitionRef.current) {
                try { recognitionRef.current.stop() } catch { }
            }
        }
    }, [])

    return {
        isListening,
        start,
        stop,
        toggle,
        supported: isSpeechSupported,
    }
}
