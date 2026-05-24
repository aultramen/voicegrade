import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import SortableListItem from './SortableListItem'
import './ItemList.css'

const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const IconClipboard = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
)

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

const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const IconX = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

export default function StudentList({ items = [], onAdd, onUpdate, onDelete, onBulkAdd, onReorder }) {
    const [inputValue, setInputValue] = useState('')
    const [editIndex, setEditIndex] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [bulkMode, setBulkMode] = useState(false)
    const [bulkText, setBulkText] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            onReorder(arrayMove(items, oldIndex, newIndex))
        }
    }

    const handleAdd = () => {
        const v = inputValue.trim()
        if (!v) return
        onAdd(v)
        setInputValue('')
    }

    const handleEditSave = (idx) => {
        const v = editValue.trim()
        if (v) onUpdate(idx, v)
        setEditIndex(null)
        setEditValue('')
    }

    const handleBulkImport = () => {
        const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        if (lines.length > 0) {
            onBulkAdd(lines)
            setBulkText('')
            setBulkMode(false)
        }
    }

    return (
        <div className="item-list">
            <div className="item-list-header">
                <h3><IconUsers /> Daftar Siswa</h3>
                <span className="badge badge-gray">{items.length}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setBulkMode(!bulkMode)}>
                    {bulkMode ? <><IconX /> Tutup</> : <><IconClipboard /> Bulk Import</>}
                </button>
            </div>

            {bulkMode && (
                <div className="bulk-area">
                    <p className="bulk-hint">Copy kolom nama dari Excel, paste di sini (satu nama per baris):</p>
                    <textarea
                        className="input"
                        rows={6}
                        placeholder={'Ahmad Budi\nSiti Rahayu\nDeni Santoso\n...'}
                        value={bulkText}
                        onChange={e => setBulkText(e.target.value)}
                    />
                    <div className="flex gap-2" style={{ marginTop: 'var(--sp-2)' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleBulkImport}>
                            Import {bulkText.split('\n').filter(l => l.trim()).length} Nama
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setBulkMode(false); setBulkText('') }}>
                            Batal
                        </button>
                    </div>
                </div>
            )}

            <div className="item-add-row">
                <input
                    className="input"
                    placeholder="Ketik nama siswa, Enter untuk tambah..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button className="btn btn-primary btn-sm" onClick={handleAdd}>Tambah</button>
            </div>

            <div className="item-list-body">
                {items.length === 0 && (
                    <div className="item-list-empty">Belum ada siswa. Tambahkan di atas atau gunakan bulk import.</div>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item, idx) => (
                            <SortableListItem key={item} id={item}>
                                <span className="item-number">{idx + 1}</span>
                                {editIndex === idx ? (
                                    <input
                                        className="input"
                                        style={{ flex: 1, padding: 'var(--sp-1) var(--sp-2)' }}
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleEditSave(idx)
                                            if (e.key === 'Escape') setEditIndex(null)
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="item-label">{item}</span>
                                )}
                                <div className="item-actions">
                                    {editIndex === idx ? (
                                        <>
                                            <button className="btn btn-primary btn-icon btn-sm" onClick={() => handleEditSave(idx)}><IconCheck /></button>
                                            <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setEditIndex(null)}><IconX /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-secondary btn-icon btn-sm" onClick={() => { setEditIndex(idx); setEditValue(item) }}><IconEdit /></button>
                                            <button className="btn btn-secondary btn-icon btn-sm" onClick={() => onDelete(idx)}><IconTrash /></button>
                                        </>
                                    )}
                                </div>
                            </SortableListItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    )
}
