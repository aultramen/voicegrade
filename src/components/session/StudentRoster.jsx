import './StudentRoster.css'

export default function StudentRoster({ students, grades, lastRecorded }) {
    return (
        <div className="roster">
            <div className="roster-header">
                <h3 className="roster-title">Daftar Siswa</h3>
                <span className="badge badge-gray">{Object.keys(grades).length} / {students.length}</span>
            </div>
            <div className="roster-list">
                {students.map((student) => {
                    const hasGrade = grades[student] !== undefined
                    const isLast = lastRecorded === student
                    return (
                        <div
                            key={student}
                            className={`roster-item ${hasGrade ? 'roster-item-graded' : ''} ${isLast ? 'roster-item-flash' : ''}`}
                        >
                            <span className="roster-name">{student}</span>
                            {hasGrade ? (
                                <span className="roster-score">{grades[student]}</span>
                            ) : (
                                <span className="roster-empty">—</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
