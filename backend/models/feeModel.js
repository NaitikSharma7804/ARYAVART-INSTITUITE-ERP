const db = require("../config/db");

async function getAllFees() {
    const [rows] = await db.query(
        `SELECT f.fee_id, f.amount, f.due_date, f.status, 
                u.full_name AS student_name, b.batch_name
         FROM fees f
         JOIN students st ON f.student_id = st.student_id
         JOIN users u ON st.user_id = u.user_id
         JOIN batches b ON st.batch_id = b.batch_id
         ORDER BY f.status DESC, f.due_date ASC`
    );
    return rows;
}

async function getPendingFees() {
    const [rows] = await db.query(
        `SELECT f.fee_id, f.amount, u.full_name AS student_name, b.batch_name
         FROM fees f
         JOIN students st ON f.student_id = st.student_id
         JOIN users u ON st.user_id = u.user_id
         JOIN batches b ON st.batch_id = b.batch_id
         WHERE f.status = 'Pending' OR f.status = 'Partial'
         ORDER BY u.full_name ASC`
    );
    return rows;
}

async function recordPayment(feeId) {
    const [result] = await db.query(
        `UPDATE fees SET status = 'Paid' WHERE fee_id = ?`,
        [feeId]
    );
    return result.affectedRows;
}

module.exports = {
    getAllFees,
    getPendingFees,
    recordPayment
};