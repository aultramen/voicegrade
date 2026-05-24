import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStorage } from '../../hooks/useStorage'

export default function NewClassModal({ onClose }) {
    const [nama, setNama] = useState('')
    const [error, setError] = useState('')
    const { addKelas } = useStorage()
    const navigate = useNavigate()

    const handleCreate = async () => {
        if (!nama.trim()) {
            setError('Nama kelas tidak boleh kosong')
            return
        }
        const kelas = await addKelas({ nama: nama.trim() })
        navigate(`/setup/${kelas.id}`)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">🏫 Buat Kelas Baru</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
                    Contoh: "Kelas 8A - Semester 1"
                </p>
                <input
                    className="input"
                    placeholder="Nama kelas..."
                    value={nama}
                    onChange={e => { setNama(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    autoFocus
                />
                {error && (
                    <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 'var(--space-2)' }}>{error}</p>
                )}
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Batal</button>
                    <button className="btn btn-primary" onClick={handleCreate}>Buat Kelas</button>
                </div>
            </div>
        </div>
    )
}
