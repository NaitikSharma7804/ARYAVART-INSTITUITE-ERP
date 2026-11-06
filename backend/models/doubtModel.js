const db = require("../config/db");

/* ================= TEACHER FUNCTIONS ================= */

async function getTeacherDoubts(userId) {
    try {
        const [rows] = await db.query(
            `SELECT d.doubt_id, d.question, d.answer, d.status, 
                    u.full_name AS student_name, st.roll_no
             FROM doubts d
             JOIN students st ON d.student_id = st.student_id
             JOIN users u ON st.user_id = u.user_id
             LEFT JOIN teachers tr ON d.teacher_id = tr.teacher_id
             WHERE d.teacher_id IS NULL OR tr.user_id = ?
             ORDER BY d.status ASC, d.doubt_id DESC`,
            [userId]
        );
        return rows || [];
    } catch (err) {
        console.error("Error in getTeacherDoubts:", err.message);
        return [];
    }
}

async function replyToDoubt(doubtId, answer, userId) {
    const [teacher] = await db.query(
        "SELECT teacher_id FROM teachers WHERE user_id = ?",
        [userId]
    );
    const teacherId = teacher.length > 0 ? teacher[0].teacher_id : null;

    await db.query(
        `UPDATE doubts 
         SET answer = ?, status = 'Answered', teacher_id = COALESCE(teacher_id, ?) 
         WHERE doubt_id = ?`,
        [answer, teacherId, doubtId]
    );
}

module.exports = {
    getTeacherDoubts,
    replyToDoubt
};
