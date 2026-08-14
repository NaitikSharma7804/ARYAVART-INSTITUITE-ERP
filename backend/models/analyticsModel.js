const db = require("../config/db");

async function getTeacherAnalytics(userId) {
    // 1. Get Total Students taught by this teacher
    const [studentCount] = await db.query(
        `SELECT COUNT(DISTINCT st.student_id) AS total_students
         FROM students st
         JOIN teacher_subject ts ON st.batch_id = ts.batch_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE tr.user_id = ?`, 
        [userId]
    );

    // 2. Get Homework Submission Stats
    const [hwStats] = await db.query(
        `SELECT COUNT(hs.submission_id) AS total_submissions,
                SUM(CASE WHEN hs.status = 'Checked' OR hs.status = 'Approved' THEN 1 ELSE 0 END) AS checked_submissions
         FROM homework_submissions hs
         JOIN homework h ON hs.homework_id = h.homework_id
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE tr.user_id = ?`, 
        [userId]
    );

    // 3. Get Recent Feedback Given by this Teacher
    const [recentFeedback] = await db.query(
        `SELECT u.full_name AS student_name, h.title AS assignment_title, 
                hs.teacher_marks, hs.teacher_feedback, hs.submitted_at, b.batch_name
         FROM homework_submissions hs
         JOIN students st ON hs.student_id = st.student_id
         JOIN users u ON st.user_id = u.user_id
         JOIN homework h ON hs.homework_id = h.homework_id
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         JOIN batches b ON ts.batch_id = b.batch_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE tr.user_id = ? AND hs.teacher_feedback IS NOT NULL AND hs.teacher_feedback != ''
         ORDER BY hs.submitted_at DESC
         LIMIT 15`, 
        [userId]
    );

    // 4. Get Batch Test Performance
    const [testStats] = await db.query(
        `SELECT b.batch_name, AVG(st.obtained_marks) AS avg_score, COUNT(st.attempt_id) AS total_attempts
         FROM student_tests st
         JOIN tests t ON st.test_id = t.test_id
         JOIN teacher_subject ts ON t.teacher_subject_id = ts.id
         JOIN batches b ON ts.batch_id = b.batch_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE tr.user_id = ? AND st.obtained_marks IS NOT NULL
         GROUP BY b.batch_id`, 
        [userId]
    );

    return {
        total_students: studentCount[0].total_students || 0,
        total_submissions: hwStats[0].total_submissions || 0,
        checked_submissions: hwStats[0].checked_submissions || 0,
        recent_feedback: recentFeedback,
        batch_performance: testStats
    };
}

module.exports = { getTeacherAnalytics };