const db = require("../config/db");

async function findByPhone(phone) {
    const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    return rows[0];
}

async function findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
}

async function findById(userId) {
    const [rows] = await db.query(
        "SELECT user_id, full_name, email, phone, role, status, profile_photo, created_at FROM users WHERE user_id = ?",
        [userId]
    );
    return rows[0];
}

async function createUser(userData) {
    const {
        full_name,
        email = null,
        phone = null,
        password_hash = null,
        role = "STUDENT",
        profile_photo = null,
        status = "ACTIVE"
    } = userData;

    const [result] = await db.query(
        "INSERT INTO users (full_name, email, phone, password_hash, role, profile_photo, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [full_name, email, phone, password_hash, role, profile_photo, status]
    );
    return result.insertId;
}

async function createUserRoleProfile(userId, role) {
    const normalizedRole = (role || "").toUpperCase();
    try {
        if (normalizedRole === "STUDENT") {
            const [existing] = await db.query("SELECT student_id FROM students WHERE user_id = ?", [userId]);
            if (existing.length === 0) {
                await db.query(
                    "INSERT INTO students (user_id, admission_date) VALUES (?, CURDATE())",
                    [userId]
                );
            }
        } else if (normalizedRole === "TEACHER") {
            const [existing] = await db.query("SELECT teacher_id FROM teachers WHERE user_id = ?", [userId]);
            if (existing.length === 0) {
                await db.query(
                    "INSERT INTO teachers (user_id, joining_date) VALUES (?, CURDATE())",
                    [userId]
                );
            }
        } else if (normalizedRole === "PARENT") {
            const [existing] = await db.query("SELECT parent_id FROM parents WHERE user_id = ?", [userId]);
            if (existing.length === 0) {
                await db.query(
                    "INSERT INTO parents (user_id) VALUES (?)",
                    [userId]
                );
            }
        }
    } catch (err) {
        console.error("Error creating role profile for user " + userId + ":", err);
    }
}

module.exports = {
    findByPhone,
    findByEmail,
    findById,
    createUser,
    createUserRoleProfile
};
