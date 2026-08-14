const db = require("../config/db");

/* ================= STUDENT FUNCTIONS ================= */

async function getStudentHomework(userId) {
    const [rows] = await db.query(
        `SELECT h.*, s.subject_name, u_teacher.full_name AS teacher_name, 
                hs.submission_id, hs.file_path, hs.remarks AS student_remarks, 
                hs.status AS submission_status, hs.teacher_marks, hs.teacher_feedback, hs.submitted_at
         FROM homework h
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u_teacher ON tr.user_id = u_teacher.user_id 
         JOIN students st_user ON ts.batch_id = st_user.batch_id
         LEFT JOIN homework_submissions hs ON h.homework_id = hs.homework_id AND st_user.student_id = hs.student_id
         WHERE st_user.user_id = ?
         ORDER BY h.due_date DESC`,
        [userId]
    );
    return rows;
}

async function submitHomework(data) {
    const [studentRows] = await db.query(`SELECT student_id FROM students WHERE user_id = ?`, [data.user_id]);
    const studentId = studentRows[0].student_id;

    // Check if submission already exists
    const [existing] = await db.query(
        `SELECT submission_id FROM homework_submissions WHERE homework_id = ? AND student_id = ?`,
        [data.homework_id, studentId]
    );

    // Determine if late
    const [hwData] = await db.query(`SELECT due_date FROM homework WHERE homework_id = ?`, [data.homework_id]);
    const isLate = new Date() > new Date(hwData[0].due_date) ? "Late" : "Submitted";

    if (existing.length > 0) {
        await db.query(
            `UPDATE homework_submissions 
             SET file_path = ?, remarks = ?, submitted_at = NOW(), status = ?, teacher_marks = NULL, teacher_feedback = NULL
             WHERE submission_id = ?`,
            [data.file_path, data.remarks, isLate, existing[0].submission_id]
        );
        return existing[0].submission_id;
    } else {
        const [result] = await db.query(
            `INSERT INTO homework_submissions (homework_id, student_id, file_path, remarks, status, submitted_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [data.homework_id, studentId, data.file_path, data.remarks, isLate]
        );
        return result.insertId;
    }
}

/* ================= TEACHER FUNCTIONS ================= */

async function getTeacherHomeworkList(userId) {
    const [rows] = await db.query(
        `SELECT h.*, s.subject_name, b.batch_name,
                (SELECT COUNT(*) FROM students st WHERE st.batch_id = ts.batch_id) AS total_students,
                (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.homework_id = h.homework_id) AS submitted_count,
                (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.homework_id = h.homework_id AND hs.status = 'Late') AS late_count
         FROM homework h
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN batches b ON ts.batch_id = b.batch_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE tr.user_id = ?
         ORDER BY h.created_at DESC`,
        [userId]
    );
    return rows;
}

async function getHomeworkSubmissions(homeworkId, userId) {
    // Verify teacher owns this homework
    const [authCheck] = await db.query(
        `SELECT h.homework_id FROM homework h
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE h.homework_id = ? AND tr.user_id = ?`,
        [homeworkId, userId]
    );
    if (authCheck.length === 0) throw new Error("Unauthorized");

    // UPDATED QUERY: using u.full_name and joining on u.user_id
    const [rows] = await db.query(
        `SELECT st.student_id, u.full_name AS full_name, st.roll_no,
                hs.submission_id, hs.file_path, hs.remarks AS student_remarks, 
                hs.status, hs.teacher_marks, hs.teacher_feedback, hs.submitted_at
         FROM students st
         JOIN users u ON st.user_id = u.user_id 
         JOIN teacher_subject ts ON st.batch_id = ts.batch_id
         JOIN homework h ON h.teacher_subject_id = ts.id
         LEFT JOIN homework_submissions hs ON h.homework_id = hs.homework_id AND st.student_id = hs.student_id
         WHERE h.homework_id = ?
         ORDER BY st.roll_no ASC`,
        [homeworkId]
    );
    return rows;
}

async function gradeSubmission(submissionId, data) {
    await db.query(
        `UPDATE homework_submissions 
         SET teacher_marks = ?, teacher_feedback = ?, status = ?
         WHERE submission_id = ?`,
        [data.teacher_marks, data.teacher_feedback, data.status, submissionId]
    );
}

module.exports = {
    getStudentHomework,
    submitHomework,
    getTeacherHomeworkList,
    getHomeworkSubmissions,
    gradeSubmission
};