/**
 * db.js — SQLite database layer for VoiceGrade (Tauri v2)
 * Replaces localStorage-based storage.js
 * 
 * All functions are async — call with await.
 */

import Database from '@tauri-apps/plugin-sql'
import { save, open } from '@tauri-apps/plugin-dialog'
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'

let _db = null

/** Initialize (or return cached) database connection */
export async function initDb() {
    if (_db) return _db
    _db = await Database.load('sqlite:voicegrade.db')
    await _db.execute(`PRAGMA foreign_keys = ON;`)
    await _db.execute(`
        CREATE TABLE IF NOT EXISTS kelas (
            id TEXT PRIMARY KEY,
            nama TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
    `)
    await _db.execute(`
        CREATE TABLE IF NOT EXISTS siswa (
            id TEXT PRIMARY KEY,
            kelas_id TEXT NOT NULL,
            nama TEXT NOT NULL,
            urutan INTEGER NOT NULL,
            FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
        );
    `)
    await _db.execute(`
        CREATE TABLE IF NOT EXISTS mapel (
            id TEXT PRIMARY KEY,
            kelas_id TEXT NOT NULL,
            nama TEXT NOT NULL,
            urutan INTEGER NOT NULL,
            FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
        );
    `)
    await _db.execute(`
        CREATE TABLE IF NOT EXISTS nilai (
            kelas_id TEXT NOT NULL,
            mapel TEXT NOT NULL,
            siswa TEXT NOT NULL,
            nilai REAL NOT NULL,
            PRIMARY KEY (kelas_id, mapel, siswa)
        );
    `)
    return _db
}

/** Build a kelas object from rows */
async function buildKelas(db, k) {
    const siswaRows = await db.select(
        'SELECT nama FROM siswa WHERE kelas_id = ? ORDER BY urutan ASC',
        [k.id]
    )
    const mapelRows = await db.select(
        'SELECT nama FROM mapel WHERE kelas_id = ? ORDER BY urutan ASC',
        [k.id]
    )
    const nilaiRows = await db.select(
        'SELECT mapel, siswa, nilai FROM nilai WHERE kelas_id = ?',
        [k.id]
    )

    const nilaiObj = {}
    for (const row of nilaiRows) {
        if (!nilaiObj[row.mapel]) nilaiObj[row.mapel] = {}
        nilaiObj[row.mapel][row.siswa] = row.nilai
    }

    return {
        id: k.id,
        nama: k.nama,
        createdAt: k.created_at,
        siswa: siswaRows.map(r => r.nama),
        mapel: mapelRows.map(r => r.nama),
        nilai: nilaiObj,
    }
}

/** @returns {Promise<KelasItem[]>} */
export async function getAllKelas() {
    const db = await initDb()
    const rows = await db.select('SELECT * FROM kelas ORDER BY created_at ASC')
    return Promise.all(rows.map(k => buildKelas(db, k)))
}

/** @param {string} id @returns {Promise<KelasItem|null>} */
export async function getKelasById(id) {
    const db = await initDb()
    const rows = await db.select('SELECT * FROM kelas WHERE id = ?', [id])
    if (rows.length === 0) return null
    return buildKelas(db, rows[0])
}

/** @param {{ nama: string }} opts @returns {Promise<KelasItem>} */
export async function createKelas({ nama }) {
    const db = await initDb()
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await db.execute(
        'INSERT INTO kelas (id, nama, created_at) VALUES (?, ?, ?)',
        [id, nama, createdAt]
    )
    return { id, nama, createdAt, siswa: [], mapel: [], nilai: {} }
}

/**
 * Update kelas name, siswa list, or mapel list.
 * Accepts updates: { nama?, siswa?, mapel?, nilai? }
 */
export async function updateKelas(id, updates) {
    const db = await initDb()

    if (updates.nama !== undefined) {
        await db.execute('UPDATE kelas SET nama = ? WHERE id = ?', [updates.nama, id])
    }

    if (updates.siswa !== undefined) {
        await db.execute('DELETE FROM siswa WHERE kelas_id = ?', [id])
        for (let i = 0; i < updates.siswa.length; i++) {
            await db.execute(
                'INSERT INTO siswa (id, kelas_id, nama, urutan) VALUES (?, ?, ?, ?)',
                [crypto.randomUUID(), id, updates.siswa[i], i]
            )
        }
    }

    if (updates.mapel !== undefined) {
        await db.execute('DELETE FROM mapel WHERE kelas_id = ?', [id])
        for (let i = 0; i < updates.mapel.length; i++) {
            await db.execute(
                'INSERT INTO mapel (id, kelas_id, nama, urutan) VALUES (?, ?, ?, ?)',
                [crypto.randomUUID(), id, updates.mapel[i], i]
            )
        }
    }

    // If nilai map provided (e.g. after deleting a mapel), sync it
    if (updates.nilai !== undefined) {
        await db.execute('DELETE FROM nilai WHERE kelas_id = ?', [id])
        for (const [mapel, siswaMap] of Object.entries(updates.nilai)) {
            for (const [siswa, n] of Object.entries(siswaMap)) {
                await db.execute(
                    'INSERT OR REPLACE INTO nilai (kelas_id, mapel, siswa, nilai) VALUES (?, ?, ?, ?)',
                    [id, mapel, siswa, n]
                )
            }
        }
    }

    return getKelasById(id)
}

/** @param {string} id */
export async function deleteKelas(id) {
    const db = await initDb()
    await db.execute('DELETE FROM kelas WHERE id = ?', [id])
}

/**
 * Set or update a grade.
 */
export async function setNilai(kelasId, mapel, siswa, nilai) {
    const db = await initDb()
    await db.execute(
        'INSERT OR REPLACE INTO nilai (kelas_id, mapel, siswa, nilai) VALUES (?, ?, ?, ?)',
        [kelasId, mapel, siswa, nilai]
    )
}

/**
 * Delete a grade entry.
 */
export async function deleteNilai(kelasId, mapel, siswa) {
    const db = await initDb()
    await db.execute(
        'DELETE FROM nilai WHERE kelas_id = ? AND mapel = ? AND siswa = ?',
        [kelasId, mapel, siswa]
    )
}

/** Export all data as a JSON backup file (opens Tauri save dialog) */
export async function exportBackup() {
    const allKelas = await getAllKelas()
    const data = { kelas: allKelas }
    const json = JSON.stringify(data, null, 2)

    const savePath = await save({
        defaultPath: `voicegrade-backup-${new Date().toISOString().slice(0, 10)}.json`,
        filters: [{ name: 'JSON Backup', extensions: ['json'] }],
    })
    if (!savePath) return false

    await writeTextFile(savePath, json)
    return true
}

/** Import from JSON backup file (opens Tauri open dialog) */
export async function importBackup() {
    const filePath = await open({
        multiple: false,
        filters: [{ name: 'JSON Backup', extensions: ['json'] }],
    })
    if (!filePath) return false

    try {
        const content = await readTextFile(filePath)
        const data = JSON.parse(content)
        if (!data.kelas || !Array.isArray(data.kelas)) throw new Error('Invalid format')

        const db = await initDb()
        // Clear existing data
        await db.execute('DELETE FROM kelas')
        // Re-insert from backup (cascades to siswa/mapel/nilai via FK)
        for (const k of data.kelas) {
            await db.execute(
                'INSERT OR REPLACE INTO kelas (id, nama, created_at) VALUES (?, ?, ?)',
                [k.id, k.nama, k.createdAt || new Date().toISOString()]
            )
            for (let i = 0; i < (k.siswa || []).length; i++) {
                await db.execute(
                    'INSERT INTO siswa (id, kelas_id, nama, urutan) VALUES (?, ?, ?, ?)',
                    [crypto.randomUUID(), k.id, k.siswa[i], i]
                )
            }
            for (let i = 0; i < (k.mapel || []).length; i++) {
                await db.execute(
                    'INSERT INTO mapel (id, kelas_id, nama, urutan) VALUES (?, ?, ?, ?)',
                    [crypto.randomUUID(), k.id, k.mapel[i], i]
                )
            }
            for (const [mapel, siswaMap] of Object.entries(k.nilai || {})) {
                for (const [siswa, n] of Object.entries(siswaMap)) {
                    await db.execute(
                        'INSERT OR REPLACE INTO nilai (kelas_id, mapel, siswa, nilai) VALUES (?, ?, ?, ?)',
                        [k.id, mapel, siswa, n]
                    )
                }
            }
        }
        return true
    } catch {
        return false
    }
}
