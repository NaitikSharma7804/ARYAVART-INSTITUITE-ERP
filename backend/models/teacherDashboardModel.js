const db = require("../config/db");

async function getTodayClasses(userId) {

    const [rows] = await db.query(`
        SELECT

            tt.timetable_id,
            tt.day_name,
            tt.start_time,
            tt.end_time,

            s.subject_name,
            b.batch_name

        FROM users u

        JOIN teachers t
            ON u.user_id=t.user_id

        JOIN teacher_subject ts
            ON t.teacher_id=ts.teacher_id

        JOIN timetable tt
            ON ts.id=tt.assignment_id

        JOIN subjects s
            ON ts.subject_id=s.subject_id

        JOIN batches b
            ON ts.batch_id=b.batch_id

        WHERE u.user_id=?

        ORDER BY tt.start_time
    `,[userId]);

    return rows;

}

module.exports={
    getTodayClasses
};