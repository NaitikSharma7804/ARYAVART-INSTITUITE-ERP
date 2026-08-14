const db = require("../config/db");

/*
====================================
Teacher Assignment Options
====================================
*/

async function getTeacherAssignments(userId) {

    const [rows] = await db.query(
        `
        SELECT

            ts.id AS teacher_subject_id,

            s.subject_name,

            b.batch_name

        FROM teachers t

        JOIN teacher_subject ts
            ON t.teacher_id = ts.teacher_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        WHERE t.user_id = ?

        ORDER BY
            b.batch_name,
            s.subject_name
        `,
        [userId]
    );

    return rows;

}

/*
====================================
Create Homework
====================================
*/

async function createHomework(data) {

    const [result] = await db.query(

        `
        INSERT INTO homework
        (
            teacher_subject_id,
            title,
            description,
            due_date,
            attachment
        )

        VALUES
        (
            ?,?,?,?,?
        )
        `,

        [

            data.teacher_subject_id,
            data.title,
            data.description,
            data.due_date,
            data.attachment || null

        ]

    );

    return result.insertId;

}

/*
====================================
Teacher Homework List
====================================
*/

async function getTeacherHomework(userId) {

    const [rows] = await db.query(
        `
        SELECT

            h.homework_id,

            h.title,

            h.description,

            h.due_date,

            h.created_at,

            s.subject_name,

            b.batch_name

        FROM homework h

        JOIN teacher_subject ts
            ON h.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        WHERE t.user_id = ?

        ORDER BY h.created_at DESC
        `,
        [userId]
    );

    return rows;

}

module.exports = {

    getTeacherAssignments,
    createHomework,
    getTeacherHomework

};