require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../config/db");

async function seed() {

    try {

console.log("🌱 Seeding Database...");

// 1
await db.query(`
INSERT INTO classes (class_name)
VALUES
('XI'),
('XII')
`);

console.log("✅ Classes Added");

// 2
await db.query(`
INSERT INTO batches
(batch_name,class_id,room_no,start_time,end_time)
VALUES
('IIT-A',2,'R101','09:00:00','11:00:00'),
('IIT-B',2,'R102','11:00:00','13:00:00'),
('NEET-A',2,'R201','14:00:00','16:00:00'),
('FOUNDATION',1,'R301','08:00:00','10:00:00')
`);

console.log("✅ Batches Added");

    } catch(err){

        console.log(err);

    }

}

seed();