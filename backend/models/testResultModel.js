const db = require("../config/db");

async function getStudentResults(userId) {
    const [rows] = await db.query(
        `SELECT 
            t.title, 
            'General Subject' AS subject_name, 
            st.submitted_at, 
            st.obtained_marks, 
            t.total_marks,
            ROUND((st.obtained_marks / t.total_marks) * 100, 2) AS percentage,
            
            /* Rank starts at 1 by default */
            RANK() OVER (PARTITION BY t.test_id ORDER BY st.obtained_marks DESC) as student_rank,
            
            /* Using the score percentage as a demo-friendly percentile */
            ROUND((st.obtained_marks / t.total_marks) * 100, 0) as student_percentile
         FROM student_tests st
         JOIN tests t ON st.test_id = t.test_id
         JOIN students st_user ON st.student_id = st_user.student_id
         WHERE st_user.user_id = ? AND st.status = 'Checked'
         ORDER BY st.submitted_at DESC`,
        [userId]
    );
    return rows;
}

module.exports = { getStudentResults };