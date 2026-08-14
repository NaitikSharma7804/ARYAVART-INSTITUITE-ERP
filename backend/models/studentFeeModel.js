const db = require("../config/db");

async function getStudentFees(userId) {
    // 1. Get student_id using the user_id
    const [studentRows] = await db.query("SELECT student_id FROM students WHERE user_id = ?", [userId]);
    if (studentRows.length === 0) throw new Error("Student not found");
    const studentId = studentRows[0].student_id;

    // 2. Fetch all fee records for this student
    const [rows] = await db.query(
        `SELECT fee_id, amount, status, due_date FROM fees WHERE student_id = ? ORDER BY due_date ASC`,
        [studentId]
    );

    // 3. Calculate totals for the progress bar logic
    const total = rows.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const paid = rows
        .filter(f => f.status === 'Paid')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return { installments: rows, total, paid };
}

module.exports = { getStudentFees };