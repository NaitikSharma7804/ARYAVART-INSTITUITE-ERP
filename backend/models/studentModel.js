const db = require("../config/db");
const bcrypt = require("bcryptjs");

async function getStudents() {

    const [rows] = await db.query(`
        SELECT

            s.student_id,
            u.full_name,
            u.phone,
            u.email,
            s.roll_no,
            s.gender,
            s.dob,
            c.class_name,
            b.batch_name

        FROM students s

        JOIN users u
        ON s.user_id=u.user_id

        LEFT JOIN classes c
        ON s.class_id=c.class_id

        LEFT JOIN batches b
        ON s.batch_id=b.batch_id

        ORDER BY u.full_name
    `);

    return rows;

}

async function addStudent(data){

    const conn=await db.getConnection();

    try{

        await conn.beginTransaction();

        const hash=await bcrypt.hash(data.password,10);

        const [user]=await conn.query(

            `INSERT INTO users

            (full_name,email,phone,password_hash,role)

            VALUES(?,?,?,?,?)`,

            [

                data.full_name,

                data.email,

                data.phone,

                hash,

                "STUDENT"

            ]

        );

        await conn.query(

            `INSERT INTO students

            (

                user_id,

                roll_no,

                gender,

                dob,

                address,

                blood_group,

                aadhaar_no,

                class_id,

                batch_id,

                admission_date

            )

            VALUES(?,?,?,?,?,?,?,?,?,?)`,

            [

                user.insertId,

                data.roll_no,

                data.gender,

                data.dob,

                data.address,

                data.blood_group,

                data.aadhaar_no,

                data.class_id,

                data.batch_id,

                data.admission_date

            ]

        );

        await conn.commit();

        return true;

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

    getStudents,

    addStudent

};