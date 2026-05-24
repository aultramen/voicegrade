/**
 * numberParser.js — Indonesian number words → integer
 * Handles: "delapan puluh lima" → 85, "85" → 85, "sembilan" → 9
 */

const SATUAN = {
    nol: 0, satu: 1, dua: 2, tiga: 3, empat: 4,
    lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9,
    sepuluh: 10, sebelas: 11, dua_belas: 12,
}

const BELASAN = {
    sebelas: 11, duabelas: 12, tigabelas: 13, empatbelas: 14,
    limabelas: 15, enambelas: 16, tujuhbelas: 17, delapanbelas: 18,
    sembilanbelas: 19,
}

const MULTIPLIERS = {
    puluh: 10,
    ratus: 100,
    ribu: 1000,
}

/**
 * Parse Indonesian number words or digit string to integer.
 * Returns null if parsing fails.
 * @param {string} input
 * @returns {number|null}
 */
export function parseIndonesianNumber(input) {
    if (!input) return null

    const trimmed = input.trim()

    // Already a valid number (e.g. "85", "9", "100")
    const directParse = parseInt(trimmed, 10)
    if (!isNaN(directParse) && String(directParse) === trimmed) {
        return directParse
    }

    // Normalize: lowercase, remove commas, collapse spaces
    const normalized = trimmed
        .toLowerCase()
        .replace(/,/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    // Quick direct lookups
    if (SATUAN[normalized] !== undefined) return SATUAN[normalized]
    if (BELASAN[normalized] !== undefined) return BELASAN[normalized]

    // Handle "se-" prefix: seratus=100, seribu=1000, sebelas=11
    if (normalized === 'seratus') return 100
    if (normalized === 'seribu') return 1000
    if (normalized === 'dua ratus') return 200

    const words = normalized.split(' ')
    let result = 0
    let current = 0

    for (let i = 0; i < words.length; i++) {
        const word = words[i]

        if (word === 'se') {
            // e.g. "se" is a prefix like "se-ratus"
            current = 1
            continue
        }

        if (SATUAN[word] !== undefined) {
            current += SATUAN[word]
            continue
        }

        // Handle "belas" as "+10" when preceded by a satuan
        if (word === 'belas') {
            // e.g. "dua belas" → 12
            current = current === 0 ? 11 : current + 10
            continue
        }

        if (word === 'puluh') {
            current = (current === 0 ? 1 : current) * 10
            continue
        }

        if (word === 'ratus') {
            current = (current === 0 ? 1 : current) * 100
            continue
        }

        if (word === 'ribu') {
            result += (current === 0 ? 1 : current) * 1000
            current = 0
            continue
        }

        // Unknown word — try parsing as digit
        const n = parseInt(word, 10)
        if (!isNaN(n)) {
            current += n
            continue
        }
    }

    result += current

    return result > 0 ? result : null
}

/**
 * Try to extract a number from a mixed string like "delapan puluh lima" or "85"
 * Returns the first parseable number found.
 */
export function extractNumber(text) {
    // Try the whole string first
    const whole = parseIndonesianNumber(text)
    if (whole !== null) return whole

    // Try to find digit sequences
    const digitMatch = text.match(/\d+/)
    if (digitMatch) return parseInt(digitMatch[0], 10)

    return null
}
