import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStorage } from '../hooks/useStorage'
import { useLang } from '../contexts/LangContext'
import StudentList from '../components/setup/StudentList'
import SubjectList from '../components/setup/SubjectList'
import './SetupPage.css'

export default function SetupPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getKelas, updateKelas, dbReady } = useStorage()
    const { t } = useLang()
    const ls = t.setup
    const [kelas, setKelas] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subjectSelectModal, setSubjectSelectModal] = useState(false)
    const [selectedMapel, setSelectedMapel] = useState('')

    const loadKelas = useCallback(async () => {
        if (!dbReady) return
        const k = await getKelas(id)
        setKelas(k)
        setLoading(false)
    }, [id, getKelas, dbReady])

    useEffect(() => {
        loadKelas()
    }, [loadKelas])

    if (loading || !dbReady) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">⏳</div>
                <h3>{ls.loading}</h3>
            </div>
        )
    }

    if (!kelas) {
        return (
            <div className="empty-state" style={{ height: '100vh' }}>
                <div className="empty-state-icon">❌</div>
                <h3>{ls.notFound}</h3>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>{ls.backHome}</button>
            </div>
        )
    }

    // --- Student handlers ---
    const addSiswa = async (nama) => {
        if (kelas.siswa.includes(nama)) return
        const updated = await updateKelas(id, { siswa: [...kelas.siswa, nama] })
        setKelas(updated)
    }

    const updateSiswa = async (idx, nama) => {
        const arr = [...kelas.siswa]
        arr[idx] = nama
        const updated = await updateKelas(id, { siswa: arr })
        setKelas(updated)
    }

    const deleteSiswa = async (idx) => {
        if (!confirm(ls.confirmDeleteSiswa(kelas.siswa[idx]))) return
        const arr = kelas.siswa.filter((_, i) => i !== idx)
        const updated = await updateKelas(id, { siswa: arr })
        setKelas(updated)
    }

    const bulkAddSiswa = async (names) => {
        const unique = names.filter(n => !kelas.siswa.includes(n))
        const updated = await updateKelas(id, { siswa: [...kelas.siswa, ...unique] })
        setKelas(updated)
    }

    const reorderSiswa = async (newOrder) => {
        const updated = await updateKelas(id, { siswa: newOrder })
        setKelas(updated)
    }

    // --- Subject handlers ---
    const addMapel = async (mapel) => {
        if (kelas.mapel.includes(mapel)) return
        const updated = await updateKelas(id, { mapel: [...kelas.mapel, mapel] })
        setKelas(updated)
    }

    const updateMapel = async (idx, mapel) => {
        const arr = [...kelas.mapel]
        arr[idx] = mapel
        const updated = await updateKelas(id, { mapel: arr })
        setKelas(updated)
    }

    const deleteMapel = async (idx) => {
        if (!confirm(ls.confirmDeleteMapel(kelas.mapel[idx]))) return
        const arr = kelas.mapel.filter((_, i) => i !== idx)
        const updatedNilai = { ...kelas.nilai }
        delete updatedNilai[kelas.mapel[idx]]
        const updated = await updateKelas(id, { mapel: arr, nilai: updatedNilai })
        setKelas(updated)
    }

    const reorderMapel = async (newOrder) => {
        const updated = await updateKelas(id, { mapel: newOrder })
        setKelas(updated)
    }

    const handleStartSession = () => {
        if (kelas.siswa.length === 0) {
            alert(ls.alertSiswa)
            return
        }
        if (kelas.mapel.length === 0) {
            alert(ls.alertMapel)
            return
        }
        if (kelas.mapel.length === 1) {
            navigate(`/session/${id}?mapel=${encodeURIComponent(kelas.mapel[0])}`)
        } else {
            setSelectedMapel(kelas.mapel[0])
            setSubjectSelectModal(true)
        }
    }

    return (
        <div className="setup-page">
            {/* Header */}
            <header className="page-header">
                <div className="flex items-center gap-4">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>{ls.back}</button>
                    <div>
                        <h1>⚙️ Setup: {kelas.nama}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/review/${id}`)}
                    >
                        {ls.btnNilai}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleStartSession}
                    >
                        {ls.btnStart}
                    </button>
                </div>
            </header>


            {/* Two-column layout */}
            <main className="setup-content container">
                <div className="setup-grid">
                    <div className="card setup-panel">
                        <StudentList
                            items={kelas.siswa}
                            onAdd={addSiswa}
                            onUpdate={updateSiswa}
                            onDelete={deleteSiswa}
                            onBulkAdd={bulkAddSiswa}
                            onReorder={reorderSiswa}
                        />
                    </div>
                    <div className="card setup-panel">
                        <SubjectList
                            items={kelas.mapel}
                            onAdd={addMapel}
                            onUpdate={updateMapel}
                            onDelete={deleteMapel}
                            onReorder={reorderMapel}
                        />
                    </div>
                </div>
            </main>

            {/* Subject selection modal */}
            {subjectSelectModal && (
                <div className="modal-overlay" onClick={() => setSubjectSelectModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">{ls.modalTitle}</h2>
                        <p style={{ color: 'var(--tx-muted)', fontSize: '0.875rem', marginBottom: 'var(--sp-4)' }}>
                            {ls.modalDesc}
                        </p>
                        <div className="flex flex-col gap-2">
                            {kelas.mapel.map(m => (
                                <button
                                    key={m}
                                    className={`btn ${selectedMapel === m ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setSelectedMapel(m)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSubjectSelectModal(false)}>{ls.modalCancel}</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setSubjectSelectModal(false)
                                    navigate(`/session/${id}?mapel=${encodeURIComponent(selectedMapel)}`)
                                }}
                            >
                                {ls.modalStart}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
