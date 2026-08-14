const db = require("../config/db");

/* ================= TEACHER FUNCTIONS ================= */

async function getTeacherDoubts(userId) {
    // We join students and users to get the student's actual name
    const [rows] = await db.query(
        `SELECT d.doubt_id, d.question, d.answer, d.status, 
                u.full_name AS student_name, st.roll_no
         FROM doubts d
         JOIN students st ON d.student_id = st.student_id
         JOIN users u ON st.user_id = u.user_id
         JOIN teachers tr ON d.teacher_id = tr.teacher_id
         WHERE tr.user_id = ?
         ORDER BY d.status ASC, d.doubt_id DESC`,
        [userId]
    );
    return rows;
}

async function replyToDoubt(doubtId, answer, userId) {
    // Verify the teacher owns this doubt before updating
    const [authCheck] = await db.query(
        `SELECT d.doubt_id FROM doubts d
         JOIN teachers tr ON d.teacher_id = tr.teacher_id
         WHERE d.doubt_id = ? AND tr.user_id = ?`,
        [doubtId, userId]
    );

    if (authCheck.length === 0) throw new Error("Unauthorized to reply to this doubt.");

    await db.query(
        `UPDATE doubts 
         SET answer = ?, status = 'Answered' 
         WHERE doubt_id = ?`,
        [answer, doubtId]
    );
}

module.exports = {
    getTeacherDoubts,
    replyToDoubt
};