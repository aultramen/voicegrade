import { useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import './SessionLog.css'

const PAGE_SIZES = [25, 50, 100]

export default function SessionLog({ entries, onEdit, onDelete, onUndo }) {
    const [editingIdx, setEditingIdx] = useState(null)
    const [editScore, setEditScore] = useState('')
    const [pageSize, setPageSize] = useState(25)
    const { t } = useLang()
    const ll = t.log

    const handleEditSave = (entry) => {
        const val = parseInt(editScore, 10)
        if (!isNaN(val)) onEdit(entry.student, val)
        setEditingIdx(null)
        setEditScore('')
    }

    const visible = entries.slice(0, pageSize)
    const overflow = entries.length > pageSize

    return (
        <div className="session-log">
            {/* Left controls */}
            <div className="log-header">
                <span className="log-title">{ll.title}</span>
                {entries.length > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={onUndo} title={ll.undo}>
                        {ll.undo}
                    </button>
                )}
                {entries.length > 0 && (
                    <span className="log-count">{entries.length} {ll.entries}</span>
                )}
            </div>

            {/* Entries - scrollable area */}
            <div className="log-entries">
                {visible.length === 0 && (
                    <span className="log-empty">{ll.empty}</span>
                )}
                {visible.map((entry, idx) => (
                    <div key={`${entry.student}-${idx}`} className="log-entry">
                        {editingIdx === idx ? (
                            <div className="log-edit-row">
                                <span className="log-edit-name">{entry.student}</span>
                                <span>→</span>
                                <input
                                    className="input log-edit-input"
                                    type="number"
                                    value={editScore}
                                    onChange={e => setEditScore(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleEditSave(entry)
                                        if (e.key === 'Escape') setEditingIdx(null)
                                    }}
                                    autoFocus
                                />
                                <button className="btn btn-primary btn-icon btn-sm" onClick={() => handleEditSave(entry)}>✓</button>
                                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditingIdx(null)}>✕</button>
                            </div>
                        ) : (
                            <button
                                className="log-pill"
                                onClick={() => { setEditingIdx(idx); setEditScore(String(entry.score)) }}
                                title="Klik untuk edit"
                            >
                                <span className="log-pill-name">{entry.student.split(' ')[0]}</span>
                                <span className="log-pill-score">{entry.score}</span>
                            </button>
                        )}
                        <button
                            className="btn btn-ghost btn-icon btn-sm log-delete"
                            onClick={() => onDelete(entry.student)}
                            title="Hapus nilai ini"
                        >🗑️</button>
                    </div>
                ))}
                {overflow && (
                    <span className="log-overflow">+{entries.length - pageSize} {ll.hidden}</span>
                )}
            </div>

            {/* Page size selector */}
            <div className="log-pager">
                {PAGE_SIZES.map(n => (
                    <button
                        key={n}
                        className={`log-pager-btn${pageSize === n ? ' active' : ''}`}
                        onClick={() => setPageSize(n)}
                        title={`Tampikan ${n} entri`}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    )
}
