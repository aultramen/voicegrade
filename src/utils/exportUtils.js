/**
 * exportUtils.js — Excel (SheetJS) and CSV export for VoiceGrade
 * Works in both Tauri (native save dialog) and Web (browser download).
 */

import * as XLSX from 'xlsx'
import { saveTextFile, saveBinaryFile } from './env'

/**
 * Build a 2D array for a given subject's grades
 */
function buildSheetData(kelas, mapel) {
    const header = ['No', 'Nama Siswa', mapel]
    const rows = kelas.siswa.map((siswa, idx) => {
        const nilai = kelas.nilai?.[mapel]?.[siswa]
        return [idx + 1, siswa, nilai !== undefined ? nilai : '']
    })
    return [header, ...rows]
}

/**
 * Export all subjects as sheets in a single Excel file.
 * @param {KelasItem} kelas
 * @returns {boolean} true on success, false if cancelled (Tauri native dialog)
 */
export async function exportToExcel(kelas) {
    const wb = XLSX.utils.book_new()

    if (!kelas.mapel || kelas.mapel.length === 0) {
        const ws = XLSX.utils.aoa_to_sheet([['Belum ada mata pelajaran']])
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    } else {
        kelas.mapel.forEach(mapel => {
            const data = buildSheetData(kelas, mapel)
            const ws = XLSX.utils.aoa_to_sheet(data)
            ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 12 }]
            const safeName = mapel.replace(/[\\\/\?\*\[\]]/g, '').slice(0, 31)
            XLSX.utils.book_append_sheet(wb, ws, safeName)
        })
    }

    const defaultName = `${kelas.nama.replace(/\s+/g, '_')}_nilai.xlsx`
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return saveBinaryFile(new Uint8Array(buffer), defaultName, 'Excel Workbook')
}

/**
 * Export a single subject as CSV.
 * @param {KelasItem} kelas
 * @param {string} mapel
 * @returns {boolean}
 */
export async function exportToCsv(kelas, mapel) {
    const rows = buildSheetData(kelas, mapel)
    const csvContent = rows
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

    const BOM = '\uFEFF'
    const defaultName = `${kelas.nama.replace(/\s+/g, '_')}_${mapel.replace(/\s+/g, '_')}.csv`
    return saveTextFile(BOM + csvContent, defaultName, 'text/csv;charset=utf-8;')
}
