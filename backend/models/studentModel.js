const db = require("../config/db");

async function getAllStudents() {

    const [rows] = await db.query(`

        SELECT

            s.student_id,

            s.roll_no,

            s.admission_date,

            u.full_name,

            u.phone,

            u.email,

            u.status,

            c.class_name,

            b.batch_name

        FROM students s

        LEFT JOIN users u
        ON s.user_id = u.user_id

        LEFT JOIN classes c
        ON s.class_id = c.class_id

        LEFT JOIN batches b
        ON s.batch_id = b.batch_id

        ORDER BY u.full_name

    `);

    return rows;

}

module.exports = {

    getAllStudents

};