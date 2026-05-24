import { useState } from 'react'
import { exportToExcel, exportToCsv } from '../../utils/exportUtils'
import './ExportBar.css'

const IconFileSpreadsheet = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)
const IconFileText = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

export default function ExportBar({ kelas }) {
    const [showCsvPicker, setShowCsvPicker] = useState(false)
    const [selectedMapel, setSelectedMapel] = useState(kelas.mapel[0] || '')

    const handleExcelExport = async () => { await exportToExcel(kelas) }

    const handleCsvExport = async () => {
        if (kelas.mapel.length === 1) {
            await exportToCsv(kelas, kelas.mapel[0])
        } else {
            setSelectedMapel(kelas.mapel[0])
            setShowCsvPicker(true)
        }
    }

    const handleCsvConfirm = async () => {
        await exportToCsv(kelas, selectedMapel)
        setShowCsvPicker(false)
    }

    return (
        <div className="export-bar">
            <span className="export-label">Export:</span>
            <div className="export-buttons">
                <button className="btn btn-primary btn-sm" onClick={handleExcelExport}>
                    <IconFileSpreadsheet /> Excel
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCsvExport}>
                    <IconFileText /> CSV
                </button>
            </div>

            {showCsvPicker && (
                <div className="modal-overlay" onClick={() => setShowCsvPicker(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Pilih Mata Pelajaran (CSV)</h2>
                        <div className="flex flex-col gap-2" style={{ marginTop: 'var(--sp-4)' }}>
                            {kelas.mapel.map(m => (
                                <button key={m}
                                    className={`btn ${selectedMapel === m ? 'btn-teal' : 'btn-ghost'}`}
                                    onClick={() => setSelectedMapel(m)}
                                >{m}</button>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowCsvPicker(false)}>Batal</button>
                            <button className="btn btn-primary" onClick={handleCsvConfirm}>Simpan CSV</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
