const db = require("../config/db");

async function getAdminAnalytics() {
    // 1. Academy Average Test Score (Percentage)
    const [avgRes] = await db.query(
        `SELECT AVG((st.obtained_marks / t.total_marks) * 100) AS avg_score
         FROM student_tests st
         JOIN tests t ON st.test_id = t.test_id
         WHERE st.obtained_marks IS NOT NULL AND t.total_marks > 0`
    );
    const avgScore = avgRes[0].avg_score ? Math.round(avgRes[0].avg_score) : 0;

    // 2. Dropout Risk (Count of students averaging below 40%)
    const [riskRes] = await db.query(
        `SELECT COUNT(*) AS risk_count FROM (
            SELECT st.student_id, AVG((st.obtained_marks / t.total_marks) * 100) AS student_avg
            FROM student_tests st
            JOIN tests t ON st.test_id = t.test_id
            WHERE st.obtained_marks IS NOT NULL AND t.total_marks > 0
            GROUP BY st.student_id
            HAVING student_avg < 40
         ) AS risk_students`
    );
    const riskCount = riskRes[0].risk_count || 0;

    // 3. Top Performing Batch
    const [topBatchRes] = await db.query(
        `SELECT b.batch_name, AVG((st.obtained_marks / t.total_marks) * 100) AS batch_avg
         FROM student_tests st
         JOIN tests t ON st.test_id = t.test_id
         JOIN students s ON st.student_id = s.student_id
         JOIN batches b ON s.batch_id = b.batch_id
         WHERE st.obtained_marks IS NOT NULL AND t.total_marks > 0
         GROUP BY b.batch_id
         ORDER BY batch_avg DESC
         LIMIT 1`
    );
    const topBatch = topBatchRes.length > 0 ? topBatchRes[0].batch_name : "N/A";

    // 4. Enrollment Trend (Admissions per month for the current year)
    const [trendRes] = await db.query(
        `SELECT DATE_FORMAT(admission_date, '%b') AS month_name, COUNT(*) AS count
         FROM students
         WHERE admission_date IS NOT NULL AND YEAR(admission_date) = YEAR(CURRENT_DATE)
         GROUP BY MONTH(admission_date), month_name
         ORDER BY MONTH(admission_date) ASC`
    );

    return {
        avgScore,
        riskCount,
        topBatch,
        enrollmentTrend: trendRes
    };
}

module.exports = {
    getAdminAnalytics
};