const db = require("../config/db");

/* ================= TEACHER TESTS & ASSIGNMENTS ================= */

async function getTeacherAssignments(userId) {
    const [rows] = await db.query(
        `SELECT ts.id AS teacher_subject_id, s.subject_name, b.batch_name
         FROM teachers t
         JOIN teacher_subject ts ON t.teacher_id = ts.teacher_id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN batches b ON ts.batch_id = b.batch_id
         WHERE t.user_id = ?
         ORDER BY b.batch_name, s.subject_name`,
        [userId]
    );
    return rows;
}

async function createTest(data) {
    const [result] = await db.query(
        `INSERT INTO tests (teacher_subject_id, title, description, duration, total_marks, test_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.teacher_subject_id, data.title, data.description, data.duration, data.total_marks, data.test_date, data.status || "Draft"]
    );
    return result.insertId;
}

async function updateTest(data) {
    await db.query(
        `UPDATE tests 
         SET teacher_subject_id=?, title=?, description=?, duration=?, total_marks=?, test_date=?, status=?
         WHERE test_id=?`,
        [data.teacher_subject_id, data.title, data.description, data.duration, data.total_marks, data.test_date, data.status, data.test_id]
    );
}

async function publishTest(testId) {
    await db.query(`UPDATE tests SET status = 'Published' WHERE test_id = ?`, [testId]);
}

async function deleteTest(testId, userId) {
    const [result] = await db.query(
        `DELETE t FROM tests t
         JOIN teacher_subject ts ON t.teacher_subject_id = ts.id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         WHERE t.test_id = ? AND tr.user_id = ?`,
        [testId, userId]
    );
    return result.affectedRows;
}

async function getTeacherTests(userId) {
    const [rows] = await db.query(
        `SELECT t.*, s.subject_name, b.batch_name, COUNT(q.question_id) AS questions
         FROM tests t
         JOIN teacher_subject ts ON t.teacher_subject_id = ts.id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN batches b ON ts.batch_id = b.batch_id
         LEFT JOIN test_questions q ON t.test_id = q.test_id
         WHERE tr.user_id = ?
         GROUP BY t.test_id
         ORDER BY t.created_at DESC`,
        [userId]
    );
    return rows;
}

async function getTestById(testId) {
    const [rows] = await db.query(
        `SELECT t.*, s.subject_name, b.batch_name 
         FROM tests t
         JOIN teacher_subject ts ON t.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN batches b ON ts.batch_id = b.batch_id
         WHERE t.test_id = ?`,
        [testId]
    );
    return rows[0];
}

/* ================= QUESTIONS ================= */

async function addQuestion(data) {
    const [result] = await db.query(
        `INSERT INTO test_questions (test_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_option, marks, question_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.test_id, data.question_text, data.question_type, data.option_a, data.option_b, data.option_c, data.option_d, data.correct_option, data.marks, data.question_order]
    );
    return result.insertId;
}

async function updateQuestion(data) {
    await db.query(
        `UPDATE test_questions 
         SET question_text=?, question_type=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=?, marks=?, question_order=?
         WHERE question_id=?`,
        [data.question_text, data.question_type, data.option_a, data.option_b, data.option_c, data.option_d, data.correct_option, data.marks, data.question_order, data.question_id]
    );
}

async function deleteQuestion(questionId) {
    await db.query(`DELETE FROM test_questions WHERE question_id = ?`, [questionId]);
}

async function getQuestions(testId) {
    const [rows] = await db.query(`SELECT * FROM test_questions WHERE test_id = ? ORDER BY question_order`, [testId]);
    return rows;
}

/* ================= STUDENT ATTEMPTS & GRADING ================= */

async function getStudentTests(userId) {
    const [rows] = await db.query(
        `SELECT t.*, s.subject_name, u_teacher.full_name AS teacher_name, st.status AS attempt_status, st.obtained_marks
         FROM tests t
         JOIN teacher_subject ts ON t.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u_teacher ON tr.user_id = u_teacher.user_id
         JOIN students st_user ON ts.batch_id = st_user.batch_id
         LEFT JOIN student_tests st ON t.test_id = st.test_id AND st.student_id = st_user.student_id
         WHERE st_user.user_id = ? AND t.status = 'Published'
         ORDER BY t.test_date DESC`,
        [userId]
    );
    return rows;
}

async function startTestAttempt(testId, userId) {
    const [studentRows] = await db.query(`SELECT student_id FROM students WHERE user_id = ?`, [userId]);
    const studentId = studentRows[0].student_id;

    const [existing] = await db.query(`SELECT attempt_id FROM student_tests WHERE test_id = ? AND student_id = ?`, [testId, studentId]);
    if (existing.length > 0) return existing[0].attempt_id;

    const [result] = await db.query(
        `INSERT INTO student_tests (student_id, test_id, status, started_at) VALUES (?, ?, 'In Progress', NOW())`,
        [studentId, testId]
    );
    return result.insertId;
}

async function saveStudentAnswer(attemptId, questionId, answerText, selectedOption) {
    const [existing] = await db.query(
        `SELECT answer_id FROM student_answers WHERE attempt_id = ? AND question_id = ?`,
        [attemptId, questionId]
    );

    if (existing.length > 0) {
        await db.query(
            `UPDATE student_answers SET answer_text = ?, selected_option = ? WHERE answer_id = ?`,
            [answerText, selectedOption, existing[0].answer_id]
        );
    } else {
        await db.query(
            `INSERT INTO student_answers (attempt_id, question_id, answer_text, selected_option) VALUES (?, ?, ?, ?)`,
            [attemptId, questionId, answerText, selectedOption]
        );
    }
}

async function submitTestAttempt(attemptId) {
    // Auto-grade MCQs
    const [answers] = await db.query(
        `SELECT sa.answer_id, sa.selected_option, tq.correct_option, tq.marks 
         FROM student_answers sa 
         JOIN test_questions tq ON sa.question_id = tq.question_id 
         WHERE sa.attempt_id = ? AND tq.question_type = 'MCQ'`,
        [attemptId]
    );

    let mcqScore = 0;
    for (let ans of answers) {
        const marksAwarded = (ans.selected_option === ans.correct_option) ? ans.marks : 0;
        mcqScore += marksAwarded;
        await db.query(`UPDATE student_answers SET marks_awarded = ? WHERE answer_id = ?`, [marksAwarded, ans.answer_id]);
    }

    await db.query(
        `UPDATE student_tests SET status = 'Submitted', submitted_at = NOW(), obtained_marks = ? WHERE attempt_id = ?`,
        [mcqScore, attemptId]
    );
}

module.exports = {
    getTeacherAssignments, createTest, updateTest, publishTest, deleteTest,
    getTeacherTests, getTestById, addQuestion, updateQuestion, deleteQuestion, getQuestions,
    getStudentTests, startTestAttempt, saveStudentAnswer, submitTestAttempt
};

// const db = require("../config/db");

// /*
// =====================================
// Teacher Assignments
// =====================================
// */

// async function getTeacherAssignments(userId) {

//     const [rows] = await db.query(

//         `
//         SELECT

//             ts.id AS teacher_subject_id,

//             s.subject_name,

//             b.batch_name

//         FROM teachers t

//         JOIN teacher_subject ts
//             ON t.teacher_id = ts.teacher_id

//         JOIN subjects s
//             ON ts.subject_id = s.subject_id

//         JOIN batches b
//             ON ts.batch_id = b.batch_id

//         WHERE t.user_id = ?

//         ORDER BY
//             b.batch_name,
//             s.subject_name
//         `,

//         [userId]

//     );

//     return rows;

// }

// /*
// =====================================
// Create Test
// =====================================
// */

// async function createTest(data) {

//     const [result] = await db.query(

//         `
//         INSERT INTO tests
//         (

//             teacher_subject_id,

//             title,

//             description,

//             duration,

//             total_marks,

//             test_date,

//             status

//         )

//         VALUES
//         (
//             ?,?,?,?,?,?,?
//         )
//         `,

//         [

//             data.teacher_subject_id,

//             data.title,

//             data.description,

//             data.duration,

//             data.total_marks,

//             data.test_date,

//             data.status || "Draft"

//         ]

//     );

//     return result.insertId;

// }

// /*
// =====================================
// Add Question
// =====================================
// */

// async function addQuestion(data) {

//     const [result] = await db.query(

//         `
//         INSERT INTO test_questions
//         (

//             test_id,

//             question_text,

//             question_type,

//             option_a,

//             option_b,

//             option_c,

//             option_d,

//             correct_option,

//             marks,

//             question_order

//         )

//         VALUES
//         (
//             ?,?,?,?,?,?,?,?,?,?
//         )
//         `,

//         [

//             data.test_id,

//             data.question_text,

//             data.question_type,

//             data.option_a,

//             data.option_b,

//             data.option_c,

//             data.option_d,

//             data.correct_option,

//             data.marks,

//             data.question_order

//         ]

//     );

//     return result.insertId;

// }

// /*
// =====================================
// Teacher Tests
// =====================================
// */

// async function getTeacherTests(userId) {

//     const [rows] = await db.query(

//         `
//         SELECT

//             t.*,

//             s.subject_name,

//             b.batch_name,

//             COUNT(q.question_id) AS questions

//         FROM tests t

//         JOIN teacher_subject ts
//             ON t.teacher_subject_id = ts.id

//         JOIN teachers tr
//             ON ts.teacher_id = tr.teacher_id

//         JOIN subjects s
//             ON ts.subject_id = s.subject_id

//         JOIN batches b
//             ON ts.batch_id = b.batch_id

//         LEFT JOIN test_questions q
//             ON t.test_id = q.test_id

//         WHERE tr.user_id = ?

//         GROUP BY t.test_id

//         ORDER BY t.created_at DESC
//         `,

//         [userId]

//     );

//     return rows;

// }
// /*
// =====================================
// Single Test
// =====================================
// */

// async function getTestById(testId, userId) {

//     const [rows] = await db.query(

//         `
//         SELECT

//             t.*

//         FROM tests t

//         JOIN teacher_subject ts
//             ON t.teacher_subject_id = ts.id

//         JOIN teachers tr
//             ON ts.teacher_id = tr.teacher_id

//         WHERE

//             t.test_id = ?

//             AND

//             tr.user_id = ?

//         `,

//         [

//             testId,

//             userId

//         ]

//     );

//     return rows[0];

// }

// /*
// =====================================
// Test Questions
// =====================================
// */

// async function getQuestions(testId) {

//     const [rows] = await db.query(

//         `
//         SELECT *

//         FROM test_questions

//         WHERE test_id = ?

//         ORDER BY question_order
//         `,

//         [testId]

//     );

//     return rows;

// }

// /*
// =====================================
// Update Test
// =====================================
// */

// async function updateTest(data) {

//     await db.query(

//         `
//         UPDATE tests

//         SET

//             teacher_subject_id=?,

//             title=?,

//             description=?,

//             duration=?,

//             total_marks=?,

//             test_date=?,

//             status=?

//         WHERE

//             test_id=?

//         `,

//         [

//             data.teacher_subject_id,

//             data.title,

//             data.description,

//             data.duration,

//             data.total_marks,

//             data.test_date,

//             data.status,

//             data.test_id

//         ]

//     );

// }

// /*
// =====================================
// Delete Test
// =====================================
// */

// async function deleteTest(testId,userId){

//     const [result]=await db.query(

//         `
//         DELETE t

//         FROM tests t

//         JOIN teacher_subject ts
//             ON t.teacher_subject_id=ts.id

//         JOIN teachers tr
//             ON ts.teacher_id=tr.teacher_id

//         WHERE

//             t.test_id=?

//             AND

//             tr.user_id=?

//         `,

//         [

//             testId,

//             userId

//         ]

//     );

//     return result.affectedRows;

// }

// module.exports={

//     getTeacherAssignments,

//     createTest,

//     addQuestion,

//     getTeacherTests,

//     getTestById,

//     getQuestions,

//     updateTest,

//     deleteTest

// };