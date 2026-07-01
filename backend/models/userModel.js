const db = require("../config/db");

/**
 * Find user by phone number
 */
async function findByPhone(phone) {

    const [rows] = await db.query(

        "SELECT * FROM users WHERE phone = ?",

        [phone]

    );

    return rows[0];
}

/**
 * Find user by email
 */
async function findByEmail(email) {

    const [rows] = await db.query(

        "SELECT * FROM users WHERE email = ?",

        [email]

    );

    return rows[0];
}

/**
 * Find user by ID
 */
async function findById(userId) {

    const [rows] = await db.query(

        `SELECT
            user_id,
            full_name,
            email,
            phone,
            role,
            status,
            profile_photo,
            created_at
         FROM users
         WHERE user_id = ?`,

        [userId]

    );

    return rows[0];
}

/**
 * Create new user
 */
async function createUser(userData) {

    const {

        full_name,

        email,

        phone,

        password_hash,

        role

    } = userData;

    const [result] = await db.query(

        `INSERT INTO users
        (
            full_name,
            email,
            phone,
            password_hash,
            role
        )

        VALUES

        (?, ?, ?, ?, ?)`,

        [

            full_name,

            email,

            phone,

            password_hash,

            role

        ]

    );

    return result.insertId;

}

module.exports = {

    findByPhone,

    findByEmail,

    findById,

    createUser

};