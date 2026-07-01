const db = require("../config/db");

async function getStats() {

    const [[students]] = await db.query(
        "SELECT COUNT(*) total FROM students"
    );

    const [[teachers]] = await db.query(
        "SELECT COUNT(*) total FROM teachers"
    );

    const [[parents]] = await db.query(
        "SELECT COUNT(*) total FROM parents"
    );

    const [[pendingAdmissions]] = await db.query(
        "SELECT COUNT(*) total FROM admissions WHERE status='Pending'"
    );

    const [[notices]] = await db.query(
        "SELECT COUNT(*) total FROM notices"
    );

    const [[homework]] = await db.query(
        "SELECT COUNT(*) total FROM homework"
    );

    return {

        students: students.total,

        teachers: teachers.total,

        parents: parents.total,

        admissions: pendingAdmissions.total,

        notices: notices.total,

        homework: homework.total

    };

}

module.exports = {

    getStats

};