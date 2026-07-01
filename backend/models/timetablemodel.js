const db = require("../config/db");

async function getAllTimetable() {

    const [rows] = await db.query(`
        SELECT

            tt.timetable_id,

            tt.day_name,

            tt.start_time,

            tt.end_time,

            u.full_name AS teacher_name,

            s.subject_name,

            b.batch_name,

            ts.id AS assignment_id

        FROM timetable tt

        JOIN teacher_subject ts
            ON tt.assignment_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        JOIN users u
            ON t.user_id = u.user_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        ORDER BY
            FIELD(
                tt.day_name,
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ),
            tt.start_time
    `);

    return rows;

}

async function createTimetable(data) {

    // Prevent overlapping timetable for same assignment
    const [exists] = await db.query(
        `
        SELECT timetable_id
        FROM timetable
        WHERE assignment_id=?
        AND day_name=?
        AND (
            (? < end_time)
            AND
            (? > start_time)
        )
        `,
        [
            data.assignment_id,
            data.day_name,
            data.start_time,
            data.end_time
        ]
    );

    if (exists.length) {
        throw new Error("Time slot already exists for this assignment.");
    }

    const [result] = await db.query(
        `
        INSERT INTO timetable
        (
            assignment_id,
            day_name,
            start_time,
            end_time
        )
        VALUES (?,?,?,?)
        `,
        [
            data.assignment_id,
            data.day_name,
            data.start_time,
            data.end_time
        ]
    );

    return result.insertId;

}

async function deleteTimetable(id) {

    await db.query(
        "DELETE FROM timetable WHERE timetable_id=?",
        [id]
    );

}

module.exports = {
    getAllTimetable,
    createTimetable,
    deleteTimetable
};