const mysql = require("mysql2/promise");
require("dotenv").config();

const isTiDB = process.env.DB_SSL === "true" || (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isTiDB ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true
});

async function testConnection(){

    try{

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected Successfully");

        connection.release();

    }

    catch(error){

        console.log("❌ Database Connection Failed");

        console.log(error.message);

    }

}

testConnection();

module.exports = pool;