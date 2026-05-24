/**
 * storage.js — localStorage CRUD helpers for VoiceGrade
 * Data is stored under a single key: "voicegrade_data"
 */

const STORAGE_KEY = 'voicegrade_data'

/** @returns {{ kelas: KelasItem[] }} */
export function getData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : { kelas: [] }
    } catch {
        return { kelas: [] }
    }
}

/** @param {{ kelas: KelasItem[] }} data */
export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** @returns {KelasItem[]} */
export function getAllKelas() {
    return getData().kelas
}

/** @param {string} id */
export function getKelasById(id) {
    return getData().kelas.find(k => k.id === id) || null
}

/** @param {{ nama: string }} opts */
export function createKelas({ nama }) {
    const data = getData()
    const newKelas = {
        id: crypto.randomUUID(),
        nama,
        siswa: [],
        mapel: [],
        nilai: {},
        createdAt: new Date().toISOString(),
    }
    data.kelas.push(newKelas)
    saveData(data)
    return newKelas
}

/** @param {string} id @param {Partial<KelasItem>} updates */
export function updateKelas(id, updates) {
    const data = getData()
    const idx = data.kelas.findIndex(k => k.id === id)
    if (idx === -1) return null
    data.kelas[idx] = { ...data.kelas[idx], ...updates }
    saveData(data)
    return data.kelas[idx]
}

/** @param {string} id */
export function deleteKelas(id) {
    const data = getData()
    data.kelas = data.kelas.filter(k => k.id !== id)
    saveData(data)
}

/**
 * Set or update a grade for a student in a subject
 * @param {string} kelasId
 * @param {string} mapel
 * @param {string} siswa
 * @param {number} nilai
 */
export function setNilai(kelasId, mapel, siswa, nilai) {
    const data = getData()
    const idx = data.kelas.findIndex(k => k.id === kelasId)
    if (idx === -1) return
    if (!data.kelas[idx].nilai[mapel]) {
        data.kelas[idx].nilai[mapel] = {}
    }
    data.kelas[idx].nilai[mapel][siswa] = nilai
    saveData(data)
}

/**
 * Delete a grade entry
 * @param {string} kelasId
 * @param {string} mapel
 * @param {string} siswa
 */
export function deleteNilai(kelasId, mapel, siswa) {
    const data = getData()
    const idx = data.kelas.findIndex(k => k.id === kelasId)
    if (idx === -1) return
    if (data.kelas[idx].nilai[mapel]) {
        delete data.kelas[idx].nilai[mapel][siswa]
        saveData(data)
    }
}

/** Export a JSON backup blob */
export function exportBackup() {
    const data = getData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voicegrade-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
}

/** Import from JSON backup string */
export function importBackup(jsonStr) {
    try {
        const data = JSON.parse(jsonStr)
        if (!data.kelas || !Array.isArray(data.kelas)) throw new Error('Invalid format')
        saveData(data)
        return true
    } catch {
        return false
    }
}
