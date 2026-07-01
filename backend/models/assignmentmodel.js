const db = require("../config/db");

async function getAssignments() {

    const [rows] = await db.query(`
        SELECT
            ts.id,
            t.teacher_id,
            u.full_name AS teacher_name,
            s.subject_name,
            s.subject_code,
            b.batch_name
        FROM teacher_subject ts
        JOIN teachers t
            ON ts.teacher_id = t.teacher_id
        JOIN users u
            ON t.user_id = u.user_id
        JOIN subjects s
            ON ts.subject_id = s.subject_id
        JOIN batches b
            ON ts.batch_id = b.batch_id
        ORDER BY u.full_name
    `);

    return rows;
}

async function createAssignment(data) {

    const [result] = await db.query(
        `INSERT INTO teacher_subject
        (teacher_id, subject_id, batch_id)
        VALUES (?,?,?)`,
        [
            data.teacher_id,
            data.subject_id,
            data.batch_id
        ]
    );

    return result.insertId;
}

async function deleteAssignment(id) {

    await db.query(
        "DELETE FROM teacher_subject WHERE id=?",
        [id]
    );
}

module.exports = {
    getAssignments,
    createAssignment,
    deleteAssignment
};