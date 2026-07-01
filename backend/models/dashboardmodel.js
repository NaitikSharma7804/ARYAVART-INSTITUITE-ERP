const db = require("../config/db");

async function getStats() {

    const [[students]] = await db.query(
        "SELECT COUNT(*) AS total FROM students"
    );

    const [[teachers]] = await db.query(
        "SELECT COUNT(*) AS total FROM teachers"
    );

    const [[parents]] = await db.query(
        "SELECT COUNT(*) AS total FROM parents"
    );

    const [[admissions]] = await db.query(
        "SELECT COUNT(*) AS total FROM admissions"
    );

    const [[fees]] = await db.query(
        "SELECT IFNULL(SUM(amount),0) AS total FROM payments"
    );

    const [[attendance]] = await db.query(`
        SELECT
        ROUND(
            IFNULL(
                SUM(status='Present')*100/COUNT(*),
                0
            ),
            1
        ) AS percentage
        FROM attendance
    `);

    return {
        students: students.total,
        teachers: teachers.total,
        parents: parents.total,
        admissions: admissions.total,
        fees: fees.total,
        attendance: attendance.percentage
    };

}

async function getRecentAdmissions() {

    const [rows] = await db.query(`
        SELECT
            admission_id,
            student_name,
            phone,
            class_applied,
            status,
            created_at
        FROM admissions
        ORDER BY created_at DESC
        LIMIT 5
    `);

    return rows;

}

module.exports = {
    getStats,getRecentAdmissions
};