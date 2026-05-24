/**
 * backupUtils.js — Full JSON backup/restore for VoiceGrade
 * Works in both Tauri (native dialogs) and Web (browser download/file input).
 */

import { saveTextFile, openTextFile } from './env'

const BACKUP_VERSION = 1
const APP_NAME = 'VoiceGrade'

/** Validate parsed backup object */
function validateBackup(obj) {
    if (!obj || typeof obj !== 'object') return { valid: false, reason: 'File bukan JSON yang valid' }
    if (obj.app !== APP_NAME) return { valid: false, reason: 'File bukan backup VoiceGrade' }
    if (obj.version !== BACKUP_VERSION) return { valid: false, reason: `Versi backup tidak didukung (v${obj.version})` }
    if (!Array.isArray(obj.data)) return { valid: false, reason: 'Format data tidak valid' }
    return { valid: true }
}

/**
 * Export all kelas data to a JSON file.
 * Tauri → opens native save dialog.
 * Browser → triggers download.
 * @param {Array} kelasList
 * @returns {boolean}
 */
export async function exportDatabase(kelasList) {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)

    const backup = {
        app: APP_NAME,
        version: BACKUP_VERSION,
        exportedAt: now.toISOString(),
        kelasCount: kelasList.length,
        data: kelasList,
    }

    const json = JSON.stringify(backup, null, 2)
    const defaultName = `voicegrade-backup-${dateStr}.json`
    return saveTextFile(json, defaultName, 'application/json')
}

/**
 * Import a JSON backup via file dialog (Tauri) or file input (Browser).
 * Returns parsed backup object or null if cancelled.
 * Throws Error with user-friendly message on invalid file.
 */
export async function importDatabase() {
    const raw = await openTextFile('.json,application/json')
    if (raw === null) return null

    let parsed
    try {
        parsed = JSON.parse(raw)
    } catch {
        throw new Error('File tidak dapat dibaca sebagai JSON')
    }

    const { valid, reason } = validateBackup(parsed)
    if (!valid) throw new Error(reason)

    return parsed
}
