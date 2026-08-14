const db = require("../config/db");

async function getStudentNotes(userId) {
    const [rows] = await db.query(
        `SELECT n.note_id, n.title, n.description, n.file_path, n.created_at,
                s.subject_name, u_teacher.full_name AS teacher_name
         FROM notes n
         JOIN teacher_subject ts ON n.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u_teacher ON tr.user_id = u_teacher.user_id
         JOIN students st ON ts.batch_id = st.batch_id
         WHERE st.user_id = ?
         ORDER BY n.created_at DESC`,
        [userId]
    );
    return rows;
}

module.exports = { getStudentNotes };