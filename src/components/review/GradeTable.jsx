import { useState, useMemo } from 'react'
import { useStorage } from '../../hooks/useStorage'
import './GradeTable.css'

const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

/** Compute per-student stats and ranking */
function computeStats(kelas) {
    const stats = kelas.siswa.map(siswa => {
        const scores = kelas.mapel
            .map(m => kelas.nilai?.[m]?.[siswa])
            .filter(v => v !== undefined)
        const jumlah = scores.reduce((a, b) => a + b, 0)
        const count = scores.length
        const rataRata = count > 0 ? jumlah / count : null
        return { siswa, jumlah, rataRata, count }
    })

    // Rank by rata-rata descending; students with no grades get null rank
    const sorted = [...stats].sort((a, b) => {
        if (a.rataRata === null && b.rataRata === null) return 0
        if (a.rataRata === null) return 1
        if (b.rataRata === null) return -1
        return b.rataRata - a.rataRata
    })

    let rank = 1
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].rataRata === null) {
            sorted[i].peringkat = null
        } else {
            if (i > 0 && sorted[i].rataRata !== sorted[i - 1].rataRata) {
                rank = i + 1
            }
            sorted[i].peringkat = rank
        }
    }

    // Return keyed by siswa name
    return Object.fromEntries(sorted.map(s => [s.siswa, s]))
}

export default function GradeTable({ kelas, kelasId, onRefresh }) {
    const { setNilai, deleteNilai } = useStorage()
    const [editCell, setEditCell] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [contextMenu, setContextMenu] = useState(null)

    const statsMap = useMemo(() => computeStats(kelas), [kelas])

    const handleCellClick = (siswa, mapel) => {
        const current = kelas.nilai?.[mapel]?.[siswa]
        setEditCell({ siswa, mapel })
        setEditValue(current !== undefined ? String(current) : '')
    }

    const handleSave = async () => {
        if (!editCell) return
        const val = parseInt(editValue, 10)
        if (!isNaN(val)) {
            await setNilai(kelasId, editCell.mapel, editCell.siswa, val)
            if (onRefresh) await onRefresh()
        }
        setEditCell(null)
        setEditValue('')
    }

    const handleContextMenu = (e, siswa, mapel) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY, siswa, mapel })
    }

    const closeContext = () => setContextMenu(null)

    const handleContextDelete = async () => {
        if (!contextMenu) return
        await deleteNilai(kelasId, contextMenu.mapel, contextMenu.siswa)
        if (onRefresh) await onRefresh()
        closeContext()
    }

    const handleContextEdit = () => {
        if (!contextMenu) return
        handleCellClick(contextMenu.siswa, contextMenu.mapel)
        closeContext()
    }

    const rankLabelClass = (rank) => {
        if (rank === 1) return 'rank-top rank-1'
        if (rank === 2) return 'rank-top rank-2'
        if (rank === 3) return 'rank-top rank-3'
        return ''
    }

    return (
        <div className="grade-table-wrapper" onClick={closeContext}>
            <table className="grade-table">
                <thead>
                    <tr>
                        <th className="grade-th grade-th-sticky">No</th>
                        <th className="grade-th grade-th-name grade-th-sticky">Nama Siswa</th>

                        {/* Grade columns per subject */}
                        {kelas.mapel.map(m => (
                            <th key={m} className="grade-th">{m}</th>
                        ))}

                        {/* Summary columns */}
                        <th className="grade-th summary-th summary-th-divider">Jumlah</th>
                        <th className="grade-th summary-th">Rata-rata</th>
                        <th className="grade-th summary-th">Peringkat</th>
                    </tr>
                </thead>
                <tbody>
                    {kelas.siswa.map((siswa, idx) => {
                        const st = statsMap[siswa]

                        return (
                            <tr key={siswa} className="grade-row">
                                <td className="grade-td grade-td-num">{idx + 1}</td>
                                <td className="grade-td grade-td-name">{siswa}</td>

                                {/* Grade cells */}
                                {kelas.mapel.map(mapel => {
                                    const val = kelas.nilai?.[mapel]?.[siswa]
                                    const isEditing = editCell?.siswa === siswa && editCell?.mapel === mapel
                                    const isEmpty = val === undefined

                                    return (
                                        <td
                                            key={mapel}
                                            className={`grade-td grade-td-cell ${isEmpty ? 'empty' : 'filled'} ${isEditing ? 'editing' : ''}`}
                                            onContextMenu={e => handleContextMenu(e, siswa, mapel)}
                                        >
                                            {isEditing ? (
                                                <input
                                                    className="grade-cell-input"
                                                    type="number"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') handleSave()
                                                        if (e.key === 'Escape') setEditCell(null)
                                                    }}
                                                    onBlur={handleSave}
                                                    autoFocus
                                                    min={0}
                                                    max={100}
                                                />
                                            ) : (
                                                <button
                                                    className="grade-cell-btn"
                                                    onClick={() => handleCellClick(siswa, mapel)}
                                                    title="Klik untuk edit"
                                                >
                                                    {isEmpty ? <span className="grade-empty-marker">–</span> : val}
                                                </button>
                                            )}
                                        </td>
                                    )
                                })}

                                {/* Summary cells */}
                                <td className="grade-td summary-td summary-td-divider">
                                    {st.count > 0 ? (
                                        <span className="summary-value summary-jumlah">{st.jumlah}</span>
                                    ) : (
                                        <span className="grade-empty-marker">–</span>
                                    )}
                                </td>
                                <td className="grade-td summary-td">
                                    {st.rataRata !== null ? (
                                        <span className="summary-value summary-rata">
                                            {st.rataRata % 1 === 0
                                                ? st.rataRata
                                                : st.rataRata.toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="grade-empty-marker">–</span>
                                    )}
                                </td>
                                <td className="grade-td summary-td">
                                    {st.peringkat !== null ? (
                                        <span className={`summary-rank ${rankLabelClass(st.peringkat)}`}>
                                            <span className="rank-num">#{st.peringkat}</span>
                                        </span>
                                    ) : (
                                        <span className="grade-empty-marker">–</span>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* Right-click context menu */}
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="context-item" onClick={handleContextEdit}><IconEdit /> Edit Nilai</button>
                    <button className="context-item context-item-danger" onClick={handleContextDelete}><IconTrash /> Hapus Nilai</button>
                </div>
            )}
        </div>
    )
}
