const db = require("../config/db");

async function getAllNotices() {
    const [rows] = await db.query(
        `SELECT n.notice_id, n.title, n.description, n.created_at, u.full_name AS created_by_name
         FROM notices n
         LEFT JOIN users u ON n.created_by = u.user_id
         ORDER BY n.created_at DESC`
    );
    return rows;
}

async function createNotice(data) {
    const [result] = await db.query(
        `INSERT INTO notices (title, description, created_by, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [data.title, data.description, data.created_by]
    );
    return result.insertId;
}

async function deleteNotice(noticeId) {
    const [result] = await db.query(
        `DELETE FROM notices WHERE notice_id = ?`,
        [noticeId]
    );
    return result.affectedRows;
}

module.exports = {
    getAllNotices,
    createNotice,
    deleteNotice
};