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

const IconBook = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

export default function SubjectList({ items = [], onAdd, onUpdate, onDelete, onReorder }) {
    const [inputValue, setInputValue] = useState('')
    const [editIndex, setEditIndex] = useState(null)
    const [editValue, setEditValue] = useState('')

    const SUGGESTIONS = ['Matematika', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris', 'PKn', 'Agama', 'PJOK', 'Seni Budaya', 'Prakarya']

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

    const handleAdd = (val) => {
        const v = (val || inputValue).trim()
        if (!v || items.includes(v)) return
        onAdd(v)
        setInputValue('')
    }

    const handleEditSave = (idx) => {
        const v = editValue.trim()
        if (v) onUpdate(idx, v)
        setEditIndex(null)
        setEditValue('')
    }

    const unusedSuggestions = SUGGESTIONS.filter(s => !items.includes(s))

    return (
        <div className="item-list">
            <div className="item-list-header">
                <h3><IconBook /> Mata Pelajaran</h3>
                <span className="badge badge-gray">{items.length}</span>
            </div>

            {unusedSuggestions.length > 0 && (
                <div className="suggestion-chips">
                    {unusedSuggestions.slice(0, 6).map(s => (
                        <button key={s} className="chip" onClick={() => handleAdd(s)}>+ {s}</button>
                    ))}
                </div>
            )}

            <div className="item-add-row">
                <input
                    className="input"
                    placeholder="Nama mata pelajaran..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleAdd()}>Tambah</button>
            </div>

            <div className="item-list-body">
                {items.length === 0 && (
                    <div className="item-list-empty">Belum ada mata pelajaran. Tambahkan di atas atau pilih dari saran.</div>
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
