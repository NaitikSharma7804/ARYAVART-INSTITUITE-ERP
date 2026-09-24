const mysql = require("mysql2/promise");
require("dotenv").config();

const isTiDB = process.env.DB_SSL === "true" || 
    (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com")) ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("tidbcloud.com"));

let poolConfig;

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        poolConfig = {
            host: url.hostname,
            port: url.port ? Number(url.port) : 4000,
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database: url.pathname.replace(/^\//, '') || "aryavart",
            ssl: isTiDB ? {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            } : undefined,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: true
        };
    } catch (e) {
        // Fallback for simple mysql URI
        poolConfig = {
            uri: process.env.DATABASE_URL,
            ssl: isTiDB ? {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            } : undefined,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: true
        };
    }
} else {
    poolConfig = {
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
    };
}

const pool = mysql.createPool(poolConfig);

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