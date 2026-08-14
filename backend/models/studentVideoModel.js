const db = require("../config/db");

async function getStudentVideos(userId) {
    const [rows] = await db.query(
        `SELECT v.video_id, v.title, v.description, v.video_type, v.video_url, v.created_at,
                s.subject_name, u_teacher.full_name AS teacher_name
         FROM videos v
         JOIN teacher_subject ts ON v.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u_teacher ON tr.user_id = u_teacher.user_id
         JOIN students st ON ts.batch_id = st.batch_id
         WHERE st.user_id = ?
         ORDER BY v.created_at DESC`,
        [userId]
    );
    return rows;
}

module.exports = { getStudentVideos };