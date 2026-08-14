const db = require("../config/db");

async function getFeeReport() {
    const [rows] = await db.query(
        `SELECT u.full_name AS "Student Name", b.batch_name AS "Batch", 
                f.amount AS "Amount", f.due_date AS "Due Date", f.status AS "Status"
         FROM fees f
         JOIN students st ON f.student_id = st.student_id
         JOIN users u ON st.user_id = u.user_id
         JOIN batches b ON st.batch_id = b.batch_id
         ORDER BY f.due_date DESC`
    );
    return rows;
}

async function getAdmissionsReport() {
    const [rows] = await db.query(
        `SELECT u.full_name AS "Student Name", u.phone AS "Phone", u.email AS "Email", 
                st.roll_no AS "Roll No", st.admission_date AS "Admission Date", b.batch_name AS "Batch"
         FROM students st
         JOIN users u ON st.user_id = u.user_id
         LEFT JOIN batches b ON st.batch_id = b.batch_id
         ORDER BY st.admission_date DESC`
    );
    return rows;
}

async function getBatchReport() {
    const [rows] = await db.query(
        `SELECT b.batch_name AS "Batch Name", 
                (SELECT COUNT(*) FROM students st WHERE st.batch_id = b.batch_id) AS "Total Students",
                (SELECT COUNT(*) FROM teacher_subject ts WHERE ts.batch_id = b.batch_id) AS "Assigned Subjects"
         FROM batches b
         ORDER BY b.batch_name ASC`
    );
    return rows;
}

async function getFacultyReport() {
    const [rows] = await db.query(
        `SELECT u.full_name AS "Teacher Name", u.phone AS "Phone", 
                t.qualification AS "Qualification", t.experience AS "Experience (Years)", 
                t.joining_date AS "Joining Date", t.salary AS "Salary"
         FROM teachers t
         JOIN users u ON t.user_id = u.user_id
         ORDER BY u.full_name ASC`
    );
    return rows;
}

module.exports = {
    getFeeReport,
    getAdmissionsReport,
    getBatchReport,
    getFacultyReport
};