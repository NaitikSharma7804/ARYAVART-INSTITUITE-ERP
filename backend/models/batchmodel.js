const db = require("../config/db");

async function getAllBatches() {

    const [rows] = await db.query(`

        SELECT

            b.batch_id,
            b.batch_name,
            b.room_no,
            b.start_time,
            b.end_time,
            c.class_name,
            COUNT(s.student_id) AS students

        FROM batches b

        LEFT JOIN classes c
        ON b.class_id = c.class_id

        LEFT JOIN students s
        ON b.batch_id = s.batch_id

        GROUP BY b.batch_id

        ORDER BY b.batch_name

    `);

    return rows;

}

async function createBatch(data) {

    const {

        batch_name,

        class_id,

        room_no,

        start_time,

        end_time

    } = data;

    const [result] = await db.query(

        `INSERT INTO batches
        (batch_name,class_id,room_no,start_time,end_time)
        VALUES(?,?,?,?,?)`,

        [

            batch_name,

            class_id,

            room_no,

            start_time,

            end_time

        ]

    );

    return result;

}

async function updateBatch(id,data){

    const {

        batch_name,

        class_id,

        room_no,

        start_time,

        end_time

    } = data;

    await db.query(

        `UPDATE batches

        SET

        batch_name=?,

        class_id=?,

        room_no=?,

        start_time=?,

        end_time=?

        WHERE batch_id=?`,

        [

            batch_name,

            class_id,

            room_no,

            start_time,

            end_time,

            id

        ]

    );

}

async function deleteBatch(id){

    await db.query(

        "DELETE FROM batches WHERE batch_id=?",

        [id]

    );

}

module.exports={

    getAllBatches,

    createBatch,

    updateBatch,

    deleteBatch

};