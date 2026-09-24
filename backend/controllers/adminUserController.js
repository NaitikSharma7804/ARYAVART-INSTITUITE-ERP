const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// exports.createUser = async (req, res) => {
//     try {
//         const { full_name, email, phone, password, role } = req.body;

//         // 1. Hash the password securely
//         const password_hash = await bcrypt.hash(password, 10);

//         // 2. Use the unified createUser function from your model
//         const userId = await User.createUser({
//             full_name,
//             email,
//             phone,
//             password_hash,
//             role
//         });

//         res.status(201).json({ 
//             success: true, 
//             message: "User created securely!", 
//             userId 
//         });
//     } catch (err) {
//         console.error("User Creation Error:", err);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

exports.createUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // DEBUG LINE
        const { full_name, email, phone, password, role } = req.body;
        
        // ... hashing and database logic
    } catch (err) {
        console.error("DEBUG ERROR:", err); // FULL ERROR DETAILS
        res.status(500).json({ success: false, message: err.message });
    }
};