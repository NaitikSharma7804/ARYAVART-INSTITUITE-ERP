const db = require("../config/db");

async function getClasses() {

    const [rows] = await db.query(

        `SELECT
            c.class_id,
            c.class_name,
            COUNT(s.student_id) AS students

        FROM classes c

        LEFT JOIN students s
        ON c.class_id = s.class_id

        GROUP BY c.class_id

        ORDER BY c.class_name`

    );

    return rows;

}

async function addClass(className) {

    const [result] = await db.query(

        "INSERT INTO classes (class_name) VALUES (?)",

        [className]

    );

    return result;

}

module.exports = {

    getClasses,

    addClass

};