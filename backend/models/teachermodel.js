const db = require("../config/db");

async function getAllTeachers() {

    const [rows] = await db.query(`
        SELECT
            t.teacher_id,
            u.user_id,
            u.full_name,
            u.email,
            u.phone,
            t.qualification,
            t.experience,
            t.salary,
            t.joining_date
        FROM teachers t
        JOIN users u
            ON t.user_id = u.user_id
        ORDER BY u.full_name
    `);

    return rows;
}

const bcrypt = require("bcryptjs");

async function createTeacher(data) {

    const conn = await db.getConnection();

    try {

        await conn.beginTransaction();

        const hash = await bcrypt.hash(data.password, 10);

        const [user] = await conn.query(
            `INSERT INTO users
            (full_name,email,phone,password_hash,role,status)
            VALUES (?,?,?,?, 'TEACHER','ACTIVE')`,
            [
                data.full_name,
                data.email,
                data.phone,
                hash
            ]
        );

        await conn.query(
            `INSERT INTO teachers
            (user_id,qualification,experience,salary,joining_date)
            VALUES (?,?,?,?,?)`,
            [
                user.insertId,
                data.qualification,
                data.experience,
                data.salary,
                data.joining_date
            ]
        );

        await conn.commit();

        return user.insertId;

    } catch (err) {

        await conn.rollback();

        throw err;

    } finally {

        conn.release();

    }

}

async function deleteTeacher(id) {

    const conn = await db.getConnection();

    try {

        await conn.beginTransaction();

        const [teacher] = await conn.query(
            "SELECT user_id FROM teachers WHERE teacher_id=?",
            [id]
        );

        if (teacher.length === 0) {

            throw new Error("Teacher not found");

        }

        const userId = teacher[0].user_id;

        await conn.query(
            "DELETE FROM teachers WHERE teacher_id=?",
            [id]
        );

        await conn.query(
            "DELETE FROM users WHERE user_id=?",
            [userId]
        );

        await conn.commit();

    } catch (err) {

        await conn.rollback();

        throw err;

    } finally {

        conn.release();

    }

}
async function getTeacherById(id) {

    const [rows] = await db.query(`
        SELECT
            t.teacher_id,
            u.user_id,
            u.full_name,
            u.email,
            u.phone,
            t.qualification,
            t.experience,
            t.salary,
            t.joining_date
        FROM teachers t
        JOIN users u
            ON t.user_id = u.user_id
        WHERE t.teacher_id = ?
    `, [id]);

    return rows[0];

}

async function updateTeacher(id, data) {

    const conn = await db.getConnection();

    try {

        await conn.beginTransaction();

        const [teacher] = await conn.query(
            "SELECT user_id FROM teachers WHERE teacher_id=?",
            [id]
        );

        if (teacher.length === 0) {
            throw new Error("Teacher not found");
        }

        const userId = teacher[0].user_id;

        await conn.query(
            `UPDATE users
             SET full_name=?, email=?, phone=?
             WHERE user_id=?`,
            [
                data.full_name,
                data.email,
                data.phone,
                userId
            ]
        );

        await conn.query(
            `UPDATE teachers
             SET qualification=?,
                 experience=?,
                 salary=?,
                 joining_date=?
             WHERE teacher_id=?`,
            [
                data.qualification,
                data.experience,
                data.salary,
                data.joining_date,
                id
            ]
        );

        await conn.commit();

    } catch (err) {

        await conn.rollback();

        throw err;

    } finally {

        conn.release();

    }

}


module.exports = {
    getAllTeachers,
    createTeacher,
    deleteTeacher,
    getTeacherById,
    updateTeacher
};