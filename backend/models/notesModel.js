const db = require("../config/db");

/*
=====================================
Teacher Assignments
=====================================
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

        WHERE t.user_id=?

        ORDER BY
            b.batch_name,
            s.subject_name
        `,

        [userId]

    );

    return rows;

}

/*
=====================================
Upload Note
=====================================
*/

async function uploadNote(data){

    const [result] = await db.query(

        `
        INSERT INTO notes
        (

            teacher_subject_id,

            title,

            description,

            file_path

        )

        VALUES
        (
            ?,?,?,?
        )
        `,

        [

            data.teacher_subject_id,

            data.title,

            data.description,

            data.file_path

        ]

    );

    return result.insertId;

}

/*
=====================================
Teacher Notes List
=====================================
*/

async function getTeacherNotes(userId){

    const [rows] = await db.query(

        `
        SELECT

            n.note_id,

            n.title,

            n.description,

            n.file_path,

            n.created_at,

            s.subject_name,

            b.batch_name

        FROM notes n

        JOIN teacher_subject ts
            ON n.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        WHERE t.user_id=?

        ORDER BY n.created_at DESC
        `,

        [userId]

    );

    return rows;

}

/*
=====================================
Delete Note
=====================================
*/

async function deleteNote(noteId,userId){

    const [result] = await db.query(

        `
        DELETE n

        FROM notes n

        JOIN teacher_subject ts
            ON n.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        WHERE

            n.note_id = ?

            AND

            t.user_id = ?

        `,

        [

            noteId,

            userId

        ]

    );

    return result.affectedRows;

}

/*
=====================================
Get Single Note
=====================================
*/

async function getNoteById(noteId,userId){

    const [rows] = await db.query(

        `
        SELECT

            n.note_id,

            n.teacher_subject_id,

            n.title,

            n.description,

            n.file_path

        FROM notes n

        JOIN teacher_subject ts
            ON n.teacher_subject_id=ts.id

        JOIN teachers t
            ON ts.teacher_id=t.teacher_id

        WHERE

            n.note_id=?

            AND

            t.user_id=?

        `,

        [

            noteId,

            userId

        ]

    );

    return rows[0];

}

/*
=====================================
Update Note
=====================================
*/

async function updateNote(data){

    await db.query(

        `
        UPDATE notes

        SET

            teacher_subject_id=?,

            title=?,

            description=?,

            file_path=IFNULL(?,file_path)

        WHERE note_id=?
        `,

        [

            data.teacher_subject_id,

            data.title,

            data.description,

            data.file_path,

            data.note_id

        ]

    );

}

module.exports={

    getTeacherAssignments,

    uploadNote,

    getTeacherNotes,

    deleteNote,

    getNoteById,

    updateNote

};