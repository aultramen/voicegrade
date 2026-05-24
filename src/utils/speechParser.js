/**
 * speechParser.js — Parse voice transcript into { name, score }
 * Handles: "Budi, 85" / "Budi delapan puluh lima" / "Budi, delapan puluh lima"
 */

import { extractNumber } from './numberParser'

const NUMBER_WORDS = [
    'nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan',
    'sembilan', 'sepuluh', 'sebelas', 'belas', 'puluh', 'ratus', 'ribu', 'se',
]

function hasNumberToken(tokens) {
    return tokens.some(token => {
        const normalized = token.toLowerCase().replace(/[^\w]/g, '')
        return /^\d+$/.test(normalized) || NUMBER_WORDS.includes(normalized)
    })
}

/**
 * Parse a speech transcript into name and score components.
 *
 * Strategy:
 * 1. Split on comma (if present): left=name, right=score
 * 2. Without comma: find the boundary between name tokens and number tokens
 *    using keyword detection (number words / digits)
 *
 * @param {string} transcript
 * @returns {{ rawName: string, rawScore: string, score: number } | null}
 */
export function parseSpeechInput(transcript) {
    if (!transcript || transcript.trim().length < 2) return null

    const clean = transcript.trim()

    // Strategy 1: comma separator
    const commaIdx = clean.indexOf(',')
    if (commaIdx > 0) {
        const rawName = clean.slice(0, commaIdx).trim()
        const rawScore = clean.slice(commaIdx + 1).trim()
        const score = extractNumber(rawScore)
        if (rawName && score !== null) {
            return { rawName, rawScore, score }
        }
    }

    // Strategy 2: scan tokens for the first number-related word
    const tokens = clean.split(/\s+/)
    let splitIndex = -1

    for (let i = 1; i < tokens.length; i++) {
        const t = tokens[i].toLowerCase()
        // If token is a digit string or a number word
        if (/^\d+$/.test(t) || NUMBER_WORDS.includes(t)) {
            splitIndex = i
            break
        }
    }

    if (splitIndex > 0) {
        const rawName = tokens.slice(0, splitIndex).join(' ')
        const rawScore = tokens.slice(splitIndex).join(' ')
        const score = extractNumber(rawScore)
        if (rawName && score !== null) {
            return { rawName, rawScore, score }
        }
    }

    // Strategy 3: last token as score
    if (tokens.length >= 2) {
        const lastToken = tokens[tokens.length - 1]
        const score = extractNumber(lastToken)
        if (score !== null) {
            const rawName = tokens.slice(0, -1).join(' ')
            return { rawName, rawScore: lastToken, score }
        }
    }

    return null
}

/**
 * Explain why a transcript could not be parsed.
 * Used for user-facing warnings and failure notification sounds.
 *
 * @param {string} transcript
 * @returns {string}
 */
export function getSpeechInputIssue(transcript) {
    if (!transcript || transcript.trim().length === 0) {
        return 'Suara belum terdengar'
    }

    const clean = transcript.trim()
    const tokens = clean.split(/\s+/)
    const number = extractNumber(clean)

    if (tokens.length === 1 && number !== null) {
        return 'Nama siswa belum terdengar'
    }

    if (!hasNumberToken(tokens) && number === null) {
        return 'Nilai belum terdengar'
    }

    if (tokens.length < 2) {
        return 'Nama siswa atau nilai belum lengkap'
    }

    return 'Format tidak dikenali'
}
