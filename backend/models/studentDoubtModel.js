const db = require("../config/db");

async function postDoubt(userId, question) {
    // 1. Get the student_id for this user
    let [student] = await db.query("SELECT student_id FROM students WHERE user_id = ?", [userId]);
    
    if (student.length === 0) {
        const [res] = await db.query("INSERT INTO students (user_id, admission_date) VALUES (?, CURDATE())", [userId]);
        student = [{ student_id: res.insertId }];
    }
    
    // 2. Insert the doubt
    // We set teacher_id = 1 as a default, or you can adjust this logic
    // Currently in studentDoubtModel.js
return await db.query(
    "INSERT INTO doubts (student_id, teacher_id, question, status) VALUES (?, ?, ?, 'Pending')",
    [student[0].student_id, null, question] // Use null here
);
}

async function getStudentDoubts(userId) {
    // 1. Get student_id
    const [student] = await db.query("SELECT student_id FROM students WHERE user_id = ?", [userId]);
    
    if (student.length === 0) return [];

    // 2. Fetch doubts for this student
    const [doubts] = await db.query(
        "SELECT * FROM doubts WHERE student_id = ? ORDER BY doubt_id DESC", 
        [student[0].student_id]
    );
    return doubts;
}

module.exports = { postDoubt, getStudentDoubts };