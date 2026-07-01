const db = require("../config/db");

async function getAllSubjects() {

    const [rows] = await db.query(`
        SELECT
            s.subject_id,
            s.subject_name,
            s.subject_code,
            c.class_name,
            c.class_id
        FROM subjects s
        LEFT JOIN classes c
            ON s.class_id = c.class_id
        ORDER BY c.class_name, s.subject_name
    `);

    return rows;
}

async function createSubject(data) {

    const [result] = await db.query(
        `INSERT INTO subjects
        (subject_name, subject_code, class_id)
        VALUES (?,?,?)`,
        [
            data.subject_name,
            data.subject_code,
            data.class_id
        ]
    );

    return result.insertId;
}

async function getSubjectById(id) {

    const [rows] = await db.query(
        `SELECT * FROM subjects WHERE subject_id=?`,
        [id]
    );

    return rows[0];
}

async function updateSubject(id, data) {

    await db.query(
        `UPDATE subjects
         SET subject_name=?,
             subject_code=?,
             class_id=?
         WHERE subject_id=?`,
        [
            data.subject_name,
            data.subject_code,
            data.class_id,
            id
        ]
    );
}

async function deleteSubject(id) {

    await db.query(
        `DELETE FROM subjects
         WHERE subject_id=?`,
        [id]
    );
}

module.exports = {
    getAllSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deleteSubject
};