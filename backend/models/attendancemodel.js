const db = require("../config/db");

async function getStudentsForClass(timetableId) {

    const [rows] = await db.query(`
        SELECT

            s.student_id,

            u.full_name,

            s.roll_no

        FROM timetable tt

        JOIN teacher_subject ts
            ON tt.assignment_id = ts.id

        JOIN students s
            ON ts.batch_id = s.batch_id

        JOIN users u
            ON s.user_id = u.user_id

        WHERE tt.timetable_id=?

        ORDER BY s.roll_no
    `,[timetableId]);

    return rows;

}

async function markAttendance(data){

    const conn = await db.getConnection();

    try{

        await conn.beginTransaction();

        for(const student of data.students){

            await conn.query(

            `

            INSERT INTO attendance

            (

                timetable_id,

                student_id,

                attendance_date,

                status

            )

            VALUES

            (

                ?,?,?,?

            )

            ON DUPLICATE KEY UPDATE

            status=VALUES(status)

            `,

            [

                data.timetable_id,

                student.student_id,

                data.attendance_date,

                student.status

            ]

            );

        }

        await conn.commit();

    }

    catch(err){

        await conn.rollback();

        throw err;

    }

    finally{

        conn.release();

    }

}

module.exports={

    getStudentsForClass,

    markAttendance

};