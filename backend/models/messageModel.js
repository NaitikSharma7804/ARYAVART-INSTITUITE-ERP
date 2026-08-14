const db = require("../config/db");

async function getTeacherParentContacts(teacherUserId) {
    // Get unique parents of students that belong to batches this teacher teaches
    // We join the users table twice: u_student (for student name) and u_parent (for parent name)
    const [rows] = await db.query(
        `SELECT DISTINCT 
            p.user_id AS parent_user_id, 
            u_parent.full_name AS parent_name, 
            u_student.full_name AS student_name, 
            b.batch_name
         FROM teachers tr
         JOIN teacher_subject ts ON tr.teacher_id = ts.teacher_id
         JOIN batches b ON ts.batch_id = b.batch_id
         JOIN students st ON b.batch_id = st.batch_id
         JOIN users u_student ON st.user_id = u_student.user_id 
         JOIN parents p ON st.parent_id = p.parent_id
         JOIN users u_parent ON p.user_id = u_parent.user_id
         WHERE tr.user_id = ?
         ORDER BY u_student.full_name ASC`,
        [teacherUserId]
    );
    return rows;
}

async function getConversation(user1Id, user2Id) {
    const [rows] = await db.query(
        `SELECT * FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY sent_at ASC`,
        [user1Id, user2Id, user2Id, user1Id]
    );
    return rows;
}

async function sendMessage(senderId, receiverId, content) {
    const [result] = await db.query(
        `INSERT INTO messages (sender_id, receiver_id, content, sent_at) 
         VALUES (?, ?, ?, NOW())`,
        [senderId, receiverId, content]
    );
    return result.insertId;
}

module.exports = {
    getTeacherParentContacts,
    getConversation,
    sendMessage
};