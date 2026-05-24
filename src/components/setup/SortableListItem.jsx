/**
 * SortableListItem.jsx
 * Shared draggable row wrapper using @dnd-kit/sortable.
 * Usage: wrap each list item with this component.
 */
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableListItem({ id, children, className = '' }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`sortable-item ${isDragging ? 'dragging' : ''} ${className}`}
        >
            {/* Drag handle */}
            <span
                className="drag-handle"
                {...attributes}
                {...listeners}
                title="Drag untuk ubah urutan"
                aria-label="drag handle"
            >
                ⠿
            </span>
            {children}
        </div>
    )
}
