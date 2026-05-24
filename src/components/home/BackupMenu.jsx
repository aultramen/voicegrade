import { useState } from 'react'
import { exportDatabase, importDatabase } from '../../utils/backupUtils'
import './BackupMenu.css'

export default function BackupMenu({ getAllKelas, addKelas, updateKelas, deleteKelas, onRestoreComplete }) {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(null) // { type: 'success'|'error'|'loading', msg }

    const setMsg = (type, msg) => {
        setStatus({ type, msg })
        if (type !== 'loading') setTimeout(() => setStatus(null), 4000)
    }

    // ── EXPORT ──────────────────────────────────────────────
    const handleExport = async () => {
        setOpen(false)
        setMsg('loading', 'Mengekspor data...')
        try {
            const list = await getAllKelas()
            const saved = await exportDatabase(list)
            if (saved) setMsg('success', `✅ ${list.length} kelas berhasil diekspor`)
            else setStatus(null) // cancelled
        } catch (err) {
            setMsg('error', `❌ Gagal ekspor: ${err.message}`)
        }
    }

    // ── IMPORT ──────────────────────────────────────────────
    const handleImport = async () => {
        setOpen(false)
        let backup
        try {
            backup = await importDatabase()
        } catch (err) {
            setMsg('error', `❌ ${err.message}`)
            return
        }
        if (!backup) return // cancelled

        const count = backup.data.length
        const date = new Date(backup.exportedAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        })

        const confirmed = confirm(
            `Restore backup dari ${date}?\n\n` +
            `Berisi ${count} kelas.\n\n` +
            `⚠️ SEMUA DATA SAAT INI AKAN DIGANTI. Lanjutkan?`
        )
        if (!confirmed) return

        setMsg('loading', 'Memulihkan data...')
        try {
            // 1. Delete all existing kelas
            const existing = await getAllKelas()
            for (const k of existing) {
                await deleteKelas(k.id)
            }

            // 2. Recreate each kelas from backup
            for (const k of backup.data) {
                const created = await addKelas({ nama: k.nama })
                // Restore siswa, mapel, nilai in one update
                await updateKelas(created.id, {
                    siswa: k.siswa || [],
                    mapel: k.mapel || [],
                    nilai: k.nilai || {},
                })
            }

            setMsg('success', `✅ ${count} kelas berhasil dipulihkan`)
            if (onRestoreComplete) await onRestoreComplete()
        } catch (err) {
            setMsg('error', `❌ Gagal restore: ${err.message}`)
        }
    }

    return (
        <div className="backup-menu-wrapper">
            <button
                className="btn btn-ghost btn-sm backup-trigger"
                onClick={() => setOpen(o => !o)}
                title="Backup & Restore"
            >
                💾 Backup
            </button>

            {open && (
                <>
                    <div className="backup-dropdown-backdrop" onClick={() => setOpen(false)} />
                    <div className="backup-dropdown">
                        <div className="backup-dropdown-header">Database</div>
                        <button className="backup-item" onClick={handleExport}>
                            <span className="backup-item-icon">📤</span>
                            <div>
                                <div className="backup-item-label">Export Backup</div>
                                <div className="backup-item-desc">Simpan semua data ke file JSON</div>
                            </div>
                        </button>
                        <button className="backup-item backup-item-danger" onClick={handleImport}>
                            <span className="backup-item-icon">📥</span>
                            <div>
                                <div className="backup-item-label">Import / Restore</div>
                                <div className="backup-item-desc">Ganti semua data dari file backup</div>
                            </div>
                        </button>
                    </div>
                </>
            )}

            {/* Status toast */}
            {status && (
                <div className={`backup-toast backup-toast-${status.type}`}>
                    {status.type === 'loading' && <span className="backup-spinner" />}
                    {status.msg}
                </div>
            )}
        </div>
    )
}
